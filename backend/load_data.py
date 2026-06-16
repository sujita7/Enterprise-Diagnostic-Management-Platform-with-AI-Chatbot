import os
import django
from django.core.management import call_command

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

try:
    print("Loading database backup from data.json...")
    call_command('loaddata', 'data.json')
    print("Data loaded successfully!")
except Exception as e:
    print(f"Error loading data: {e}")
