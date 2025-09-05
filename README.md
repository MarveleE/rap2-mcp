# RAP2 MCP Server - API Documentation for LLMs and AI Code Editors

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io/)

> **RAP2 MCP Server** - 将 RAP2 API 文档和接口管理能力无缝集成到 AI 编程助手中，让 LLM 能够直接访问和操作 RAP2 接口文档。

## 🚀 特性

- **🔗 无缝集成** - 标准 MCP 协议，支持所有主流 AI 编程助手
- **📚 接口文档访问** - 直接获取 RAP2 接口详情和文档
- **🔍 智能搜索** - 按关键字搜索接口，支持跨仓库查询
- **🔐 灵活认证** - 支持账号密码和 Cookie 两种认证方式
- **📊 结构化日志** - 完整的请求日志记录，便于调试和监控
- **⚡ 高性能** - 基于 undici 的高性能 HTTP 客户端

## 📦 安装

### 使用 npm

```bash
npm install -g rap2-mcp-tool
```

### 使用 pnpm

```bash
pnpm add -g rap2-mcp-tool
```

### 从源码安装

```bash
git clone https://github.com/MarveleE/rap2-mcp.git
cd rap2-mcp
npm install
```

## ⚙️ 配置

### 环境变量

| 变量名 | 必需 | 描述 | 示例 |
|--------|------|------|------|
| `RAP2_BASE_URL` | ✅ | RAP2 实例地址 | `http://rap2.example.com` |
| `RAP2_EMAIL` | 🔄 | 登录邮箱（与密码配对使用） | `user@example.com` |
| `RAP2_PASSWORD` | 🔄 | 登录密码（与邮箱配对使用） | `yourpassword` |
| `RAP2_SID` | 🔄 | 已登录的 Cookie SID | `koa.sid` 值 |
| `RAP2_SID_SIG` | 🔄 | 已登录的 Cookie 签名 | `koa.sid.sig` 值 |

> **认证方式说明**：支持两种认证方式，二选一即可：
> - **账号密码**：使用 `RAP2_EMAIL` + `RAP2_PASSWORD`
> - **Cookie 认证**：使用 `RAP2_SID` + `RAP2_SID_SIG`

### 启动服务器

#### 使用账号密码认证

```bash
RAP2_BASE_URL="http://rap2.example.com" \
RAP2_EMAIL="you@example.com" \
RAP2_PASSWORD="yourpass" \
npm run mcp
```

#### 使用 Cookie 认证

```bash
RAP2_BASE_URL="http://rap2.example.com" \
RAP2_SID="your_sid_value" \
RAP2_SID_SIG="your_sig_value" \
npm run mcp
```

## 🔧 与 AI 编程助手集成

### Cursor

在 Cursor 的 MCP 配置中添加：

```json
{
  "mcpServers": {
    "rap2": {
      "command": "npm",
      "args": ["run", "mcp"],
      "env": {
        "RAP2_BASE_URL": "http://rap2.example.com",
        "RAP2_EMAIL": "your@email.com",
        "RAP2_PASSWORD": "yourpassword"
      }
    }
  }
}
```

### Claude Desktop

在 Claude Desktop 的配置文件中添加：

```json
{
  "mcpServers": {
    "rap2": {
      "command": "node",
      "args": ["/path/to/rap2-mcp/src/mcp-server.js"],
      "env": {
        "RAP2_BASE_URL": "http://rap2.example.com",
        "RAP2_EMAIL": "your@email.com",
        "RAP2_PASSWORD": "yourpassword"
      }
    }
  }
}
```

### 其他 MCP 客户端

任何支持 MCP 协议的客户端都可以使用此服务器，只需配置相应的启动命令和环境变量。

## 🛠️ 可用工具

RAP2 MCP Server 提供以下工具供 LLM 使用：

### `rap2_test_connection`
测试与 RAP2 服务器的连接状态
- **功能**：探测服务器连通性，必要时自动登录
- **用途**：验证配置和网络连接

### `rap2_ensure_session`
确保有效的登录会话
- **功能**：使用环境变量登录并保存 Cookie 到会话缓存
- **用途**：建立和维护认证状态

### `rap2_debug_login_info`
输出当前登录配置摘要
- **功能**：显示登录配置信息（不包含明文密码）
- **用途**：调试和验证配置

