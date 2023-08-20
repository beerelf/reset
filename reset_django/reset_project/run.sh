#!/bin/bash

cp -r /reset_project/build/* /var/www/html
service apache2 start
python /reset_project/manage.py runserver 0.0.0.0:8000