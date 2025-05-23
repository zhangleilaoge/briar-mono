#!/bin/bash

# 定义拷贝任务数组（普通数组+字符串组合方案，兼容性更好）
COPY_TASKS=(
    # 格式："源目录|目标目录1 目标目录2..."
    "./briar-assets/ssl|./assets/ssl"
    "./briar-assets/briar|./packages/briar-node ./packages/briar-frontend ./packages/briar-lang-chain ./packages/briar-next"
)

copy_files() {
    local SOURCE_DIR="$1"
    local TARGET_DIRS="$2"

    # 检查源目录是否存在
    if [ ! -d "$SOURCE_DIR" ]; then
        echo "错误: 源目录 '$SOURCE_DIR' 不存在!" >&2
        return 1
    fi

    # 检查源目录是否为空
    if [ -z "$(ls -A "$SOURCE_DIR")" ]; then
        echo "警告: 源目录 '$SOURCE_DIR' 为空，未拷贝任何文件。"
        return
    fi

    # 遍历所有目标目录
    for TARGET_DIR in $TARGET_DIRS; do
        # 创建目标目录（如果不存在）
        if [ ! -d "$TARGET_DIR" ]; then
            mkdir -p "$TARGET_DIR"
            echo "目标目录 '$TARGET_DIR' 不存在，已创建。"
        fi

        # 拷贝文件（保留原文件属性）
        cp -r "$SOURCE_DIR/." "$TARGET_DIR/"
        echo "已将文件从 '$SOURCE_DIR' 拷贝到 '$TARGET_DIR'"
    done
}

# 主执行逻辑
for TASK in "${COPY_TASKS[@]}"; do
    # 分割源目录和目标目录列表
    IFS="|" read -r SOURCE_DIR TARGET_DIRS <<< "$TASK"
    
    echo "处理任务: $SOURCE_DIR => $TARGET_DIRS"
    copy_files "$SOURCE_DIR" "$TARGET_DIRS"
done