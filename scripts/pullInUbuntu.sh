#!/bin/bash

GITHUB_USER=$1
GITHUB_TOKEN=$2

# 1. Git pull
echo "Pulling latest changes from git..."
git stash
git pull
if [ $? -ne 0 ]; then
    echo "Git pull failed. Exiting..."
    exit 1
fi
#  打印当前分支信息
git --no-pager log -1 --pretty=format:"当前分支状态为：%H %s"
echo ""

# 2. Init project
echo "Initializing submodules..."
git config --file .gitmodules submodule.briar-assets.url https://$GITHUB_USER:$GITHUB_TOKEN@github.com/zhangleilaoge/briar-assets.git
git submodule sync
git submodule update --init --recursive
sh ./scripts/assets-init.sh

# 3. Install dependencies
echo "Installing dependencies..."
pnpm install