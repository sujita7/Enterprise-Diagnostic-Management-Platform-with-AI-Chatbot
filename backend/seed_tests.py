import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Test

tests_data = [
    {
        'name': 'CBC (Complete Blood Count)',
        'description': 'Evaluates overall health and detects wide range of disorders, including anemia and infection.',
        'price': 350,
        'original_price': 525,
        'category': 'Blood',
        'parameters': 24,
        'fasting': 'Not Required',
        'reports': '12 hours',
        'aliases': 'Hemogram, Complete Blood Cell Count, CBC with Differential',
        'measures': 'Red blood cells, white blood cells, platelets, hemoglobin, hematocrit, and red cell indices.',
        'identifies': 'Anemia, acute or chronic infections, immune deficiencies, clotting issues, and blood cancers.',
        'about': 'A Complete Blood Count (CBC) is a fundamental diagnostic blood test used to evaluate your overall health status. It measures the levels of various cellular components of the blood to detect broad physiological conditions.',
        'prep': 'No specific preparation or fasting is required. You can eat and drink normally before the blood sample collection.',
        'why': 'This test is routinely recommended as part of an annual checkup, to monitor ongoing treatments, or if you experience fatigue, fever, bruising, or weakness.',
        'interpretations': 'Low hemoglobin or RBC counts suggest anemia. Elevated white blood cell counts typically indicate an active infection or inflammation. Abnormal platelet levels can explain clotting or bleeding issues.'
    },
    {
        'name': 'HbA1c (Glycated Hemoglobin)',
        'description': 'Measures average blood sugar levels over the past 3 months to diagnose or monitor diabetes.',
        'price': 400,
        'original_price': 600,
        'category': 'Diabetes',
        'parameters': 1,
        'fasting': 'Not Required',
        'reports': '12 hours',
        'aliases': 'A1c, Glycohemoglobin, Glycated Hemoglobin Test',
        'measures': 'Percentage of hemoglobin bonded with glucose molecules in the bloodstream over red blood cell lifespan.',
        'identifies': 'Prediabetes, Type 1 Diabetes, Type 2 Diabetes, and long-term blood glucose control quality.',
        'about': 'The HbA1c test reports your average blood glucose levels over the last 90 days. Because red blood cells live for about 3 months, this test provides a stable, long-term history of glucose control.',
        'prep': 'Fasting is not required for this test. You can have it done at any time of the day regardless of meals.',
        'why': 'Highly recommended for diagnosing diabetes or prediabetes, and for routine monitoring in diabetic patients to assess treatment efficacy.',
        'interpretations': 'Below 5.7% is Normal. 5.7% to 6.4% indicates Prediabetes. 6.5% or higher on two separate tests indicates Diabetes.'
    },
    {
        'name': 'TSH (Thyroid Stimulating Hormone)',
        'description': 'Measures TSH levels to screen for and diagnose thyroid disorders like hypo/hyperthyroidism.',
        'price': 350,
        'original_price': 525,
        'category': 'Thyroid',
        'parameters': 1,
        'fasting': 'Not Required',
        'reports': '12 hours',
        'aliases': 'Thyrotropin, Thyroid Stimulating Hormone Serum Test',
        'measures': 'TSH levels produced by the pituitary gland to regulate thyroid activity.',
        'identifies': 'Hypothyroidism (underactive thyroid) and Hyperthyroidism (overactive thyroid).',
        'about': 'TSH tells your thyroid gland how much hormone to produce. When thyroid hormone levels drop, TSH goes up. If thyroid levels are high, TSH drops.',
        'prep': 'No fasting is required, but it is recommended to get the test in the morning as TSH levels fluctuate naturally throughout the day.',
        'why': 'Crucial if you show symptoms like unexplained weight gain or loss, severe fatigue, temperature sensitivity, or dry skin.',
        'interpretations': 'High TSH levels suggest an underactive thyroid (Hypothyroidism). Low TSH levels suggest an overactive thyroid (Hyperthyroidism).'
    },
    {
        'name': 'Lipid Profile',
        'description': 'Checks cholesterol and triglyceride levels to assess cardiovascular risk.',
        'price': 800,
        'original_price': 1200,
        'category': 'Heart',
        'parameters': 7,
        'fasting': 'Required',
        'reports': '12 hours',
        'aliases': 'Cholesterol Panel, Coronary Risk Profile, Lipid Panel',
        'measures': 'Total cholesterol, HDL (good) cholesterol, LDL (bad) cholesterol, VLDL, and triglycerides.',
        'identifies': 'Hypercholesterolemia, risk of heart attack, coronary artery disease, and stroke.',
        'about': 'A lipid profile measures lipids (fats) in your blood. High levels of LDL cholesterol can build up in arteries, leading to cardiovascular complications.',
        'prep': 'Fasting of 10 to 12 hours is mandatory before sample collection. Only water is permitted during this fasting period.',
        'why': 'Essential for evaluating heart health, monitoring cholesterol medication efficacy, and checking cardiovascular risk factors.',
        'interpretations': 'Optimal LDL is below 100 mg/dL. High HDL (above 60 mg/dL) is protective. High triglycerides (above 150 mg/dL) indicate increased metabolic risk.'
    },
    {
        'name': 'Kidney Function Test (KFT)',
        'description': 'Assesses renal health by measuring urea, creatinine, and uric acid.',
        'price': 900,
        'original_price': 1350,
        'category': 'Kidney',
        'parameters': 11,
        'fasting': 'Not Required',
        'reports': '12 hours',
        'aliases': 'Renal Function Test (RFT), Kidney Panel',
        'measures': 'Blood Urea Nitrogen (BUN), serum creatinine, uric acid, electrolytes (sodium, potassium, chloride).',
        'identifies': 'Kidney damage, acute renal failure, chronic kidney disease (CKD), and dehydration.',
        'about': 'The Kidney Function Test evaluates how well your kidneys are filtering wastes from your blood. Healthy kidneys clear creatinine and urea efficiently.',
        'prep': 'No specific fasting is required, but you should avoid eating large amounts of meat before the test.',
        'why': 'Recommended if you have hypertension, diabetes, kidney stones, or symptoms like swelling in feet and hands or changes in urination.',
        'interpretations': 'Elevated creatinine and blood urea nitrogen (BUN) indicate diminished kidney filtration capacity.'
    },
    {
        'name': 'Liver Function Test (LFT)',
        'description': 'Measures key enzymes and proteins to evaluate liver function and health.',
        'price': 900,
        'original_price': 1350,
        'category': 'Liver',
        'parameters': 11,
        'fasting': 'Not Required',
        'reports': '12 hours',
        'aliases': 'Hepatic Function Panel, Liver Panel',
        'measures': 'ALT, AST, ALP enzymes, total protein, albumin, globulin, and total/direct/indirect bilirubin.',
        'identifies': 'Hepatitis, liver cirrhosis, gallbladder obstruction, liver damage from drugs/alcohol.',
        'about': 'Liver Function Tests measure a variety of proteins and enzymes produced by liver tissue to screen for injury, infections, or inflammatory conditions.',
        'prep': 'No fasting is required, though certain medications may affect results. Inform your clinician about current prescriptions.',
        'why': 'Indicated if you experience abdominal pain, jaundice (yellowing of eyes/skin), nausea, or if you regularly consume alcohol.',
        'interpretations': 'Elevated ALT and AST enzymes suggest active liver injury. Higher bilirubin levels indicate bile duct issues or liver dysfunction.'
    },
    {
        'name': 'Vitamin D (25-Hydroxy)',
        'description': 'Determines vitamin D levels to check for deficiency and support bone health.',
        'price': 1200,
        'original_price': 1800,
        'category': 'Vitamins',
        'parameters': 1,
        'fasting': 'Not Required',
        'reports': '12 hours',
        'aliases': '25-OH Vitamin D, Calcidiol Test',
        'measures': 'Concentration of 25-hydroxyvitamin D in the bloodstream.',
        'identifies': 'Vitamin D deficiency, osteoporosis risk, bone weakness, and calcium absorption issues.',
        'about': 'Vitamin D is essential for calcium absorption, maintaining bone density, and regulating immune functions. This test determines your body\'s vitamin D status.',
        'prep': 'No fasting is required for Vitamin D testing.',
        'why': 'Recommended if you experience muscle aches, bone pain, joint stiffness, or if you have limited sunlight exposure.',
        'interpretations': 'Levels below 20 ng/mL indicate deficiency. 20-30 ng/mL is considered insufficient. Over 30 ng/mL is optimal.'
    },
    {
        'name': 'Vitamin B12',
        'description': 'Measures B12 levels which are crucial for nerve function and red blood cell production.',
        'price': 1000,
        'original_price': 1500,
        'category': 'Vitamins',
        'parameters': 1,
        'fasting': 'Not Required',
        'reports': '12 hours',
        'aliases': 'Cobalamin Test, Serum Vitamin B12',
        'measures': 'Vitamin B12 concentration in blood serum.',
        'identifies': 'B12 deficiency, pernicious anemia, neurological dysfunction, and cognitive changes.',
        'about': 'Vitamin B12 is essential for brain health, nerve tissue development, and red blood cell synthesis. A deficiency can cause permanent nerve damage if untreated.',
        'prep': 'No fasting is required, but avoid taking B12 supplements for 24 hours prior to the blood draw.',
        'why': 'Crucial for vegetarians/vegans, older adults, or anyone showing signs of tingling in limbs, memory loss, or chronic fatigue.',
        'interpretations': 'Normal range is 200 to 900 pg/mL. Levels below 200 pg/mL suggest a significant B12 deficiency.'
    },
    {
        'name': 'Urine Routine & Microscopy',
        'description': 'Analyzes urine characteristics to screen for UTIs, kidney disorders, and metabolic issues.',
        'price': 200,
        'original_price': 300,
        'category': 'Urine',
        'parameters': 15,
        'fasting': 'Not Required',
        'reports': '12 hours',
        'aliases': 'Urinalysis, UA, Urine R/M',
        'measures': 'Physical appearance, chemical properties (pH, protein, glucose, ketones), and microscopic elements (RBCs, WBCs, crystals).',
        'identifies': 'Urinary tract infections (UTIs), kidney disease, diabetes (via glucosuria), and hydration status.',
        'about': 'A routine urinalysis screens for early signs of disease. It evaluates physical, chemical, and microscopic features of the urine sample.',
        'prep': 'Clean-catch midstream urine sample is preferred. No fasting is required.',
        'why': 'Highly useful for routine screening, prenatal checkups, pre-surgery evaluation, or if experiencing painful or frequent urination.',
        'interpretations': 'Presence of nitrites or leukocyte esterase suggests a UTI. Protein in urine suggests kidney issues. Glucose indicates potential diabetes.'
    }
]

def seed():
    Test.objects.all().delete()
    print("Deleted existing tests.")
    for data in tests_data:
        Test.objects.create(**data)
    print(f"Successfully seeded {len(tests_data)} tests.")

if __name__ == '__main__':
    seed()
