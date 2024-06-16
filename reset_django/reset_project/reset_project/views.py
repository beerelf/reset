import json, logging, os, pathlib, shutil, sys
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
import csip

# from osgeo import gdal
from .serializers import UploadSerializer
from reset.models import UserModel

LOGGER = logging.getLogger(__name__)


def index(request):
    context = {}
    print("shit becoming unstable")
    return render(request, "templates/reset/index.html", context=context)
    # this does show me wow
    # return render(request, "templates/template.html", context=context)


class Reset(viewsets.ViewSet):
    csip_host = "http://csip.engr.colostate.edu"
    csip_port = "8088"

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
            return Response(
                status=status.HTTP_200_OK, data={"user": self.deserialize_user(user)}
            )
        else:
            # Return an error
            logging.error("neg login")
            return Response(status=status.HTTP_200_OK, data={"user": None})

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

        if os.path.exists("tmp"):
            print("tmp")
        else:
            print("no tmp")

        for file_uploaded in files_uploaded:
            # for now just read the file and send it back
            fname = "tmp/" + file_uploaded.name
            if not os.path.exists("tmp"):
                os.mkdir("tmp")
                shutil.chown("tmp", user="www-data", group="www-data")
            with default_storage.open(fname, "wb+") as destination:
                for chunk in file_uploaded.chunks():
                    destination.write(chunk)
            if ".shp" in fname or ".geojson" in fname:
                aoi_fname = fname

        shutil.chown(fname, user="www-data", group="www-data")

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

    @action(methods=["post"], detail=False, url_path="state")
    @csrf_exempt
    def state(self, request):
        """Return the state associated with the user"""
        return Response({"oi": "neg"})

    @action(methods=["post"], detail=False, url_path="process")
    @csrf_exempt
    def process(self, request):
        req = request.data
        # boundary = req["boundary"]
        boundary = {
            "features": [
                {
                    "geometry": {
                        "coordinates": [
                            [
                                [
                                    [-105.204340919673, 40.6972465847942],
                                    [-105.016200050561, 40.6951641880362],
                                    [-104.999720558381, 40.4500296208208],
                                    [-105.205714210693, 40.4458493462744],
                                    [-105.204340919673, 40.6972465847942],
                                ]
                            ]
                        ],
                        "type": "MultiPolygon",
                    },
                    "properties": {},
                    "type": "Feature",
                }
            ],
            "type": "FeatureCollection",
        }
        c = csip.Client()
        c.add_data("boundary", boundary)
        r = c.execute(
            "{host}:{port}/csip-huc/d/huc/extent/1.0".format(
                host=self.csip_host,
                port=self.csip_port,
            )
        )
        print("response is ", r)
        return Response({"process": "oi"})
