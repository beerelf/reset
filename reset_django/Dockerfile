# docker build -t crap --progress=plain .
FROM osgeo/gdal

#########################
# Apt
#########################
RUN apt-get -y update && apt-get install -y software-properties-common

RUN apt-get install -y build-essential \
    python3-dev \
    python3-pip \
    postgresql-client \
    apache2

RUN pip install django psycopg2-binary \
    graphene-django \
    django-cors-headers \
    djangorestframework \
    django-graphql-auth \
    tzdata 

RUN apt-get install -y apache2 

COPY build /var/www/html
