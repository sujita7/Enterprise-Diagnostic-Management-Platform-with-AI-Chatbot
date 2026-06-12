from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, ProfileView, TestListView, TestDetailView,
    BookingListCreateView, HealthPackageListView,
    TimeSlotListView, CouponValidateView, OrderCreateView, OrderDetailView
)
from .ai_views import (
    SymptomCheckerView, ChatbotView, SmartSearchView,
    AnalyzeReportView, PersonalizedSuggestionsView, PackageGeneratorView,
    DiseaseRiskPredictionView
)

urlpatterns = [
    # Core Endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('tests/', TestListView.as_view(), name='test-list'),
    path('tests/<int:pk>/', TestDetailView.as_view(), name='test-detail'),
    path('bookings/', BookingListCreateView.as_view(), name='booking-list-create'),
    path('packages/', HealthPackageListView.as_view(), name='package-list'),

    # Checkout Endpoints
    path('time-slots/', TimeSlotListView.as_view(), name='time-slot-list'),
    path('coupons/validate/', CouponValidateView.as_view(), name='coupon-validate'),
    path('orders/', OrderCreateView.as_view(), name='order-create'),
    path('orders/<str:order_id>/', OrderDetailView.as_view(), name='order-detail'),

    # AI Endpoints (Phase 2, 3, & 4)
    path('ai/symptom-checker/', SymptomCheckerView.as_view(), name='ai-symptom-checker'),
    path('ai/chat/', ChatbotView.as_view(), name='ai-chat'),
    path('ai/search/', SmartSearchView.as_view(), name='ai-smart-search'),
    path('ai/analyze-report/', AnalyzeReportView.as_view(), name='ai-analyze-report'),
    path('ai/personalized-suggestions/', PersonalizedSuggestionsView.as_view(), name='ai-personalized-suggestions'),
    path('ai/package-generator/', PackageGeneratorView.as_view(), name='ai-package-generator'),
    path('ai/predict-risk/', DiseaseRiskPredictionView.as_view(), name='ai-predict-risk'),
]
