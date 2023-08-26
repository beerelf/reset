# docker build -t crap .
FROM osgeo/gdal

#########################
# Apt
#########################
RUN apt-get -y update && apt-get install -y software-properties-common

RUN apt-get install -y build-essential \
    python3-dev \
    python3-pip

RUN pip install django psycopg2-binary graphene-django

RUN apt-get install -y apache2

COPY build /var/www/html