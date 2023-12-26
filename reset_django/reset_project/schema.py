import django
import graphene
from reset_project.reset import models
from graphql_auth import mutations
from graphql_auth.schema import UserQuery, MeQuery


# class PutUser(django.PutObjectMutation):
#     class Meta:
#         model = models.UserModel
#         fields = "__all__"


class AuthMutation(graphene.ObjectType):
    register = mutations.Register.Field()
    verify_account = mutations.VerifyAccount.Field()
    token_auth = mutations.ObtainJSONWebToken.Field()


class Mutation(AuthMutation, graphene.ObjectType):
    # put_user = PutUser.Field()
    pass


class Query(UserQuery, MeQuery, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
