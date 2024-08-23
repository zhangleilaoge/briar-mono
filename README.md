## windows 部署 front

在服务器上执行以下命令

```powerShall
./scripts/build.ps1`
-cosSecretId "yourCosSecretId"`
-cosSecretKey "yourCosSecretKey"`
-cosBucket "yourCosBucket"`
-region "yourRegion"`
-cdnUrl "yourCdnUrl"`
-apiKey “yourApiKey”
```

## docker

```cmd
# 清除本地 docker 容器缓存
docker container prune

# 本地 docker 构建并运行
docker-compose up --build

# 本地 docker 镜像推送到远端
docker compose push
```

## 代理

使用 charles 的 mapRemote 功能，即可用原始域名进行代理。
