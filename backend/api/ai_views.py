import os
import json
from io import BytesIO
import PyPDF2
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .models import Test, UploadedPrescription
from .serializers import TestSerializer
from openai import OpenAI

try:
    __import__('pysqlite3')
    import sys
    sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')
except ImportError:
    pass

try:
    import chromadb
    from chromadb.utils import embedding_functions
except ImportError as e:
    print(f"Failed to import chromadb: {e}")
    chromadb = None

class SymptomCheckerView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        symptoms = request.data.get('symptoms', '')
        if not symptoms:
            return Response({"error": "Please provide symptoms"}, status=400)
        
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key or api_key == "your_openai_api_key_here":
            # Mock response if key is missing
            return Response({
                "message": "OpenAI API key missing. Mock response.",
                "recommended_tests": TestSerializer(Test.objects.all()[:3], many=True).data,
                "disclaimer": "These recommendations are informational and not a diagnosis."
            })

        client = OpenAI(api_key=api_key)
        
        tests = Test.objects.all()
        test_context = "\n".join([f"ID: {t.id}, Name: {t.name}, Description: {t.description}" for t in tests])

        prompt = f"""
        You are a medical lab assistant. Based on the following symptoms: "{symptoms}"
        Which of the following tests are relevant? 
        Available tests:
        {test_context}

        Return a JSON array of integers representing the relevant test IDs. Only return the JSON array, nothing else.
        """

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2
            )
            content = response.choices[0].message.content.strip()
            
            if content.startswith("```json"):
                content = content[7:-3]
            elif content.startswith("```"):
                content = content[3:-3]
            
            test_ids = json.loads(content)
            
            relevant_tests = Test.objects.filter(id__in=test_ids)
            serialized_tests = TestSerializer(relevant_tests, many=True).data
            
            return Response({
                "recommended_tests": serialized_tests,
                "disclaimer": "These recommendations are informational and not a diagnosis."
            })
            
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class ChatbotView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        message = request.data.get('message', '')
        
        # Fetch the HuggingFace Token securely from environment variables
        hf_token = os.environ.get("HF_TOKEN")
        if not hf_token:
            return Response({"error": "Hugging Face API token missing. Please configure HF_TOKEN in your .env file."}, status=500)
        
        try:
            from huggingface_hub import InferenceClient
        except ImportError:
            return Response({"error": "huggingface_hub is not installed."}, status=500)

        # Initialize ChromaDB
        if chromadb is None:
            return Response({"error": "ChromaDB is not available. Please check server logs for import errors."}, status=500)
            
        db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "chroma_db")
        chroma_client = chromadb.PersistentClient(path=db_path)
        
        api_key = os.environ.get("OPENAI_API_KEY")
        if api_key and api_key != "your_openai_api_key_here":
            emb_fn = embedding_functions.OpenAIEmbeddingFunction(
                api_key=api_key,
                model_name="text-embedding-ada-002"
            )
            collection_name = "tests_openai_rag_v2"
        else:
            emb_fn = embedding_functions.HuggingFaceEmbeddingFunction(
                api_key=hf_token,
                model_name="sentence-transformers/all-MiniLM-L6-v2"
            )
            collection_name = "tests_hf_api_rag_v2"
        
        # Get or create collection
        collection = chroma_client.get_or_create_collection(name=collection_name, embedding_function=emb_fn)
        
        # Index tests if collection is empty
        if collection.count() == 0:
            tests = Test.objects.all()
            if tests.exists():
                documents = []
                ids = []
                for t in tests:
                    doc = f"Test Name: {t.name}\nAliases: {t.aliases}\nCategory: {t.category}\nDescription: {t.description}\nWhy get this test: {t.why}\nWhat it identifies: {t.identifies}\nPreparation/Fasting: {t.fasting} - {t.prep}\nInterpretation: {t.interpretations}\nPrice: ₹{t.price} (Original: ₹{t.original_price})\nReports delivery: {t.reports}"
                    documents.append(doc)
                    ids.append(str(t.id))
                
                import time
                for attempt in range(3):
                    try:
                        collection.add(documents=documents, ids=ids)
                        break
                    except Exception as e:
                        if attempt == 2:
                            return Response({"error": f"Failed to generate embeddings after 3 attempts. Hugging Face API might be unreachable from Render. Error: {str(e)}"}, status=500)
                        time.sleep(2)

        # Retrieve Top 3 Relevant Documents
        results = collection.query(
            query_texts=[message],
            n_results=3
        )
        
        retrieved_context = "No relevant context found."
        if results['documents'] and len(results['documents'][0]) > 0:
            retrieved_context = "\n\n---\n\n".join(results['documents'][0])
            
        # Format the exact prompt structure provided by the user
        prompt = f"""You are an intelligent AI assistant for an Enterprise Diagnostic Management Platform.

Your job is to help users by answering questions related to:
- system diagnostics
- enterprise workflows
- technical issues
- database records (from retrieved context)
- general troubleshooting

You MUST follow these rules:

1. Always use the provided CONTEXT first.
   If context contains relevant information, prioritize it over general knowledge.

2. If context is not sufficient, clearly say:
   "I don't have enough information in the provided system data to answer this accurately."

3. Do NOT hallucinate or assume missing information.

4. Keep answers:
   - clear
   - professional
   - structured
   - concise but complete

5. If the user asks for steps, always respond in numbered steps.

6. If the user query is technical, include debugging guidance.

7. If the user query is general, keep explanation simple and user-friendly.

8. Always maintain enterprise-level tone (formal, helpful, precise).

9. Never mention internal system design (RAG, embeddings, database, etc.).

---

CONTEXT:
{retrieved_context}

USER QUESTION:
{message}

FINAL ANSWER:
"""

        try:
            # Use Qwen2.5-72B-Instruct via Hugging Face Inference API (Supported and Free)
            client = InferenceClient("Qwen/Qwen2.5-72B-Instruct", token=hf_token)
            
            response = client.chat_completion(
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                temperature=0.2
            )
            
            reply = response.choices[0].message.content
            return Response({"reply": reply.strip()})
        except Exception as e:
            return Response({"error": f"Hugging Face API Error: {str(e)}"}, status=500)

