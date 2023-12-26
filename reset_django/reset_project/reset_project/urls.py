"""
URL configuration for reset_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from reset_project import views
from rest_framework.routers import SimpleRouter
from reset.schema import schema


router = SimpleRouter()
router.register("reset", views.Reset, basename="reset")
# urlpatterns = router.urls
# router.register(
#     "graphql", csrf_exempt(GraphQLView.as_view(graphiql=True, schema=schema))
# )
# print(router.urls)
graphql = path(
    "graphql/", csrf_exempt(GraphQLView.as_view(graphiql=True, schema=schema))
)
urlpatterns = router.urls + [
    graphql,
]


# urlpatterns = [
#     path("admin/", admin.site.urls),
#     path("login/", views.login),
#     path("newuser/", views.newuser),
# ]
