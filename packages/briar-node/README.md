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

### 通用能力

#### 1. ip 限流

```typescript
  @Post('fn')
  @UseGuards(fn)
  @RateLimited({ points: 10, duration: 60 * 60 * 24, key: 'fn' }) // 24 小时内最多调用 10次
  async fn(
  ) {
    ...
  }
```

#### 2. 能力点限流

```typescript
  @Post('fn')
  @Ability(AbilityEnum.xx) // 该接口调用将会走 ability_usage_limit 表的限制规则
  @UseGuards(AbilityGuard)
  async fn(
  ) {
    ...
  }
```

#### 3. jwt 解析

```typescript
  @Get('fn')
  async fn(@Request() req) {
    const data = await this.UserService.getUserByJwt(req);
    ...
  }
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
