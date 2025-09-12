#!/bin/bash

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
COMPOSE_FILE="${SCRIPT_DIR}/../packages/briar-wiki/docker-compose.yml"
LOG_FILE="${SCRIPT_DIR}/wiki.log"

# 检查依赖
if ! command -v docker &> /dev/null; then
    echo "❌ 错误：Docker 未安装！" >&2
    exit 1
fi

if [ ! -f "$COMPOSE_FILE" ]; then
    echo "❌ 错误：docker-compose.yml 不存在于 $COMPOSE_FILE" >&2
    exit 1
fi

# 清理旧日志
echo "📝 日志将输出到: $LOG_FILE"
echo "" > "$LOG_FILE"

# 启动容器
echo "🚀 正在启动 Wiki.js 服务..."
docker compose -f "$COMPOSE_FILE" up -d

# 捕获容器ID
CONTAINER_ID=$(docker compose -f "$COMPOSE_FILE" ps -q wiki)
if [ -z "$CONTAINER_ID" ]; then
    echo "❌ 错误：无法获取容器ID" >&2
    exit 1
fi

# 实时输出日志到文件和终端
echo "🔍 开始跟踪日志 (Ctrl+C 停止)..."
docker logs -f "$CONTAINER_ID" 2>&1 | tee "$LOG_FILE" &

# 捕获Ctrl+C信号
trap 'cleanup' INT

cleanup() {
    echo -e "\n🛑 接收到停止信号，正在清理..."
    docker compose -f "$COMPOSE_FILE" down
    echo "✅ 已停止并清理容器"
    exit 0
}

# 保持脚本运行
while true; do
    sleep 1
done