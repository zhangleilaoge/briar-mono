#!/bin/bash

# 定义源和目标目录
SSL_SOURCE_DIR="./briar-assets/ssl"
SSL_TARGET_DIR="./assets/ssl"

ENV_SOURCE_DIR="./briar-assets/briar"
ENV_TARGET_DIR1="./packages/briar-node"
ENV_TARGET_DIR2="./packages/briar-frontend"
ENV_TARGET_DIR2="./packages/briar-lang-chain"

copy_files() {
    local SOURCE_DIR="$1"
    local TARGET_DIR="$2"

    # 检查源目录是否存在
    if [ ! -d "$SOURCE_DIR" ]; then
        echo "错误: 源目录 '$SOURCE_DIR' 不存在!"
        return 1
    fi

        # 检查源目录是否为空
    if [ -z "$(ls -A "$SOURCE_DIR")" ]; then
        echo "警告: 源目录 '$SOURCE_DIR' 为空，未拷贝任何文件。"
        return
    fi


    # 创建目标目录（如果不存在）
    if [ ! -d "$TARGET_DIR" ]; then
        mkdir -p "$TARGET_DIR"
        echo "目标目录 '$TARGET_DIR' 不存在，已创建。"
    fi

    # 拷贝文件
    cp -r "$SOURCE_DIR/". "$TARGET_DIR/"
    echo "已将文件从 '$SOURCE_DIR' 拷贝到 '$TARGET_DIR'。"
}

# 进行文件拷贝
copy_files "$SSL_SOURCE_DIR" "$SSL_TARGET_DIR"
copy_files "$ENV_SOURCE_DIR" "$ENV_TARGET_DIR1"
copy_files "$ENV_SOURCE_DIR" "$ENV_TARGET_DIR2"
copy_files "$ENV_SOURCE_DIR" "$ENV_TARGET_DIR2"