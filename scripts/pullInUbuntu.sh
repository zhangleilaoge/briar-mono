#!/bin/bash

# 1. Git pull
echo "Pulling latest changes from git..."
sudo /opt/clash on
git stash
git pull
if [ $? -ne 0 ]; then
    echo "Git pull failed. Exiting..."
    exit 1
fi
#  打印当前分支信息
git --no-pager log -1 --pretty=format:"当前分支状态为：%H %s"
echo ""