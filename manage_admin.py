
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
username = 'KABISH'
password = 'Kab2002@'

try:
    if User.objects.filter(username=username).exists():
        user = User.objects.get(username=username)
        print(f"Found user: {username}")
        print(f"Is active: {user.is_active}")
        print(f"Is staff: {user.is_staff}")
        print(f"Is superuser: {user.is_superuser}")
        
        user.set_password(password)
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.save()
        print(f"Reset password and ensured active/staff/superuser status for: {username}")
    else:
        User.objects.create_superuser(username=username, email='admin@example.com', password=password)
        print(f"Successfully created superuser: {username}")

    # Create a backup simple admin
    simple_user = 'admin'
    simple_pass = 'admin123'
    if not User.objects.filter(username=simple_user).exists():
        User.objects.create_superuser(username=simple_user, email='admin2@example.com', password=simple_pass)
        print(f"Created backup superuser: {simple_user} / {simple_pass}")
    else:
        u = User.objects.get(username=simple_user)
        u.set_password(simple_pass)
        u.save()
        print(f"Reset backup superuser: {simple_user} / {simple_pass}")

    # List all users
    for u in User.objects.all():
         print(f"User: {u.username}, Active: {u.is_active}, Staff: {u.is_staff}")

except Exception as e:
    print(f"Error managing user: {e}")
