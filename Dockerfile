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
    apache2 \
    apache2-dev \
    libapache2-mod-wsgi-py3

RUN pip install django psycopg2-binary \
    graphene-django \
    django-cors-headers \
    djangorestframework \
    djangorestframework-simplejwt \
    django-graphql-auth \
    geopandas \
    tzdata  \
    csip

RUN pip install mod_wsgi

# add apache2 configuration
ADD ./reset_django/files/000-default.conf /etc/apache2/sites-available

# Copy source code and databases
ADD ./reset_django/reset_project /reset_project
ADD ./reset/build /var/www/html

CMD /reset_project/run.sh
# CMD mod_wsgi-express start-server /reset_project/reset_project/wsgi.py --user www-data --group www-data
