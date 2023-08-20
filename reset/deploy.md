Run npm run build:
dave@smooshed:~/reset/reset_map/reset$ npm run build

Copy to /var/www/html:
cp -r build/ ../reset_django/reset_project/
(from web container, assuming that reset_project is mounted:
dave@smooshed:~/reset/reset_map/reset$ cp -r build/ ../reset_django/reset_project/
)
cp -r /reset_project/build/\* .
service apache2 start
