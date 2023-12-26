# docker build -t pattersd/reset_new_web --progress=plain .
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
    geopandas \
    tzdata 

RUN apt-get install -y apache2-dev

RUN pip install mod_wsgi

COPY ./reset/build /var/www/html

# Copy source code and databases
ADD ./reset_django/reset_project /reset_project
ADD ./reset/build /var/www/html

CMD /reset_project/run.sh
