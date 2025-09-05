# RAP2 MCP Server - API Documentation for LLMs and AI Code Editors

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![RAP2](https://img.shields.io/badge/RAP2-API%20Docs-orange.svg)](https://github.com/thx/rap2-delos)
[![AI Ready](https://img.shields.io/badge/AI-Ready-purple.svg)](https://openai.com/)
[![Claude](https://img.shields.io/badge/Claude-Compatible-green.svg)](https://claude.ai/)
[![Cursor](https://img.shields.io/badge/Cursor-Compatible-blue.svg)](https://cursor.sh/)
[![VSCode](https://img.shields.io/badge/VSCode-Compatible-blue.svg)](https://code.visualstudio.com/)
[![npm](https://img.shields.io/badge/npm-Package-red.svg)](https://www.npmjs.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Open%20Source-black.svg)](https://github.com/)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)](https://github.com/MarveleE/rap2-mcp)
[![Downloads](https://img.shields.io/badge/Downloads-Growing-lightblue.svg)](https://www.npmjs.com/package/rap2-mcp-tool)
[![Stars](https://img.shields.io/badge/Stars-⭐-gold.svg)](https://github.com/MarveleE/rap2-mcp)
[![Forks](https://img.shields.io/badge/Forks-🍴-silver.svg)](https://github.com/MarveleE/rap2-mcp)
[![Issues](https://img.shields.io/badge/Issues-Welcome-orange.svg)](https://github.com/MarveleE/rap2-mcp/issues)
[![PRs](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)](https://github.com/MarveleE/rap2-mcp/pulls)
[![Maintenance](https://img.shields.io/badge/Maintenance-Active-brightgreen.svg)](https://github.com/MarveleE/rap2-mcp)
[![Security](https://img.shields.io/badge/Security-Safe-green.svg)](https://github.com/MarveleE/rap2-mcp)
[![Performance](https://img.shields.io/badge/Performance-Fast-blue.svg)](https://github.com/MarveleE/rap2-mcp)
[![Documentation](https://img.shields.io/badge/Documentation-Complete-blue.svg)](https://github.com/MarveleE/rap2-mcp)
[![Community](https://img.shields.io/badge/Community-Friendly-pink.svg)](https://github.com/MarveleE/rap2-mcp)

> **RAP2 MCP Server** - 将 RAP2 API 文档和接口管理能力无缝集成到 AI 编程助手中，让 LLM 能够直接访问和操作 RAP2 接口文档。

## ⚡ 快速开始

### 方式一：直接使用 npx（推荐，无需安装）

```bash
# 直接运行，无需安装
npx -y rap2-mcp-tool@latest
```

### 方式二：在 AI 编程助手中集成（最推荐）

直接在您的 AI 编程助手（如 Cursor、Claude Desktop）中配置 MCP 服务器，无需手动启动：

```json
{
  "mcpServers": {
    "rap2": {
      "command": "npx",
      "args": ["-y", "rap2-mcp-tool@latest"],
      "env": {
        "RAP2_BASE_URL": "http://rap2.example.com",
        "RAP2_EMAIL": "your@email.com",
        "RAP2_PASSWORD": "yourpassword"
      }
    }
  }
}
```

配置完成后，AI 助手将自动启动 RAP2 MCP 服务器，您可以直接在对话中使用 RAP2 接口文档功能。

## 🚀 特性

- **🔗 无缝集成** - 标准 MCP 协议，支持所有主流 AI 编程助手
- **📚 接口文档访问** - 直接获取 RAP2 接口详情和文档
- **🔍 智能搜索** - 按关键字搜索接口，支持跨仓库查询
- **🔐 灵活认证** - 支持账号密码和 Cookie 两种认证方式
- **📊 结构化日志** - 完整的请求日志记录，便于调试和监控
- **⚡ 高性能** - 基于 undici 的高性能 HTTP 客户端
- **🛡️ 安全可靠** - 支持多种认证方式，确保数据安全
- **🎯 精准匹配** - 智能接口搜索，快速定位所需 API
- **🔄 实时同步** - 与 RAP2 实例实时同步，确保数据最新
- **📱 跨平台** - 支持 Windows、macOS、Linux 等主流操作系统
- **🔧 易于配置** - 简单的环境变量配置，快速上手
- **📈 可扩展** - 模块化设计，易于扩展新功能

## 📦 安装方式

### 推荐方式：使用 npx（无需安装）

```bash
# 直接使用最新版本，无需安装
npx -y rap2-mcp-tool@latest
```

### 可选方式：全局安装

如果您需要频繁使用命令行工具，可以选择全局安装：

```bash
# 使用 npm
npm install -g rap2-mcp-tool

# 使用 pnpm
pnpm add -g rap2-mcp-tool

# 使用 yarn
yarn global add rap2-mcp-tool
```

### 开发方式：从源码安装

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

### 手动启动服务器（可选）

如果您需要手动启动服务器进行测试或调试：

#### 使用账号密码认证

```bash
# 使用 npx（推荐，无需安装）
RAP2_BASE_URL="http://rap2.example.com" \
RAP2_EMAIL="you@example.com" \
RAP2_PASSWORD="yourpass" \
npx -y rap2-mcp-tool@latest

# 或全局安装后使用命令
RAP2_BASE_URL="http://rap2.example.com" \
RAP2_EMAIL="you@example.com" \
RAP2_PASSWORD="yourpass" \
rap2-mcp
```

#### 使用 Cookie 认证

```bash
# 使用 npx（推荐，无需安装）
RAP2_BASE_URL="http://rap2.example.com" \
RAP2_SID="your_sid_value" \
RAP2_SID_SIG="your_sig_value" \
npx -y rap2-mcp-tool@latest

# 或全局安装后使用命令
RAP2_BASE_URL="http://rap2.example.com" \
RAP2_SID="your_sid_value" \
RAP2_SID_SIG="your_sig_value" \
rap2-mcp
```

## 🔧 与 AI 编程助手集成

> **🎯 这是最推荐的使用方式！** 直接在 AI 编程助手中集成，无需手动启动服务器。

### 通用配置模板（推荐）

```json
{
  "mcpServers": {
    "rap2": {
      "command": "npx",
      "args": ["-y", "rap2-mcp-tool@latest"],
      "env": {
        "RAP2_BASE_URL": "http://rap2.example.com",
        "RAP2_EMAIL": "your@email.com",
        "RAP2_PASSWORD": "yourpassword"
      }
    }
  }
}
```

### Cursor 配置

在 Cursor 的 MCP 配置中添加：

```json
{
  "mcpServers": {
    "rap2": {
      "command": "npx",
      "args": ["-y", "rap2-mcp-tool@latest"],
      "env": {
        "RAP2_BASE_URL": "http://rap2.example.com",
        "RAP2_EMAIL": "your@email.com",
        "RAP2_PASSWORD": "yourpassword"
      }
    }
  }
}
```

### Claude Desktop 配置

在 Claude Desktop 的配置文件中添加：

```json
{
  "mcpServers": {
    "rap2": {
      "command": "npx",
      "args": ["-y", "rap2-mcp-tool@latest"],
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

#### 推荐配置（npx 方式，无需安装）
```json
{
  "mcpServers": {
    "rap2": {
      "command": "npx",
      "args": ["-y", "rap2-mcp-tool@latest"],
      "env": {
        "RAP2_BASE_URL": "http://rap2.example.com",
        "RAP2_EMAIL": "your@email.com",
        "RAP2_PASSWORD": "yourpassword"
      }
    }
  }
}
```

#### 可选配置（全局安装方式）
```json
{
  "mcpServers": {
    "rap2": {
      "command": "rap2-mcp",
      "env": {
        "RAP2_BASE_URL": "http://rap2.example.com",
        "RAP2_EMAIL": "your@email.com",
        "RAP2_PASSWORD": "yourpassword"
      }
    }
  }
}
```

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

# 测试 MCP 连接（开发模式）
npm run mcp

# 测试已发布的包
npx -y rap2-mcp-tool@latest --help
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
# 使用 npx（推荐，无需安装）
npx -y rap2-mcp-tool@latest

# 或使用全局安装（可选）
npm install -g rap2-mcp-tool

# 验证安装
rap2-mcp --help
```

#### 4. 权限问题
```bash
# 确保有写入日志文件的权限
sudo chmod 666 /tmp/rap-mcp.log
```

## 📋 系统要求

- **🟢 Node.js**: >= 18.0.0
- **💻 操作系统**: Windows, macOS, Linux
- **🧠 内存**: 最少 128MB
- **🌐 网络**: 需要访问 RAP2 实例的网络连接
- **📦 包管理器**: npm, pnpm, yarn
- **🔧 开发工具**: 支持 MCP 协议的 AI 编程助手

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. **🍴 Fork 本仓库** - 创建您的项目副本
2. **🌿 创建特性分支** (`git checkout -b feature/AmazingFeature`) - 为您的功能创建分支
3. **💾 提交更改** (`git commit -m 'Add some AmazingFeature'`) - 提交您的改进
4. **📤 推送到分支** (`git push origin feature/AmazingFeature`) - 推送您的更改
5. **🔄 开启 Pull Request** - 创建合并请求

### 贡献类型
- **🐛 Bug 修复** - 修复现有问题
- **✨ 新功能** - 添加新特性
- **📚 文档改进** - 完善文档
- **🎨 代码优化** - 提升代码质量
- **🧪 测试用例** - 增加测试覆盖

## 📞 支持

如果您遇到问题或有建议，请：

- **🐛 提交 [Issue](https://github.com/MarveleE/rap2-mcp/issues)** - 报告 Bug 或提出功能请求
- **📖 查看 [Wiki](https://github.com/MarveleE/rap2-mcp/wiki)** - 详细文档和教程
- **💬 联系维护者** - 直接沟通和技术支持
- **⭐ 给项目点赞** - 支持项目发展
- **🍴 Fork 项目** - 参与开源贡献
- **📝 提交 PR** - 贡献代码改进

## ⭐ Star History

如果这个项目对您有帮助，请给我们一个 ⭐！

---

**RAP2 MCP Server** - 让 AI 编程助手更智能地处理 API 文档！


