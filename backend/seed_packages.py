import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import HealthPackage

packages_data = [
    # --- Full Body ---
    {
        'name': 'CBC (complete blood Count)',
        'description': 'Complete Blood Count test parameters',
        'tests': 90,
        'parameters': 90,
        'fasting': 'Required',
        'reports': '6 hours',
        'reports_time_hours': 6,
        'price': 350,
        'original_price': 570,
        'popular': True,
        'category': 'Full Body'
    },
    {
        'name': 'Comprehensive Health Check',
        'description': 'Comprehensive health checkup for general assessment',
        'tests': 64,
        'parameters': 64,
        'fasting': 'Required',
        'reports': '24 hours',
        'reports_time_hours': 24,
        'price': 1499,
        'original_price': 2500,
        'popular': False,
        'category': 'Full Body'
    },
    {
        'name': 'TSH (Thyroid Stimulating Hormone)',
        'description': 'Thyroid Stimulating Hormone level assessment',
        'tests': 90,
        'parameters': 90,
        'fasting': 'Required',
        'reports': '6 hours',
        'reports_time_hours': 6,
        'price': 350,
        'original_price': 570,
        'popular': True,
        'category': 'Full Body'
    },
    {
        'name': 'CBC With ESR (CBC+PS+ESR)',
        'description': 'Complete Blood Count with Erythrocyte Sedimentation Rate',
        'tests': 90,
        'parameters': 90,
        'fasting': 'Required',
        'reports': '6 hours',
        'reports_time_hours': 6,
        'price': 350,
        'original_price': 570,
        'popular': True,
        'category': 'Full Body'
    },
    {
        'name': 'Basic Health Checkup',
        'description': 'Essential screening for overall health',
        'tests': 62,
        'parameters': 62,
        'fasting': 'Required',
        'reports': '24 hours',
        'reports_time_hours': 24,
        'price': 999,
        'original_price': 1999,
        'popular': False,
        'category': 'Full Body'
    },
    {
        'name': 'Advanced Full Body Checkup',
        'description': 'Comprehensive screening with detailed analysis',
        'tests': 98,
        'parameters': 98,
        'fasting': 'Required',
        'reports': '24 hours',
        'reports_time_hours': 24,
        'price': 1999,
        'original_price': 3999,
        'popular': True,
        'category': 'Full Body'
    },
    {
        'name': 'Premium Health Checkup',
        'description': 'Complete health assessment with specialist consultation',
        'tests': 125,
        'parameters': 125,
        'fasting': 'Required',
        'reports': '48 hours',
        'reports_time_hours': 48,
        'price': 3999,
        'original_price': 6999,
        'popular': False,
        'category': 'Full Body'
    },

    # --- Diabetes ---
    {
        'name': 'Diabetes Screening Package',
        'description': 'Early detection and monitoring package',
        'tests': 15,
        'parameters': 15,
        'fasting': 'Required',
        'reports': '6 hours',
        'reports_time_hours': 6,
        'price': 599,
        'original_price': 1199,
        'popular': True,
        'category': 'Diabetes'
    },
    {
        'name': 'Diabetes Screening Profile',
        'description': 'Early detection and monitoring profile',
        'tests': 12,
        'parameters': 12,
        'fasting': 'Required',
        'reports': '8 hours',
        'reports_time_hours': 8,
        'price': 850,
        'original_price': 1200,
        'popular': True,
        'category': 'Diabetes'
    },
    {
        'name': 'HbA1c Test',
        'description': 'Glycated Hemoglobin test for diabetes monitoring',
        'tests': 1,
        'parameters': 1,
        'fasting': 'Not Required',
        'reports': '6 hours',
        'reports_time_hours': 6,
        'price': 400,
        'original_price': 600,
        'popular': False,
        'category': 'Diabetes'
    },
    {
        'name': 'Advanced Diabetes Profile',
        'description': 'Comprehensive diabetes management panel',
        'tests': 28,
        'parameters': 28,
        'fasting': 'Required',
        'reports': '12 hours',
        'reports_time_hours': 12,
        'price': 1299,
        'original_price': 2499,
        'popular': False,
        'category': 'Diabetes'
    },

    # --- Thyroid ---
    {
        'name': 'Thyroid Profile (T3, T4, TSH)',
        'description': 'Standard Thyroid panel',
        'tests': 3,
        'parameters': 3,
        'fasting': 'Not Required',
        'reports': '8 hours',
        'reports_time_hours': 8,
        'price': 400,
        'original_price': 650,
        'popular': False,
        'category': 'Thyroid'
    },
    {
        'name': 'Advanced Thyroid Care',
        'description': 'Detailed thyroid and related panels',
        'tests': 15,
        'parameters': 15,
        'fasting': 'Not Required',
        'reports': '12 hours',
        'reports_time_hours': 12,
        'price': 950,
        'original_price': 1500,
        'popular': True,
        'category': 'Thyroid'
    },
    {
        'name': 'Free Thyroid Profile',
        'description': 'Free T3, Free T4, and TSH',
        'tests': 3,
        'parameters': 3,
        'fasting': 'Not Required',
        'reports': '8 hours',
        'reports_time_hours': 8,
        'price': 750,
        'original_price': 1100,
        'popular': False,
        'category': 'Thyroid'
    },
    {
        'name': 'CBC With ESR 1 (CBC+PS+ESR)',
        'description': 'Thyroid segment CBC With ESR 1',
        'tests': 90,
        'parameters': 90,
        'fasting': 'Required',
        'reports': '6 hours',
        'reports_time_hours': 6,
        'price': 350,
        'original_price': 570,
        'popular': True,
        'category': 'Thyroid'
    },
    {
        'name': 'CBC With ESR 2 (CBC+PS+ESR)',
        'description': 'Thyroid segment CBC With ESR 2',
        'tests': 90,
        'parameters': 90,
        'fasting': 'Required',
        'reports': '6 hours',
        'reports_time_hours': 6,
        'price': 350,
        'original_price': 570,
        'popular': True,
        'category': 'Thyroid'
    },
    {
        'name': 'CBC With ESR 3 (CBC+PS+ESR)',
        'description': 'Thyroid segment CBC With ESR 3',
        'tests': 90,
        'parameters': 90,
        'fasting': 'Required',
        'reports': '6 hours',
        'reports_time_hours': 6,
        'price': 350,
        'original_price': 570,
        'popular': True,
        'category': 'Thyroid'
    },
    {
        'name': 'CBC With ESR 4 (CBC+PS+ESR)',
        'description': 'Thyroid segment CBC With ESR 4',
        'tests': 90,
        'parameters': 90,
        'fasting': 'Required',
        'reports': '6 hours',
        'reports_time_hours': 6,
        'price': 350,
        'original_price': 570,
        'popular': True,
        'category': 'Thyroid'
    },
    {
        'name': 'Thyroid Profile Basic',
        'description': 'Essential thyroid function tests',
        'tests': 3,
        'parameters': 3,
        'fasting': 'Not required',
        'reports': '12 hours',
        'reports_time_hours': 12,
        'price': 399,
        'original_price': 799,
        'popular': True,
        'category': 'Thyroid'
    },
    {
        'name': 'Thyroid Profile Advanced',
        'description': 'Complete thyroid assessment',
        'tests': 8,
        'parameters': 8,
        'fasting': 'Not required',
        'reports': '24 hours',
        'reports_time_hours': 24,
        'price': 899,
        'original_price': 1799,
        'popular': False,
        'category': 'Thyroid'
    },

    # --- Women's Care ---
    {
        'name': 'Women Wellness Package',
        'description': 'Essential health screening for women',
        'tests': 55,
        'parameters': 55,
        'fasting': 'Required',
        'reports': '24 hours',
        'reports_time_hours': 24,
        'price': 1899,
        'original_price': 2800,
        'popular': True,
        'category': "Women's Care"
    },
    {
        'name': 'PCOS Profile',
        'description': 'Hormonal and metabolic screening for PCOS',
        'tests': 28,
        'parameters': 28,
        'fasting': 'Required',
        'reports': '24 hours',
        'reports_time_hours': 24,
        'price': 2150,
        'original_price': 3200,
        'popular': False,
        'category': "Women's Care"
    },
    {
        'name': "Women's Wellness Basic",
        'description': 'Essential health screening for women',
        'tests': 52,
        'parameters': 52,
        'fasting': 'Required',
        'reports': '24 hours',
        'reports_time_hours': 24,
        'price': 1499,
        'original_price': 2999,
        'popular': True,
        'category': "Women's Care"
    },
    {
        'name': "Women's Wellness Advanced",
        'description': 'Comprehensive health checkup for women',
        'tests': 85,
        'parameters': 85,
        'fasting': 'Required',
        'reports': '48 hours',
        'reports_time_hours': 48,
        'price': 2999,
        'original_price': 5999,
        'popular': False,
        'category': "Women's Care"
    },

    # --- Men's Care ---
    {
        'name': 'Men Health Package',
        'description': 'Essential health screening for men',
        'tests': 50,
        'parameters': 50,
        'fasting': 'Required',
        'reports': '24 hours',
        'reports_time_hours': 24,
        'price': 1750,
        'original_price': 2600,
        'popular': True,
        'category': "Men's Care"
    },
    {
        'name': 'Prostate Checkup',
        'description': 'PSA and related diagnostics',
        'tests': 10,
        'parameters': 10,
        'fasting': 'Required',
        'reports': '12 hours',
        'reports_time_hours': 12,
        'price': 950,
        'original_price': 1400,
        'popular': False,
        'category': "Men's Care"
    },
    {
        'name': 'Vitality Profile',
        'description': 'Complete wellness and vitality panel',
        'tests': 35,
        'parameters': 35,
        'fasting': 'Required',
        'reports': '24 hours',
        'reports_time_hours': 24,
        'price': 2200,
        'original_price': 3500,
        'popular': True,
        'category': "Men's Care"
    },
    {
        'name': "Men's Wellness Basic",
        'description': 'Essential health screening for men',
        'tests': 48,
        'parameters': 48,
        'fasting': 'Required',
        'reports': '24 hours',
        'reports_time_hours': 24,
        'price': 1299,
        'original_price': 2599,
        'popular': True,
        'category': "Men's Care"
    },
    {
        'name': "Men's Wellness Advanced",
        'description': 'Comprehensive health checkup for men',
        'tests': 75,
        'parameters': 75,
        'fasting': 'Required',
        'reports': '48 hours',
        'reports_time_hours': 48,
        'price': 2499,
        'original_price': 4999,
        'popular': False,
        'category': "Men's Care"
    },

    # --- Senior Care ---
    {
        'name': 'Senior Citizen Package',
        'description': 'Comprehensive geriatric health screening',
        'tests': 75,
        'parameters': 75,
        'fasting': 'Required',
        'reports': '24 hours',
        'reports_time_hours': 24,
        'price': 2999,
        'original_price': 4500,
        'popular': True,
        'category': 'Senior Care'
    },
    {
        'name': 'Senior Citizen Basic',
        'description': 'Essential screening for seniors',
        'tests': 72,
        'parameters': 72,
        'fasting': 'Required',
        'reports': '24 hours',
        'reports_time_hours': 24,
        'price': 1799,
        'original_price': 3599,
        'popular': True,
        'category': 'Senior Care'
    },
    {
        'name': 'Senior Citizen Comprehensive',
        'description': 'Complete health assessment for seniors',
        'tests': 110,
        'parameters': 110,
        'fasting': 'Required',
        'reports': '48 hours',
        'reports_time_hours': 48,
        'price': 3499,
        'original_price': 6999,
        'popular': False,
        'category': 'Senior Care'
    }
]

