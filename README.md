## docker

```cmd
# 清除本地 docker 容器缓存
docker system prune -a

# 本地 docker 构建并运行
docker compose up --build

# 本地 docker 镜像推送到远端(拉取则是 pull)
docker compose push

# 查看镜像内部
docker run -it --entrypoint sh <镜像名称>
docker-compose exec <服务名称> sh
```

## 代理

使用 whistle 进行代理
