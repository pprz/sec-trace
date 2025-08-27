# Sec-Trace 后端服务

基于 Hono 和 MongoDB 构建的后端服务。

## 功能特性

- 使用 Hono 框架构建轻量级 API 服务
- MongoDB 数据库连接与操作
- RESTful API 设计
- TypeScript 支持
- 模块化代码结构

## 技术栈

- [Hono](https://hono.dev/) - 超快的 Web 框架
- [MongoDB](https://www.mongodb.com/) - NoSQL 数据库
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript
- [tsx](https://github.com/esbuild-kit/tsx) - TypeScript 直接运行工具

## 目录结构

```
server/
├── src/
│   ├── config/         # 配置文件
│   ├── controllers/     # 控制器
│   ├── models/         # 数据模型
│   ├── routes/         # 路由定义
│   └── index.ts        # 应用入口
├── .env.example        # 环境变量示例
├── package.json        # 项目依赖
└── tsconfig.json       # TypeScript 配置
```

## 快速开始

1. 安装依赖:
   ```bash
   cd server
   pnpm install
   ```

2. 配置环境变量:
   ```bash
   cp .env.example .env
   # 编辑 .env 文件以匹配你的环境
   ```

3. 启动开发服务器:
   ```bash
   pnpm dev
   ```

4. 构建生产版本:
   ```bash
   pnpm build
   ```

5. 启动生产服务器:
   ```bash
   pnpm start
   ```

## API 端点

### 健康检查
- `GET /health` - 检查服务器状态

### 用户管理
- `GET /api/users` - 获取所有用户
- `GET /api/users/:id` - 根据 ID 获取用户
- `POST /api/users` - 创建新用户
- `PUT /api/users/:id` - 更新用户信息
- `DELETE /api/users/:id` - 删除用户

## 环境变量

| 变量名        | 描述             | 默认值                  |
|---------------|------------------|-------------------------|
| MONGODB_URI   | MongoDB 连接 URI | mongodb://localhost:27017 |
| DB_NAME       | 数据库名称       | sec_trace               |
| PORT          | 服务器端口       | 3000                    |
| NODE_ENV      | 运行环境         | development             |

## 开发

### 添加新功能

1. 在 [models](src/models/) 目录中创建数据模型
2. 在 [controllers](src/controllers/) 目录中创建控制器
3. 在 [routes](src/routes/) 目录中定义路由
4. 在 [index.ts](src/index.ts) 中注册路由

## 部署

构建项目:
```bash
pnpm build
```

这将生成在 [dist](dist/) 目录中的生产就绪代码。