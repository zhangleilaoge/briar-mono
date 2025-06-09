#!/bin/bash

GITHUB_USER=$1
GITHUB_TOKEN=$2

# 1. Git pull
echo "Pulling latest changes from git..."
clash on
git stash
git pull
if [ $? -ne 0 ]; then
    echo "Git pull failed. Exiting..."
    exit 1
fi
sleep 2
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

# 4. Build project
echo "Building node."
pnpm run build:node

# 5. update cdn
# sleep 3
# pnpm run cdn

# 6. Configure and start Nginx
echo "Configuring and starting Nginx..."
sudo cp default.conf /etc/nginx/conf.d/
sudo cp briar-assets/ssl/stardew.site_bundle.crt /etc/nginx/
sudo cp briar-assets/ssl/stardew.site.key /etc/nginx/
sudo systemctl restart nginx

# 7. Start backend
clash off
echo "Starting backend..."
cd packages/briar-node
pnpm run start > /dev/null 2>&1 &  # 将命令放到后台运行
BACKEND_PID=$!  # 获取后台进程的 PID
disown $BACKEND_PID  # 将进程从当前 shell 的作业控制中移除
echo "Backend started and running in the background with PID $BACKEND_PID."



# 问题2 clash不关掉会导致数据库连不上
# 问题3 关于 supabase我想再试试