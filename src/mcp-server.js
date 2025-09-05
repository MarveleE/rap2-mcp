#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Rap2Client } from './rap2Client.js';
import pino from 'pino';

const logger = pino('/tmp/rap-mcp.log');

function readEnvConfig() {
  const baseUrl = process.env.RAP2_BASE_URL || process.env.RAP_BASE_URL || '';
  const email = process.env.RAP2_EMAIL || process.env.RAP_EMAIL || '';
  const password = process.env.RAP2_PASSWORD || process.env.RAP_PASSWORD || '';
  const sid = process.env.RAP2_SID || '';
  const sidSig = process.env.RAP2_SID_SIG || '';
  return { baseUrl, email, password, sid, sidSig };
}

function assertConfig(cfg) {
  if (!cfg.baseUrl) throw new Error('缺少 RAP2_BASE_URL');
  if ((!cfg.sid || !cfg.sidSig) && (!cfg.email || !cfg.password)) {
    throw new Error('缺少登录凭据：请提供 (RAP2_SID 与 RAP2_SID_SIG) 或 (RAP2_EMAIL 与 RAP2_PASSWORD)');
  }
}

function createClient() {
  const cfg = readEnvConfig();
  assertConfig(cfg);
  // 会话级 Cookie 缓存
  if (!globalThis.__RAP2_SESSION__) {
    globalThis.__RAP2_SESSION__ = { sid: cfg.sid || '', sidSig: cfg.sidSig || '' };
  }
  const session = globalThis.__RAP2_SESSION__;
  const client = new Rap2Client({
    ...cfg,
    sid: session.sid,
    sidSig: session.sidSig,
    onCookieUpdate: ({ name, value }) => {
      if (name === 'koa.sid') session.sid = value;
      if (name === 'koa.sid.sig') session.sidSig = value;
    },
    logger,
  });
  return client;
}

const tools = [
  {
    name: 'rap2_test_connection',
    description: '测试连接并校验会话：探测 /repository/joined，必要时自动登录后再探测',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'rap2_ensure_session',
    description: '使用环境参数登录并保存 Cookie 到会话缓存',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'rap2_debug_login_info',
    description: '调试当前登录环境配置（不返回明文密码）',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'rap2_get_interface_by_id',
    description: '根据接口 ID 获取接口详情',
    inputSchema: {
      type: 'object',
      properties: {
        interfaceId: { type: ['string', 'number'], description: '接口 ID' },
      },
      required: ['interfaceId'],
    },
  },
  {
    name: 'rap2_get_repository_interfaces',
    description: '获取仓库下的全部接口列表',
    inputSchema: {
      type: 'object',
      properties: {
        repositoryId: { type: ['string', 'number'], description: '仓库 ID' },
      },
      required: ['repositoryId'],
    },
  },
  {
    name: 'rap2_search_interfaces_by_keyword',
    description: '按关键字搜索接口（可选限定仓库）',
    inputSchema: {
      type: 'object',
      properties: {
        keyword: { type: 'string', description: '搜索关键字' },
        repositoryId: { type: ['string', 'number'], description: '仓库 ID（可选）' },
      },
      required: ['keyword'],
    },
  },
];

const server = new Server(
  { name: 'rap2-mcp-tool', version: '0.1.4' },
  { capabilities: { tools: { list: tools } } },
);

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const name = req.params.name;
  logger.info({ tool: name, args: req.params.arguments || {} }, 'incoming tool call');
  try {
    if (name === 'rap2_test_connection') {
      const client = createClient();
      const probe = async () => client._fetch('/repository/joined');
      let res = await probe();
      const looksLikeHtml = !!res?.data?.raw;
      const notOk = res?.status !== 200 || looksLikeHtml || res?.data?.isOk === false;
      let didLogin = false;
      if (notOk) {
        const login = await client.login();
        didLogin = !login?.error;
        res = await probe();
      }
      const ok = res?.status === 200 && !res?.data?.raw;
      const payload = { ok, status: res?.status ?? 0, didLogin };
      logger.info({ tool: name, result: payload }, 'tool success');
      return { content: [{ type: 'text', text: JSON.stringify(payload) }] };
    }
    if (name === 'rap2_ensure_session') {
      const client = createClient();
      const result = await client.login();
      if (result?.error) throw new Error(String(result.error));
      const cookies = client.getCookies();
      const payload = { ok: true, cookies: { hasSid: !!cookies.sid, hasSidSig: !!cookies.sidSig } };
      logger.info({ tool: name, result: payload }, 'tool success');
      return { content: [{ type: 'text', text: JSON.stringify(payload) }] };
    }
    if (name === 'rap2_debug_login_info') {
      const { baseUrl, email, sid, sidSig } = readEnvConfig();
      const payload = { baseUrl, email, hasSid: !!sid, hasSidSig: !!sidSig, hasPassword: !!(process.env.RAP2_PASSWORD || process.env.RAP_PASSWORD) };
      logger.info({ tool: name, result: payload }, 'tool success');
      return { content: [{ type: 'text', text: JSON.stringify(payload) }] };
    }
    if (name === 'rap2_get_interface_by_id') {
      const { interfaceId } = (req.params.arguments || {});
      if (!interfaceId) throw new Error('interfaceId 不能为空');
      const client = createClient();
      const result = await client.getInterfaceById(String(interfaceId));
      if (result?.error) throw new Error(String(result.error));
      logger.info({ tool: name, resultSummary: Array.isArray(result) ? { length: result.length } : { ok: !!result } }, 'tool success');
      return { content: [{ type: 'text', text: JSON.stringify(result) }] };
    }
    if (name === 'rap2_get_repository_interfaces') {
      const { repositoryId } = (req.params.arguments || {});
      if (!repositoryId) throw new Error('repositoryId 不能为空');
      const client = createClient();
      const result = await client.getRepositoryInterfaces(String(repositoryId));
      if (result?.error) throw new Error(String(result.error));
      logger.info({ tool: name, resultSummary: { length: Array.isArray(result) ? result.length : 0 } }, 'tool success');
      return { content: [{ type: 'text', text: JSON.stringify(result) }] };
    }
    if (name === 'rap2_search_interfaces_by_keyword') {
      const { keyword, repositoryId } = (req.params.arguments || {});
      if (!keyword) throw new Error('keyword 不能为空');
      const client = createClient();
      const result = await client.searchInterfacesByKeyword(String(keyword), repositoryId ? String(repositoryId) : undefined);
      if (result?.error) throw new Error(String(result.error));
      logger.info({ tool: name, resultSummary: { length: Array.isArray(result) ? result.length : 0 } }, 'tool success');
      return { content: [{ type: 'text', text: JSON.stringify(result) }] };
    }
    throw new Error(`未知工具：${name}`);
  } catch (err) {
    logger.error({ tool: name, error: String(err?.message || err) }, 'tool error');
    return { content: [{ type: 'text', text: JSON.stringify({ error: String(err?.message || err) }) }] };
  }
});

logger.info({ event: 'server.start' }, 'rap2 mcp server starting');
const transport = new StdioServerTransport();
await server.connect(transport);
logger.info({ event: 'server.started' }, 'rap2 mcp server connected via stdio');