def get_extra_details(name, category):
    lowercase_name = name.lower()
    if 'cbc' in lowercase_name or 'blood count' in lowercase_name:
        return {
            'aliases': "Haemoglobin Test, Blood Test, Platelet Test, Complete blood examination, CBC, Complete Blood Count",
            'measures': "Components of blood, e.g., RBCs, WBCs, platelets, hemoglobin",
            'identifies': "Conditions like infections, anaemia, leukemia, and immune disorders",
            'about': "The Complete Blood Count test is a standard blood test that helps in assessing your general health. This test helps monitor the different types of cells present in the blood, such as red blood cells (RBCs), white blood cells (WBCs), and platelets, to diagnose health conditions. Additionally, it provides valuable information about the effects of medications or medical conditions on the body and helps assess the health of the immune system.",
            'prep': "No special preparation needed. You can eat and drink normally before the test.",
            'why': "To screen for, diagnose, or monitor a variety of health conditions. Typically ordered as part of a routine checkup or if you are feeling fatigued or having symptoms of infection.",
            'interpretations': "High or low counts of RBC, WBC, or platelets can indicate an underlying medical condition requiring clinical evaluation by a medical practitioner."
        }
    elif 'diabetes' in lowercase_name or 'hba1c' in lowercase_name or 'glucose' in lowercase_name:
        return {
            'aliases': "HbA1c Test, Fasting Blood Sugar, Glycated Hemoglobin, Blood Glucose Test, Sugar Profile",
            'measures': "Average glucose levels in the blood over the last 2-3 months",
            'identifies': "Diabetes, Prediabetes, and glucose fluctuations",
            'about': "A diabetes test measures glucose levels or glycated hemoglobin in your blood to diagnose or monitor diabetes. Routine screening is vital for early detection, enabling timely lifestyle changes and medical management to prevent chronic complications.",
            'prep': "Fasting for 8-10 hours is typically required for fasting blood glucose, though HbA1c does not require fasting.",
            'why': "Ordered to screen for prediabetes or diabetes, especially if you have a family history, are overweight, or experience symptoms like increased thirst or frequent urination.",
            'interpretations': "HbA1c levels below 5.7% are normal, 5.7% to 6.4% indicate prediabetes, and 6.5% or higher indicate diabetes."
        }
    elif 'thyroid' in lowercase_name or 'tsh' in lowercase_name or 't3' in lowercase_name:
        return {
            'aliases': "Thyroid Stimulating Hormone Test, T3, T4, TSH Profile, Thyroid Panel",
            'measures': "Levels of TSH, T3, and T4 thyroid hormones in the blood",
            'identifies': "Hypothyroidism, Hyperthyroidism, and other thyroid imbalances",
            'about': "The thyroid panel evaluates thyroid gland activity. The thyroid gland produces hormones that control metabolic processes, including heart rate, calorie burning, and body temperature. TSH regulates thyroid hormone production.",
            'prep': "No specific fasting required, but certain supplements or medications may affect results. Consult your physician.",
            'why': "If you experience symptoms of thyroid dysfunction, such as unexplained weight gain or loss, fatigue, temperature sensitivity, or changes in heart rate.",
            'interpretations': "High TSH usually suggests hypothyroidism (underactive thyroid), while low TSH suggests hyperthyroidism (overactive thyroid)."
        }
    else:
        return {
            'aliases': f"{name} Test, Standard Panel, General Diagnostics",
            'measures': f"Key physiological biomarkers associated with {category}",
            'identifies': "Underlying health conditions, deficiencies, and organ functions",
            'about': f"The {name} is a comprehensive health check designed to evaluate essential functions. It helps detect early warning signs, monitors chronic issues, and guides personalized medical suggestions.",
            'prep': "Fasting may be required depending on specific test parameters. Standard is 8-12 hours fasting.",
            'why': "Important for routine health checkups, early detection of potential risks, and tracking general wellness over time.",
            'interpretations': "All diagnostic reports should be discussed with a certified doctor or healthcare professional for accurate diagnosis and clinical advice."
        }

def seed():
    HealthPackage.objects.all().delete()
    print("Deleted existing packages.")
    
    for data in packages_data:
        extras = get_extra_details(data['name'], data['category'])
        data.update(extras)
        HealthPackage.objects.create(**data)
    print(f"Successfully seeded {len(packages_data)} packages.")

if __name__ == '__main__':
    seed()
