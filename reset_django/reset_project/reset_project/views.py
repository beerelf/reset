import json, logging, os, pathlib, sys
from django.contrib.auth.models import User
from django.db.utils import IntegrityError
from django.contrib.auth import authenticate, login
from django.shortcuts import render
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.decorators import action
from django.contrib.gis.geos import Point, Polygon, MultiPolygon
from django.contrib.gis.gdal import DataSource
from django.core.files.storage import default_storage

import geopandas as gpd

# from osgeo import gdal
from .serializers import UploadSerializer
from reset.models import UserModel

LOGGER = logging.getLogger(__name__)


class Reset(viewsets.ViewSet):
    def deserialize_user(self, user):
        if user:
            data = {"username": user.username}
            return data
        return None

    serializer_class = UploadSerializer

    def list(self, request):
        return Response("GET API")

    @action(methods=["post"], detail=False, url_path="newuser")
    @csrf_exempt
    def newuser(self, request):
        req = request.data
        username = req["username"]
        email = req["email"]
        password = req["password"]
        if req["password"] == req["password_confirmed"]:
            try:
                user = UserModel.objects.create_user(username, email, req["password"])
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

    @action(
        methods=["get", "post"],
        detail=False,
        url_path="upload",
        serializer_class=UploadSerializer,
    )
    @csrf_exempt
    def upload_layer(self, request):
        # uploads from drf page comes in file_uploaded, I guess because it using serializers.UploadSerializer
        files_uploaded = request.FILES.getlist("file_uploaded")
        aoi_fname = None

        for file_uploaded in files_uploaded:
            # for now just read the file and send it back
            fname = "tmp/" + file_uploaded.name
            if not os.path.exists("tmp"):
                os.mkdir("tmp")
            with default_storage.open(fname, "wb+") as destination:
                for chunk in file_uploaded.chunks():
                    destination.write(chunk)
            if ".shp" in fname or ".geojson" in fname:
                aoi_fname = fname

        aoi = gpd.read_file(aoi_fname).to_crs("epsg:4326")
        print(f"loaded boundary {aoi}")
        aoi = aoi.to_json()

        return Response(
            status=status.HTTP_200_OK,
            data={
                "file_name": file_uploaded.name if file_uploaded else None,
                "aoi": aoi,
            },
        )
