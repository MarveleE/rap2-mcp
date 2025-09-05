## RAP2 MCP 工具

标准 MCP 服务器（STDIO），将 RAP2 的常用能力以工具形式暴露给 AI Agent。

### 环境变量
- `RAP2_BASE_URL`：RAP2 实例地址（必填），例如 `http://rap2.example.com`。
- 登录凭据（二选一）：
  - 使用账号密码：
    - `RAP2_EMAIL`：登录邮箱
    - `RAP2_PASSWORD`：登录密码
  - 使用已登录 Cookie：
    - `RAP2_SID`：`koa.sid`
    - `RAP2_SID_SIG`：`koa.sid.sig`

说明：若未提供 Cookie，则工具会自动走验证码登录（需要目标实例提供 `/captcha` 与 `/captcha_data`）。

### 启动
```bash
pnpm i # 或 npm i / yarn

# 启动 MCP 服务器（STDIO）
RAP2_BASE_URL="http://rap2.example.com" \
RAP2_EMAIL="you@example.com" \
RAP2_PASSWORD="yourpass" \
npm run mcp
```

或使用 Cookie：
```bash
RAP2_BASE_URL="http://rap2.example.com" \
RAP2_SID="xxx" \
RAP2_SID_SIG="yyy" \
npm run mcp
```

### 已提供的工具
- `rap2_test_connection`：测试与服务器联通性（探测 `/repository/joined`，必要时自动登录）。
- `rap2_ensure_session`：使用环境参数登录并保存 Cookie 到会话缓存。
- `rap2_debug_login_info`：输出当前登录配置摘要（不含明文密码）。
- `rap2_get_interface_by_id`：按 `interfaceId` 获取接口详情。
- `rap2_get_repository_interfaces`：按 `repositoryId` 获取仓库全部接口。
- `rap2_search_interfaces_by_keyword`：按关键字搜索接口（可选 `repositoryId`）。

说明：根据 MCP 最佳实践，工具名采用 snake_case，便于模型分词与稳定调用。

### 与 Agent 集成
- 该项目通过 STDIO 暴露 MCP 服务；在支持 MCP 的 Agent（如 Cursor、OpenAI、LangGraph MCP 等）中，将启动命令配置为：`npm run mcp`，并注入上述环境变量即可。

### 日志
- 服务器与客户端请求的结构化日志输出到：`/tmp/rap-mcp.log`
- 建议在问题排查时查看该文件（例如 tail -f）。

### 版本与要求
- Node.js 18+
- 依赖：`@modelcontextprotocol/sdk`、`undici`


