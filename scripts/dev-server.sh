#!/bin/bash

# sudo chmod 777 scripts/dev-server.sh
# ./scripts/dev-server.sh

IMAGE_NAME=sistemasdigital-dev
CONTAINER_NAME=sistemasdigital-dev
NETWORK_NAME=labrem-net

docker rm -f $CONTAINER_NAME
docker rmi $IMAGE_NAME

docker build -f server/Dockerfile.dev -t $IMAGE_NAME server

docker run -ti --name $CONTAINER_NAME -v $(pwd)/server:/usr/src/server -p 3033:3000 --network $NETWORK_NAME $IMAGE_NAME

# docker build -f server/Dockerfile.dev -t dev-server:latest server
# docker run -ti --name dev-teleco -v $(pwd)/server:/usr/src/server -p 3030:3000 --network labrem-net dev-server:latest


# digital
# cd labrem/digital
# docker build -f server/Dockerfile.dev -t dev-digital:latest server
# docker run -ti --name dev-digital -v $(pwd)/server:/usr/src/server -p 3034:3000 --network labrem-net dev-digital:latest