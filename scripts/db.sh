docker run \
    --name labrem-apps-db \
    # --volume labrem-db:/var/lib/mysql \
    --volume labrem-db:/var/lib/mysql \
    --network labrem-network \
    --publish 3306:3306 \
    --detach=true \
    mysql:8.0.30
