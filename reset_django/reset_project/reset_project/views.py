import json, logging, sys
from django.contrib.auth.models import User
from django.db.utils import IntegrityError
from django.contrib.auth import authenticate, login
from django.shortcuts import render
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.decorators import action


LOGGER = logging.getLogger(__name__)


class Reset(viewsets.ViewSet):
    def deserialize_user(self, user):
        if user:
            data = {"username": user.username}
            return data
        return None

    @action(methods=["post"], detail=False, url_path="newuser")
    @csrf_exempt
    def newuser(self, request):
        req = request.data
        username = req["username"]
        email = req["email"]
        password = req["password"]
        if req["password"] == req["password_confirmed"]:
            try:
                user = User.objects.create_user(username, email, req["password"])
                user.save()
            except IntegrityError as e:
                # probably already exists
                LOGGER.error(e)
        else:
            LOGGER.error("Passwords don't match")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            # Redirect to a success page.
            LOGGER.info("oi")
            return Response(
                status=status.HTTP_200_OK, data={"user": self.deserialize_user(user)}
            )
        else:
            # Return an error
            LOGGER.error("neg newnuser")
            return Response(
                status=status.HTTP_200_OK, data={"user": self.deserialize_user(user)}
            )

    @action(methods=["post"], detail=False, url_path="login")
    @csrf_exempt
    def login(self, request):
        req = request.data
        LOGGER.info(json.dumps(req))
        sys.stderr.flush()
        username = req["username"]
        password = req["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            # Redirect to a success page.
            logging.info("oi")
        else:
            # Return an error
            logging.error("neg")

        return Response(
            status=status.HTTP_200_OK, data={"user": self.deserialize_user(user)}
        )