class SmartSearchView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response({"results": []})

        if chromadb is None:
            return Response({"error": "ChromaDB not installed or configured"}, status=500)

        db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "chroma_db")
        chroma_client = chromadb.PersistentClient(path=db_path)
        
        api_key = os.environ.get("OPENAI_API_KEY")
        if api_key and api_key != "your_openai_api_key_here":
            emb_fn = embedding_functions.OpenAIEmbeddingFunction(
                api_key=api_key,
                model_name="text-embedding-ada-002"
            )
        else:
            hf_token = os.environ.get("HF_TOKEN")
            if hf_token:
                emb_fn = embedding_functions.HuggingFaceEmbeddingFunction(
                    api_key=hf_token,
                    model_name="sentence-transformers/all-MiniLM-L6-v2"
                )
            else:
                emb_fn = embedding_functions.DefaultEmbeddingFunction()
        
        collection = chroma_client.get_or_create_collection(name="tests_api_search", embedding_function=emb_fn)
        
        if collection.count() == 0:
            tests = Test.objects.all()
            if tests.exists():
                documents = [f"{t.name} - {t.category}: {t.description}" for t in tests]
                ids = [str(t.id) for t in tests]
                metadatas = [{"name": t.name} for t in tests]
                collection.add(documents=documents, metadatas=metadatas, ids=ids)

        if collection.count() == 0:
             return Response({"results": []})
             
        results = collection.query(
            query_texts=[query],
            n_results=3
        )
        
        if results['ids'] and len(results['ids'][0]) > 0:
            test_ids = [int(i) for i in results['ids'][0]]
            matched_tests = Test.objects.filter(id__in=test_ids)
            ordered_tests = sorted(matched_tests, key=lambda x: test_ids.index(x.id))
            return Response({"results": TestSerializer(ordered_tests, many=True).data})
            
        return Response({"results": []})

