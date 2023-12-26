import graphene
from graphene_django import DjangoObjectType
from graphene_django.rest_framework.mutation import SerializerMutation
from graphql_auth import mutations
from reset.models import UserModel
from reset_project.serializers import UserSerializer


class UserType(DjangoObjectType):
    class Meta:
        model = UserModel


class Query(graphene.ObjectType):
    users = graphene.List(UserType)

    def resolve_users(self, info):
        return UserModel.objects.all()


# this seems to be the problem
# class UserMutation(SerializerMutation):
#     class Meta:
#         serializer_class = UserSerializer
#         model_operations = ["create", "update"]
#         lookup_field = "id"


# schema = graphene.Schema(query=Query, mutation=UserMutation)


# This works
class AuthMutation(graphene.ObjectType):
    register = mutations.Register.Field()
    verify_account = mutations.VerifyAccount.Field()
    token_auth = mutations.ObtainJSONWebToken.Field()


class Mutation(AuthMutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
