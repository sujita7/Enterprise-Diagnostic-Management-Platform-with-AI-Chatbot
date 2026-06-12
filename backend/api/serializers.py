from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Test, Booking, HealthPackage, TimeSlot, Coupon, Order
import time

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    test_details = TestSerializer(source='test', read_only=True)

    class Meta:
        model = Booking
        fields = ('id', 'user', 'test', 'test_details', 'date', 'time_slot', 'created_at')
        read_only_fields = ('user',)

class HealthPackageSerializer(serializers.ModelSerializer):
    price = serializers.IntegerField()
    originalPrice = serializers.IntegerField(source='original_price')
    discount = serializers.BooleanField(source='popular')
    title = serializers.CharField(source='name')
    params = serializers.IntegerField(source='parameters')
    time = serializers.IntegerField(source='reports_time_hours')

    class Meta:
        model = HealthPackage
        fields = (
            'id', 'name', 'description', 'tests', 'parameters', 
            'fasting', 'reports', 'price', 'originalPrice', 'popular', 'category',
            'discount', 'title', 'params', 'time',
            'aliases', 'measures', 'identifies', 'about', 'prep', 'why', 'interpretations'
        )


class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ('id', 'value', 'label', 'period', 'is_active', 'sort_order')


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ('id', 'code', 'discount_type', 'discount_value', 'min_order', 'max_discount', 'is_active', 'description')


class CouponValidateSerializer(serializers.Serializer):
    code = serializers.CharField()
    order_total = serializers.DecimalField(max_digits=10, decimal_places=2)

    def validate(self, data):
        try:
            coupon = Coupon.objects.get(code__iexact=data['code'], is_active=True)
        except Coupon.DoesNotExist:
            raise serializers.ValidationError({'code': 'Invalid or expired coupon code'})
        
        if data['order_total'] < coupon.min_order:
            raise serializers.ValidationError({'code': f'Minimum order of ₹{coupon.min_order} required'})
        
        if coupon.discount_type == 'percent':
            discount_amount = min(
                float(data['order_total']) * float(coupon.discount_value) / 100,
                float(coupon.max_discount)
            )
        else:
            discount_amount = min(float(coupon.discount_value), float(data['order_total']))
        
        data['coupon'] = coupon
        data['discount_amount'] = round(discount_amount, 2)
        return data


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('order_id', 'status', 'created_at', 'updated_at')

    def create(self, validated_data):
        validated_data['order_id'] = 'AG' + str(int(time.time()))[-8:]
        return super().create(validated_data)