class AnalyzeReportView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        report_file = request.FILES.get('report') or request.FILES.get('file')
        if not report_file:
            return Response({"error": "No report or prescription file provided. Please attach a PDF or image under 'report' or 'file' key."}, status=400)
            
        file_name = report_file.name.lower()
        allowed_extensions = ('.pdf', '.png', '.jpg', '.jpeg', '.gif', '.webp')
        if not file_name.endswith(allowed_extensions):
            return Response({"error": "Invalid file format. Please upload a PDF or an image (PNG, JPG, JPEG, GIF, WEBP)."}, status=400)

        # Create database record
        prescription = UploadedPrescription.objects.create(
            user=request.user if request.user.is_authenticated else None,
            file=report_file
        )

        api_key = os.environ.get("OPENAI_API_KEY")
        is_mock = not api_key or api_key == "your_openai_api_key_here"

        if is_mock:
            # Generate a helpful mock analysis depending on the file type/name
            if file_name.endswith('.pdf'):
                analysis = "Mock PDF Analysis:\n- Complete Blood Count (CBC): Hemoglobin is 12.8 g/dL (normal range: 13.5-17.5 g/dL). Slipped slightly below average; mild fatigue may occur.\n- Thyroid Profile (TSH): 2.4 uIU/mL (normal range: 0.4-4.0 uIU/mL). Thyroid function is normal.\n- Vitamin D: 22 ng/mL (optimal range: 30-100 ng/mL). Deficient. Recommend dietary adjustments and sun exposure."
            else:
                analysis = "Mock Image/Prescription Analysis:\n- Detected hand-written prescription or report snapshot.\n- Suggested test matching content: Complete Blood Count (CBC) and Vitamin D3 Test.\n- Patient Advice: Ensure adequate hydration prior to sample collection. Report delivery time is estimated within 6-12 hours."
            
            prescription.analysis_result = analysis
            prescription.save()

            return Response({
                "analysis": analysis,
                "disclaimer": "WARNING: Results are informational/educational and should be reviewed by a clinician. Saved successfully to database (ID: {}).".format(prescription.id)
            })

        # Non-mock mode: OpenAI API Key exists
        if file_name.endswith('.pdf'):
            # Extract text from PDF in memory
            try:
                pdf_reader = PyPDF2.PdfReader(BytesIO(report_file.read()))
                extracted_text = ""
                for page in pdf_reader.pages:
                    extracted_text += page.extract_text() + "\n"
            except Exception as e:
                return Response({"error": f"Failed to read PDF: {str(e)}"}, status=500)
            
            prompt = f"""
            You are a medical AI assistant. Analyze the following extracted text from a lab report and provide a simple, 
            easy-to-understand explanation for the patient. Keep it concise. Highlight any abnormalities clearly.
            
            Report Text:
            {extracted_text}
            """
        else:
            # It's an image. If OpenAI supports vision or we send a placeholder prompt for mock image analysis
            prompt = f"You are a medical AI assistant. A patient has uploaded a prescription image named '{report_file.name}'. Suggest 2-3 standard diagnostic tests they should undergo based on typical clinical checkups. Keep it brief."

        # Call LLM
        client = OpenAI(api_key=api_key)
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2
            )
            analysis = response.choices[0].message.content.strip()
            
            # Save analysis to database
            prescription.analysis_result = analysis
            prescription.save()

            return Response({
                "analysis": analysis,
                "disclaimer": "WARNING: Results are educational and should be reviewed by a clinician. Your report data was processed by OpenAI. Saved to database (ID: {}).".format(prescription.id)
            })
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class PersonalizedSuggestionsView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        age = request.data.get('age')
        gender = request.data.get('gender')
        lifestyle = request.data.get('lifestyle')
        medical_history = request.data.get('medical_history')

        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key or api_key == "your_openai_api_key_here":
            return Response({
                "suggestions": ["Diabetes Screening", "Heart Screening"],
                "disclaimer": "Mock response."
            })

        client = OpenAI(api_key=api_key)
        
        prompt = f"""
        Based on the following patient profile:
        Age: {age}
        Gender: {gender}
        Lifestyle: {lifestyle}
        Medical History: {medical_history}

        Suggest 2-4 general health screening categories or specific tests they should consider.
        Return ONLY a JSON array of strings representing the names of the tests/categories.
        """

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3
            )
            content = response.choices[0].message.content.strip()
            if content.startswith("```json"): content = content[7:-3]
            elif content.startswith("```"): content = content[3:-3]
            
            suggestions = json.loads(content)
            return Response({"suggestions": suggestions})
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class PackageGeneratorView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user_request = request.data.get('request', '')
        if not user_request:
            return Response({"error": "Please provide a request."}, status=400)

        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key or api_key == "your_openai_api_key_here":
            mock_tests = TestSerializer(Test.objects.all()[:2], many=True).data
            return Response({
                "package_name": "Mock Health Package",
                "recommended_tests": mock_tests
            })

        client = OpenAI(api_key=api_key)
        tests = Test.objects.all()
        test_context = "\n".join([f"ID: {t.id}, Name: {t.name}, Price: {t.price}" for t in tests])

        prompt = f"""
        You are a health package generator. The user says: "{user_request}"
        Create a custom health package using ONLY the available tests below.
        
        Available tests:
        {test_context}

        Return a JSON object strictly in this format:
        {{
            "package_name": "A catchy name for the package",
            "test_ids": [list of integers representing the chosen test IDs]
        }}
        """

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3
            )
            content = response.choices[0].message.content.strip()
            if content.startswith("```json"): content = content[7:-3]
            elif content.startswith("```"): content = content[3:-3]
            
            package_data = json.loads(content)
            
            test_ids = package_data.get('test_ids', [])
            relevant_tests = Test.objects.filter(id__in=test_ids)
            
            return Response({
                "package_name": package_data.get('package_name', 'Custom Package'),
                "recommended_tests": TestSerializer(relevant_tests, many=True).data
            })
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class DiseaseRiskPredictionView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        age = request.data.get('age')
        bmi = request.data.get('bmi')
        blood_pressure = request.data.get('blood_pressure')
        glucose = request.data.get('glucose')

        if None in [age, bmi, blood_pressure, glucose]:
            return Response({"error": "Please provide age, bmi, blood_pressure, and glucose."}, status=400)

        try:
            model_path = os.path.join(os.path.dirname(__file__), "disease_risk_model.joblib")
            if not os.path.exists(model_path):
                 return Response({"error": "Model not trained yet."}, status=500)
                 
            import joblib
            import numpy as np
            
            clf = joblib.load(model_path)
            
            features = np.array([[float(age), float(bmi), float(blood_pressure), float(glucose)]])
            prediction = clf.predict(features)[0]
            
            return Response({
                "prediction": prediction,
                "disclaimer": "WARNING: This is an automated machine learning prediction based on synthetic data for educational purposes. It is not a real medical diagnosis."
            })
        except Exception as e:
            return Response({"error": str(e)}, status=500)

