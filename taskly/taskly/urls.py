
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from apis.api import api
# from users.views import csrf_token_view


VERSION = "v1"
urlpatterns = [
    path('admin/', admin.site.urls),
    path(f"api/{VERSION}/", api.urls),
    # path('', include('main.urls')),
    # path("csrf-token/", csrf_token_view, name="csrf-token"),
]

