from rest_framework.serializers import Serializer, FileField, ModelSerializer
from graphene_django.rest_framework.mutation import SerializerMutation
from reset.models import UserModel


# Serializers define the API representation.
class UploadSerializer(Serializer):
    file_uploaded = FileField()

    class Meta:
        fields = ["file_uploaded"]


class UserSerializer(ModelSerializer):
    class Meta:
        model = UserModel
        fields = (
            "id",
            "username",
            "password",
        )
