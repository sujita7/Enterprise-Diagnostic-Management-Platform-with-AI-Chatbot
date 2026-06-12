from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Test, Booking, HealthPackage, TimeSlot, Coupon, Order
from .serializers import (
    UserSerializer, TestSerializer, BookingSerializer, HealthPackageSerializer,
    TimeSlotSerializer, CouponValidateSerializer, OrderSerializer
)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

class ProfileView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class TestListView(generics.ListAPIView):
    queryset = Test.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = TestSerializer

class TestDetailView(generics.RetrieveAPIView):
    queryset = Test.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = TestSerializer

class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class HealthPackageListView(generics.ListAPIView):
    queryset = HealthPackage.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = HealthPackageSerializer


# ── Checkout-related views ──

class TimeSlotListView(generics.ListAPIView):
    """Returns available time slots for scheduling."""
    queryset = TimeSlot.objects.filter(is_active=True)
    permission_classes = (permissions.AllowAny,)
    serializer_class = TimeSlotSerializer


class CouponValidateView(APIView):
    """Validate a coupon code and return the discount amount."""
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = CouponValidateSerializer(data=request.data)
        if serializer.is_valid():
            coupon = serializer.validated_data['coupon']
            return Response({
                'valid': True,
                'code': coupon.code,
                'discount_type': coupon.discount_type,
                'discount_value': float(coupon.discount_value),
                'discount_amount': serializer.validated_data['discount_amount'],
                'description': coupon.description,
            })
        return Response({'valid': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class OrderCreateView(generics.CreateAPIView):
    """Place a new order. No auth required (guest checkout supported)."""
    queryset = Order.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = OrderSerializer


class OrderDetailView(generics.RetrieveAPIView):
    """Retrieve an order by its order_id."""
    permission_classes = (permissions.AllowAny,)
    serializer_class = OrderSerializer
    lookup_field = 'order_id'
    queryset = Order.objects.all()
