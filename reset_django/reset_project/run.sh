#!/bin/bash

pip install tzdata django-cors-headers django-rest-framework

# cp -r /reset_project/build/* /var/www/html
service apache2 start
python /reset_project/manage.py runserver 0.0.0.0:8000 &
# this allows the runserver command to be terminated so it can be run in a docker exec console.
sleep infinity