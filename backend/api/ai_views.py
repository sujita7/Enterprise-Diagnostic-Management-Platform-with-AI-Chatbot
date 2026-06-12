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
    import chromadb
    from chromadb.utils import embedding_functions
except ImportError:
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
        history = request.data.get('history', [])
        
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key or api_key == "your_openai_api_key_here":
            lower_msg = message.lower()
            
            # Clean punctuation and tokenize query
            clean_msg = "".join(c if c.isalnum() or c.isspace() else " " for c in lower_msg)
            raw_tokens = [w for w in clean_msg.split() if len(w) >= 2]
            
            # Stop words to ignore during search to prevent false positive matches
            stop_words = {
                'the', 'and', 'for', 'with', 'about', 'need', 'want', 'book', 'show', 'please', 
                'test', 'tests', 'profile', 'panel', 'blood', 'urine', 'serum', 'routine', 
                'microscopy', 'done', 'get', 'have', 'your', 'this', 'that', 'from', 'help',
                'require', 'required', 'hours', 'hour'
            }
            query_tokens = [t for t in raw_tokens if t not in stop_words]

            # 1. Symptom mapping to specific tests
            symptom_map = {
                ('fatigue', 'tired', 'weak', 'energy', 'pale', 'blood', 'anemia', 'dizzy'): 'CBC (Complete Blood Count)',
                ('sugar', 'diabetes', 'diabetic', 'sweet', 'glucose', 'hba1c', 'fasting sugar'): 'HbA1c (Glycated Hemoglobin)',
                ('thyroid', 'weight gain', 'weight loss', 'cold', 'hypo', 'hyper', 'tsh', 'hair loss'): 'TSH (Thyroid Stimulating Hormone)',
                ('cholesterol', 'lipid', 'fat', 'heart', 'cardiac', 'stroke', 'arteries'): 'Lipid Profile',
                ('kidney', 'renal', 'creatinine', 'urea', 'uric acid', 'kft', 'kidney pain'): 'Kidney Function Test (KFT)',
                ('liver', 'jaundice', 'lft', 'hepatic', 'bile', 'alcohol'): 'Liver Function Test (LFT)',
                ('bones', 'body pain', 'bone pain', 'vit d', 'vitamin d', 'sunlight'): 'Vitamin D (25-Hydroxy)',
                ('nerves', 'neuropathy', 'b12', 'cobalamin', 'tingling'): 'Vitamin B12',
                ('uti', 'urine', 'burning urination', 'urinary', 'bladder'): 'Urine Routine & Microscopy',
            }

            matched_by_symptom = None
            for symptoms, test_name in symptom_map.items():
                if any(symptom in lower_msg for symptom in symptoms):
                    matched_by_symptom = Test.objects.filter(name__iexact=test_name).first()
                    if matched_by_symptom:
                        break

            # 2. General scored matching
            scored_tests = []
            for test in Test.objects.all():
                test_name_lower = test.name.lower()
                test_aliases = [a.strip().lower() for a in test.aliases.split(',') if a.strip()]
                test_desc_lower = test.description.lower()
                
                score = 0
                
                # Exact match on alias or name abbreviation in raw query
                for alias in test_aliases:
                    if alias in raw_tokens or alias == lower_msg.strip():
                        score += 100
                    elif alias in lower_msg:
                        score += 50
                        
                # Exact abbreviation check in name (e.g. TSH)
                name_words = test_name_lower.replace('(', ' ').replace(')', ' ').split()
                for t_word in name_words:
                    if t_word in raw_tokens:
                        if len(t_word) >= 3 and t_word not in stop_words:
                            score += 40
                
                # Query token intersection scores
                for token in query_tokens:
                    if token in test_name_lower:
                        score += 15
                    for alias in test_aliases:
                        if token in alias:
                            score += 10
                    if token in test_desc_lower:
                        score += 3
                
                if score > 0:
                    scored_tests.append((test, score))
            
            # Sort by score descending
            scored_tests.sort(key=lambda x: x[1], reverse=True)
            
            primary_test = None
            if matched_by_symptom:
                primary_test = matched_by_symptom
            elif scored_tests:
                primary_test = scored_tests[0][0]

            # 3. Intent detection to give highly accurate medical answer
            if primary_test:
                is_fasting_query = any(w in lower_msg for w in ['fast', 'fasting', 'eat', 'drink', 'prep', 'prepare', 'preparation'])
                is_why_query = any(w in lower_msg for w in ['why', 'reason', 'need', 'purpose', 'when', 'symptom', 'cause'])
                is_interpret_query = any(w in lower_msg for w in ['interpret', 'range', 'normal', 'result', 'reading', 'high', 'low'])
                
                t = primary_test
                
                title = f"### 🤖 **AI Health Assistant: {t.name}**\n\n"
                
                if is_fasting_query:
                    reply = (
                        f"{title}"
                        f"Here is the preparation and fasting guide for the **{t.name}**:\n\n"
                        f"- **Fasting Requirement**: **{t.fasting}**\n"
                        f"- **Instructions**: {t.prep if t.prep else 'No special preparation needed.'}\n\n"
                        f"💵 **Price**: ₹{t.price} (MRP: ~~₹{t.original_price}~~) | ⏱️ **Reports**: {t.reports}\n"
                        f"💡 *Would you like to book this test? You can add it directly to your cart.*"
                    )
                elif is_why_query:
                    reply = (
                        f"{title}"
                        f"Here is why the **{t.name}** is performed and what it identifies:\n\n"
                        f"📊 **Why get tested?**\n{t.why if t.why else t.description}\n\n"
                        f"🔍 **What it identifies:**\n{t.identifies if t.identifies else 'General systemic conditions.'}\n\n"
                        f"💡 *To proceed, you can add this test to your cart and schedule a free home sample collection.*"
                    )
                elif is_interpret_query:
                    reply = (
                        f"{title}"
                        f"Here is how to interpret the results of your **{t.name}**:\n\n"
                        f"📈 **Interpretation Guide:**\n{t.interpretations if t.interpretations else 'Please consult your referring physician for a comprehensive clinical review.'}\n\n"
                        f"🔬 **Measures:**\n{t.measures if t.measures else 'Standard clinical biomarkers.'}\n\n"
                        f"⚠️ *Disclaimer: Automated summaries are educational. Always verify results with a medical professional.*"
                    )
                else:
                    # Comprehensive summary
                    reply = (
                        f"{title}"
                        f"**{t.name}** evaluates key biomarkers to assess your health. Here is a clinical overview:\n\n"
                        f"📋 **About the Test:**\n{t.about if t.about else t.description}\n\n"
                        f"🔬 **What it Measures:**\n{t.measures if t.measures else 'Diagnostic blood parameters.'}\n\n"
                        f"📊 **Why you need it:**\n{t.why if t.why else 'Screening and diagnosis.'}\n\n"
                        f"🔑 **Preparation & Fasting:**\n- **Fasting Requirement**: **{t.fasting}**\n- **Details**: {t.prep if t.prep else 'No special preparation.'}\n\n"
                        f"💰 **Pricing**: ₹{t.price} (MRP: ~~₹{t.original_price}~~) | ⏱️ **Reports**: {t.reports}\n\n"
                        f"💡 *Would you like me to help you add this test to your cart or explain how to book a slot?*"
                    )
            elif "hello" in lower_msg or "hi" in lower_msg or "hey" in lower_msg:
                reply = (
                    f"### 🤖 **AI Health Concierge Response**\n\n"
                    f"Hello there! I am your AI Health Assistant. I can help you: \n"
                    f"1. **Find lab tests** by symptom or name (e.g., CBC, Glucose, Thyroid)\n"
                    f"2. **Explain test preparation guidelines** (fasting, scheduling)\n"
                    f"3. **Guide you through the booking process**\n\n"
                    f"What symptoms are you experiencing, or what specific test are you looking for today?"
                )
            elif "list" in lower_msg or "all tests" in lower_msg or "available tests" in lower_msg:
                all_tests = Test.objects.all()[:5]
                tests_str = "\n".join([f"- **{t.name}** (₹{t.price})" for t in all_tests])
                reply = (
                    f"### 🤖 **AI Health Concierge Response**\n\n"
                    f"We provide a comprehensive range of clinical diagnostic tests. Here are some of our top selections:\n\n"
                    f"{tests_str}\n\n"
                    f"Feel free to ask about any of these specifically (e.g., *'Tell me about the CBC test'* or *'How to prepare for Liver Function Test'*)."
                )
            elif "cart" in lower_msg or "add" in lower_msg:
                reply = (
                    f"### 🤖 **AI Health Concierge Response**\n\n"
                    f"To purchase a test or health package:\n"
                    f"1. Navigate to the **Tests** or **Packages** catalog from the header menu.\n"
                    f"2. Click the blue **Add to Cart** button on the desired item.\n"
                    f"3. Open the **Cart Drawer** from the top right header to view your items, see savings, and click **Proceed to Checkout**."
                )
            elif "checkout" in lower_msg or "book" in lower_msg or "schedule" in lower_msg:
                reply = (
                    f"### 🤖 **AI Health Concierge Response**\n\n"
                    f"Booking is quick and fully digitized:\n"
                    f"1. Add the tests you want to your cart.\n"
                    f"2. Open the **Cart Drawer** from the top-right header.\n"
                    f"3. Click **Proceed to Checkout** to fill in patient details (Age, Gender, Contact), select a dynamic Home Collection timeslot, apply coupons, and confirm your booking!"
                )
            else:
                reply = (
                    f"### 🤖 **AI Health Concierge Response**\n\n"
                    f"I understand you are asking about clinical diagnostics. To provide the best assistance, could you name a specific test (like **CBC**, **Thyroid**, **HbA1c**, **Kidney Test**) or specify a general concern?\n\n"
                    f"Alternatively, you can upload a prescription PDF or image in the section above to receive instant, tailored test recommendations."
                )
            return Response({"reply": reply})

        client = OpenAI(api_key=api_key)
        
        system_prompt = "You are a helpful AI health assistant for a hospital/lab test booking platform. You can answer questions about tests, how to prepare for them, and guide users to book them."
        
        messages = [{"role": "system", "content": system_prompt}]
        for msg in history:
            messages.append({"role": msg.get("role"), "content": msg.get("content")})
        
        messages.append({"role": "user", "content": message})

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages
            )
            reply = response.choices[0].message.content
            return Response({"reply": reply})
        except Exception as e:
            return Response({"error": str(e)}, status=500)

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
        
        emb_fn = embedding_functions.DefaultEmbeddingFunction()
        
        collection = chroma_client.get_or_create_collection(name="tests", embedding_function=emb_fn)
        
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

