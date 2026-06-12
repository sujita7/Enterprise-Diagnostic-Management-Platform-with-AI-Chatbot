from django.contrib import admin
from .models import Test, Booking, HealthPackage, TimeSlot, Coupon, Order, UploadedPrescription

@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'price')
    list_filter = ('category',)
    search_fields = ('name', 'description')
    ordering = ('id',)

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'test', 'date', 'time_slot', 'created_at')
    list_filter = ('date', 'test__category')
    search_fields = ('user__username', 'user__email', 'test__name')
    ordering = ('-created_at',)
    date_hierarchy = 'date'

@admin.register(HealthPackage)
class HealthPackageAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'price', 'original_price', 'popular')
    list_filter = ('category', 'popular')
    search_fields = ('name', 'description')
    ordering = ('id',)

@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    list_display = ('id', 'label', 'period', 'is_active', 'sort_order')
    list_filter = ('period', 'is_active')
    ordering = ('sort_order',)

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_type', 'discount_value', 'min_order', 'is_active')
    list_filter = ('discount_type', 'is_active')
    search_fields = ('code',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'full_name', 'phone', 'appointment_date', 'time_slot', 'final_amount', 'status')
    list_filter = ('status', 'collection_type', 'payment_method', 'appointment_date')
    search_fields = ('order_id', 'full_name', 'phone', 'email')
    ordering = ('-created_at',)

@admin.register(UploadedPrescription)
class UploadedPrescriptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'file', 'uploaded_at')
    list_filter = ('uploaded_at',)
    ordering = ('-uploaded_at',)


