from django.contrib.auth import authenticate, login
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
import json


@api_view(["POST"])
def reset_view(request):
    req = request.data
    print(req)
    username = req["username"]
    password = req["password"]
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        # Redirect to a success page.
        print("oi")
    else:
        # Return an error
        print("neg")

    return Response(status=status.HTTP_200_OK, data=user)
