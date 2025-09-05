#!/usr/bin/env node

import { Rap2Client } from './rap2Client.js';

// 简单的测试脚本
async function testRap2Client() {
  console.log('🧪 测试 RAP2 客户端...');
  
  // 测试配置
  const config = {
    baseUrl: process.env.RAP2_BASE_URL || 'http://rap2.example.com',
    email: process.env.RAP2_EMAIL || 'test@example.com',
    password: process.env.RAP2_PASSWORD || 'testpass',
  };
  
  console.log('📋 配置信息:');
  console.log(`  - Base URL: ${config.baseUrl}`);
  console.log(`  - Email: ${config.email}`);
  console.log(`  - Password: ${config.password ? '***' : '未设置'}`);
  
  try {
    const client = new Rap2Client(config);
    console.log('✅ RAP2 客户端创建成功');
    
    // 测试连接（不实际发送请求，只测试客户端初始化）
    console.log('🔗 客户端已准备就绪');
    console.log('📝 注意：要测试实际连接，请设置正确的 RAP2_BASE_URL、RAP2_EMAIL 和 RAP2_PASSWORD 环境变量');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    process.exit(1);
  }
}

// 运行测试
testRap2Client().catch(console.error);
