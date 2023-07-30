echo "-> Removing container..."
docker compose -v -f docker-compose.dev.yml down
echo "-> Removing volume..."
docker volume rm digital-db
echo "-> Removing image..."
docker rmi digital-server
echo "-> Running..."
docker compose -f docker-compose.dev.yml up
