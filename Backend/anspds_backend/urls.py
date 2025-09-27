# urls.py
from django.contrib import admin
from django.urls import path
from django.http import HttpResponse
from . import views
from .db_views import ItemList
from .Images_CRUD import ImageDBFunction
from anspds_backend.utils.view import scan_image

def home_view(request):
    return HttpResponse("Welcome to the anspds_backend API. Please use the appropriate endpoints.")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/get/', views.get_data, name='get_data'),
    path('api/post/', views.post_data, name='post_data'),
    path('items/', ItemList.as_view(), name='item-list'),
    path('api/images/', ImageDBFunction.as_view(), name='image-api'),
    path('api/images/filter/', ImageDBFunction.as_view(), name='filter-images'),

    # Image scanning and OCR
    path("scan/", scan_image, name="scan_image"),

    # Endpoint for checking scanned image status
    path('api/images/status/<str:image_id>/', views.check_scan_status, name='check_scan_status'),  # Updated route

    path('', home_view, name='home'),  
]