### `rap2_get_interface_by_id`
通过接口 ID 获取接口详情
- **参数**：`interfaceId` (必需) - RAP2 中的接口 ID
- **返回**：接口的详细信息，包括 URL、方法、参数和响应数据结构

### `rap2_get_repository_interfaces`
获取指定仓库中的所有接口列表
- **参数**：`repositoryId` (必需) - RAP2 中的仓库 ID
- **返回**：仓库中的所有接口列表

### `rap2_search_interfaces_by_keyword`
通过关键字搜索接口
- **参数**：
  - `keyword` (必需) - 搜索关键字
  - `repositoryId` (可选) - 限制搜索范围的仓库 ID
- **返回**：匹配的接口列表

## 📝 使用示例

### 在 AI 对话中使用

```
用户：帮我查看用户管理相关的 API 接口

AI：我来帮您搜索用户管理相关的接口...

[调用 rap2_search_interfaces_by_keyword 工具]
- 搜索关键字：用户管理
- 找到 5 个相关接口

1. GET /api/users - 获取用户列表
2. POST /api/users - 创建新用户
3. PUT /api/users/{id} - 更新用户信息
4. DELETE /api/users/{id} - 删除用户
5. GET /api/users/{id} - 获取用户详情

您想了解哪个接口的详细信息？
```

### 获取特定接口详情

```
用户：请告诉我创建用户的接口详情

AI：[调用 rap2_get_interface_by_id 工具]

创建用户接口详情：
- 方法：POST
- URL：/api/users
- 请求参数：
  - name (string, 必需) - 用户姓名
  - email (string, 必需) - 用户邮箱
  - role (string, 可选) - 用户角色
- 响应示例：
  {
    "id": 123,
    "name": "张三",
    "email": "zhangsan@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z"
  }
```

## 📊 日志和监控

### 日志文件位置
- **路径**：`/tmp/rap-mcp.log`
- **格式**：结构化 JSON 日志
- **内容**：服务器请求、响应、错误信息

### 查看日志
```bash
# 实时查看日志
tail -f /tmp/rap-mcp.log

# 查看最近的日志
tail -n 100 /tmp/rap-mcp.log

# 搜索特定内容
grep "ERROR" /tmp/rap-mcp.log
```

## 🔧 开发

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/MarveleE/rap2-mcp.git
cd rap2-mcp

# 安装依赖
npm install

# 启动开发服务器
npm run mcp
```

### 项目结构

```
rap2-mcp/
├── src/
│   ├── mcp-server.js      # MCP 服务器主文件
│   └── rap2Client.js      # RAP2 API 客户端
├── package.json           # 项目配置
├── README.md             # 项目说明
└── .gitignore           # Git 忽略规则
```

### 测试

```bash
# 运行测试
npm test

# 测试 MCP 连接
npm run mcp
```

## 🚨 故障排除

### 常见问题

#### 1. 连接失败
- 检查 `RAP2_BASE_URL` 是否正确
- 确认网络连接正常
- 验证 RAP2 服务器是否可访问

#### 2. 认证失败
- 确认邮箱和密码正确
- 检查 Cookie 是否过期
- 验证 RAP2 实例是否支持当前认证方式

#### 3. 模块未找到错误
```bash
# 尝试使用 npx
npx rap2-mcp-tool

# 或使用全局安装
npm install -g rap2-mcp-tool
```

#### 4. 权限问题
```bash
# 确保有写入日志文件的权限
sudo chmod 666 /tmp/rap-mcp.log
```

## 📋 系统要求

- **Node.js**: >= 18.0.0
- **操作系统**: Windows, macOS, Linux
- **内存**: 最少 128MB
- **网络**: 需要访问 RAP2 实例的网络连接

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📞 支持

如果您遇到问题或有建议，请：

- 提交 [Issue](https://github.com/MarveleE/rap2-mcp/issues)
- 查看 [Wiki](https://github.com/MarveleE/rap2-mcp/wiki)
- 联系维护者

## ⭐ Star History

如果这个项目对您有帮助，请给我们一个 ⭐！

---

**RAP2 MCP Server** - 让 AI 编程助手更智能地处理 API 文档！


