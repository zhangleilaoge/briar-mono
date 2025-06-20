### 介绍

zhangleilaoge 的个人博客网站，以及工具集。

### 项目结构

```
briar-mono
├── Dockerfile.nginx // docker 相关
├── Dockerfile.node // docker 相关
├── compose.yml // docker 相关
├── default.conf // nginx 相关
├── assets
├── package.json
├── packages
│ ├── briar-frontend // briar 前端仓库
│ ├── briar-node // briar 服务端仓库
│ ├── briar-shared // briar 公用类型、方法
├── scripts
```

### 初始化

```
# 更新包依赖
pnpm install

# 更新子仓库
git submodule update --init --recursive

# 初始化配置
pnpm run init
```

### 开发

使用 whistle 进行本地代理和开发

```
# 1. 前后端一起调试，本地通过 stardew.site 访问页面（client build && client cdn && node dev）
# stardew.site 127.0.0.1:8922

# 2. 前后端一起调试，本地通过 127.0.0.1:5173 访问页面（client dev && node dev）
# https://www.stardew.site 127.0.0.1:8922

# 3. 仅调试前端，本地通过 localhost:5173 访问页面（client dev）
# 无需设置规则

# 4. 仅调试后端，本地通过 stardew.site 访问页面（node dev）
# stardew.site/api 127.0.0.1:8922/api

```
