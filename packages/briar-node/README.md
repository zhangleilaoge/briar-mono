### 介绍

briar 服务端仓库

### 项目结构

```
briar-node
├── nest-cli.json // nest 配置
├── src
│ ├── constants
│ ├── controllers
│ ├── decorators
│ ├── guards // 路由守卫
│ ├── main.ts // 入口
│ ├── middleware
│ ├── model
│ ├── modules
│ ├── services
│ └── utils
├── tsconfig.build.json
└── tsconfig.json
```

### 部署

部署之前，在根目录请参照如下代码添加 .env 文件：

```
BRIAR_API_KEY="*"

BRIAR_DATABASE_USER="*"
BRIAR_DATABASE_PASSWORD="*"

BRIAR_JWT_SECRET="*"

BRIAR_TX_SEC_ID="*"
BRIAR_TX_SEC_KEY="*"
BRIAR_TX_BUCKET_NAME="*"
BRIAR_TX_BUCKET_REGION="*"

```
