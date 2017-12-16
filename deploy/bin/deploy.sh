#!/bin/bash
ssh space_invasion@$BACKEND_HOST -o StrictHostKeyChecking=no 'cd SpaceInvasionFrontend && sudo git checkout $TRAVIS_TAG && sudo git pull origin $TRAVIS_TAG && sudo docker rm -f $(sudo docker ps -aqf name=frontend); sudo docker build . -t frontend && sudo docker run --name=frontend frontend'
