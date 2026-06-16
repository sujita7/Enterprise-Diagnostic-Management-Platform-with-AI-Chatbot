import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

if not User.objects.filter(username="admin").exists():
    User.objects.create_superuser(
        username="admin",
        email="admin@example.com",
        password="admin12345"
    )
    print("Superuser created")
else:
    user = User.objects.get(username="admin")
    user.set_password("admin12345")
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print("Superuser already exists. Password reset to admin12345.")
