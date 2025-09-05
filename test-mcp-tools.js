#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// 简单的测试工具
const tools = [
  {
    name: 'test_tool',
    description: '测试工具',
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: '测试消息' }
      },
      required: ['message']
    }
  }
];

console.log('🔧 测试MCP工具注册...');
console.log('📋 工具列表:', tools.map(t => t.name));

const server = new Server(
  { name: 'test-mcp-server', version: '1.0.0' },
  { capabilities: { tools: { list: tools } } }
);

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  console.log('🛠️ 收到工具调用:', req.params.name);
  return { 
    content: [{ 
      type: 'text', 
      text: `工具 ${req.params.name} 调用成功！参数: ${JSON.stringify(req.params.arguments)}` 
    }] 
  };
});

console.log('🚀 启动测试MCP服务器...');
const transport = new StdioServerTransport();
await server.connect(transport);
console.log('✅ MCP服务器已连接');
