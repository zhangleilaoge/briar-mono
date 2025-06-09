#!/bin/bash

# 定义端口号
PORT=8922

# 检查端口是否被占用
echo "Checking if port $PORT is in use..."
PID=$(lsof -i :$PORT -t)

if [ -n "$PID" ]; then
    echo "Port $PORT is in use by process ID $PID. Terminating the process..."
    kill -9 $PID
    if [ $? -eq 0 ]; then
        echo "Process terminated successfully."
    else
        echo "Failed to terminate the process. Exiting..."
        exit 1
    fi
else
    echo "Port $PORT is not in use."
fi
