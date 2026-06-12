from django.db import models
from django.contrib.auth.models import User

class Test(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    category = models.CharField(max_length=100)
    parameters = models.IntegerField(default=1)
    fasting = models.CharField(max_length=100, default='Not Required')
    reports = models.CharField(max_length=100, default='12 hours')
    
    # Details page dynamic fields
    aliases = models.TextField(blank=True, default='')
    measures = models.TextField(blank=True, default='')
    identifies = models.TextField(blank=True, default='')
    about = models.TextField(blank=True, default='')
    prep = models.TextField(blank=True, default='')
    why = models.TextField(blank=True, default='')
    interpretations = models.TextField(blank=True, default='')

    def __str__(self):
        return self.name

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='bookings')
    date = models.DateField()
    time_slot = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.test.name} on {self.date} at {self.time_slot}"

class HealthPackage(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    tests = models.IntegerField(default=0)
    parameters = models.IntegerField(default=0)
    fasting = models.CharField(max_length=100, default='Required')
    reports = models.CharField(max_length=100)
    reports_time_hours = models.IntegerField(default=24)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    popular = models.BooleanField(default=False)
    category = models.CharField(max_length=100)
    
    # Details page dynamic fields
    aliases = models.TextField(blank=True, default='')
    measures = models.TextField(blank=True, default='')
    identifies = models.TextField(blank=True, default='')
    about = models.TextField(blank=True, default='')
    prep = models.TextField(blank=True, default='')
    why = models.TextField(blank=True, default='')
    interpretations = models.TextField(blank=True, default='')

    def __str__(self):
        return self.name


class TimeSlot(models.Model):
    PERIOD_CHOICES = [
        ('Morning', 'Morning'),
        ('Afternoon', 'Afternoon'),
        ('Evening', 'Evening'),
    ]
    value = models.CharField(max_length=50, unique=True)  # e.g. '06:00-07:00'
    label = models.CharField(max_length=100)               # e.g. '6:00 AM – 7:00 AM'
    period = models.CharField(max_length=20, choices=PERIOD_CHOICES)
    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['sort_order']

    def __str__(self):
        return self.label


class Coupon(models.Model):
    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(max_length=20, choices=[('percent', 'Percent'), ('flat', 'Flat')])
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    min_order = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_discount = models.DecimalField(max_digits=10, decimal_places=2, default=9999)
    is_active = models.BooleanField(default=True)
    description = models.CharField(max_length=200, blank=True, default='')

    def __str__(self):
        return f"{self.code} ({self.discount_type}: {self.discount_value})"


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('sample_collected', 'Sample Collected'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    COLLECTION_CHOICES = [
        ('home', 'Home Collection'),
        ('lab', 'Lab Visit'),
    ]
    PAYMENT_CHOICES = [
        ('online', 'Online Payment'),
        ('cod', 'Pay on Collection'),
    ]

    order_id = models.CharField(max_length=20, unique=True)
    
    # Patient details
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    age = models.IntegerField()
    gender = models.CharField(max_length=20)
    
    # Collection
    collection_type = models.CharField(max_length=10, choices=COLLECTION_CHOICES, default='home')
    address = models.TextField(blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='')
    pincode = models.CharField(max_length=10, blank=True, default='')
    
    # Schedule
    appointment_date = models.DateField()
    time_slot = models.CharField(max_length=50)
    
    # Payment
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='online')
    coupon_code = models.CharField(max_length=50, blank=True, default='')
    
    # Pricing
    mrp_total = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    coupon_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    final_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Items stored as JSON
    items = models.JSONField(default=list)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order {self.order_id} - {self.full_name}"


class UploadedPrescription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    file = models.FileField(upload_to='prescriptions/')
    analysis_result = models.TextField(blank=True, default='')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prescription {self.id} uploaded at {self.uploaded_at}"

