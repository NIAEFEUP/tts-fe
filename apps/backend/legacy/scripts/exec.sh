echo ">> Formating ./django/entrypoint.sh file"
sed -i 's/\r$//' ./django/entrypoint.sh   

echo ">> Removing old containers..."
docker compose down 
echo ">> Initializing docker..."
docker compose up --build
docker compose logs -ft 
