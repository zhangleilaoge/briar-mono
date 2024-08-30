#!/bin/bash

# 1. Git pull
echo "Pulling latest changes from git..."
git stash
git pull
if [ $? -ne 0 ]; then
    echo "Git pull failed. Exiting..."
    exit 1
fi

# 2. Docker run
echo "Trying to run docker..."
sudo docker stop $(sudo docker ps -aq)
sudo docker rm $(sudo docker ps -a -q)
sudo docker system prune -a -f
sudo docker volume rm briar-mono_briar-static -f
sudo docker compose pull
sudo docker compose up -d
if [ $? -ne 0 ]; then
    echo "Docker run failed. Exiting..."
    exit 1
fi

echo "All steps completed successfully."
