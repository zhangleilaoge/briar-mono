#!/bin/bash

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
echo "Starting backend..."
cd packages/briar-node
pnpm run start > backend.log 2>&1 &  # 将命令放到后台运行，并将输出重定向到 backend.log
BACKEND_PID=$!  # 获取后台进程的 PID
disown $BACKEND_PID  # 将进程从当前 shell 的作业控制中移除
echo "Backend started and running in the background with PID $BACKEND_PID. Logs are available in backend.log."
