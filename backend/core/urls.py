from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import redirect

# 👇 root URL redirect to admin
def home(request):
    return redirect('/admin/')

urlpatterns = [
    path('', home),  # root → admin redirect
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

# media files (correct for dev)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)