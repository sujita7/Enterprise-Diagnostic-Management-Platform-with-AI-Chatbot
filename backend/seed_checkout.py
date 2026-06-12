import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import TimeSlot, Coupon

# Seed Time Slots
print("Seeding time slots...")
TimeSlot.objects.all().delete()

slots = [
    {'value': '06:00-07:00', 'label': '6:00 AM – 7:00 AM', 'period': 'Morning', 'sort_order': 1},
    {'value': '07:00-08:00', 'label': '7:00 AM – 8:00 AM', 'period': 'Morning', 'sort_order': 2},
    {'value': '08:00-09:00', 'label': '8:00 AM – 9:00 AM', 'period': 'Morning', 'sort_order': 3},
    {'value': '09:00-10:00', 'label': '9:00 AM – 10:00 AM', 'period': 'Morning', 'sort_order': 4},
    {'value': '10:00-11:00', 'label': '10:00 AM – 11:00 AM', 'period': 'Morning', 'sort_order': 5},
    {'value': '11:00-12:00', 'label': '11:00 AM – 12:00 PM', 'period': 'Morning', 'sort_order': 6},
    {'value': '14:00-15:00', 'label': '2:00 PM – 3:00 PM', 'period': 'Afternoon', 'sort_order': 7},
    {'value': '15:00-16:00', 'label': '3:00 PM – 4:00 PM', 'period': 'Afternoon', 'sort_order': 8},
    {'value': '16:00-17:00', 'label': '4:00 PM – 5:00 PM', 'period': 'Afternoon', 'sort_order': 9},
    {'value': '17:00-18:00', 'label': '5:00 PM – 6:00 PM', 'period': 'Evening', 'sort_order': 10},
    {'value': '18:00-19:00', 'label': '6:00 PM – 7:00 PM', 'period': 'Evening', 'sort_order': 11},
]

for s in slots:
    TimeSlot.objects.create(**s)
print(f"  ✅ Created {len(slots)} time slots")

# Seed Coupons
print("Seeding coupons...")
Coupon.objects.all().delete()

coupons = [
    {
        'code': 'HEALTH10',
        'discount_type': 'percent',
        'discount_value': 10,
        'min_order': 200,
        'max_discount': 500,
        'description': 'Get 10% off on your order (max ₹500)',
    },
    {
        'code': 'FIRST50',
        'discount_type': 'flat',
        'discount_value': 50,
        'min_order': 100,
        'max_discount': 50,
        'description': 'Flat ₹50 off on your first order',
    },
    {
        'code': 'AGILUS20',
        'discount_type': 'percent',
        'discount_value': 20,
        'min_order': 500,
        'max_discount': 1000,
        'description': 'Get 20% off on orders above ₹500 (max ₹1000)',
    },
    {
        'code': 'FLAT100',
        'discount_type': 'flat',
        'discount_value': 100,
        'min_order': 300,
        'max_discount': 100,
        'description': 'Flat ₹100 off on orders above ₹300',
    },
]

for c in coupons:
    Coupon.objects.create(**c)
print(f"  ✅ Created {len(coupons)} coupons")

print("\n🎉 Checkout seed data created successfully!")
