# For development:

    update docker image:
        dave@smooshed:~/reset/reset_map/reset_django$ docker build -t reset_crap --progress=plain .

    cd reset_django
    docker-compose up

# For production:

    to test start:
        cd reset
        npm run build
        cd ..
        docker run -d --name apache2-container -e TZ=UTC -v ./reset/build:/var/www/html -p 80:80 ubuntu/apache2:2.4-22.04_beta

    to end:
        docker stop apache2-container
        docker rm apache2-container

### to deploy

        ~/reset/reset_map/reset$ npm run build
        ~/reset/reset_map/reset_django$ mv ~/reset/reset_map/build/ .
        ~/reset/reset_map$ docker build -t pattersd/reset_new_web --progress=plain .
        docker push pattersd/reset_new_web
