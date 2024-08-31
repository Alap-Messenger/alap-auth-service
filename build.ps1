param (
    [string]$token = $( Read-Host "Enter token: " ),
    [string]$name = $( Read-Host "Enter Image Name: " ),
    [int32]$port = $( Read-Host "Enter Image Port: " )
)
git pull;
docker stop $name;
docker rm $name;
docker build -f "Dockerfile" -t $name`:latest "." --build-arg NPM_TOKEN=${token} ;
docker run --name $name --network myNetwork --restart unless-stopped -p $port`:$port -d $name`:latest