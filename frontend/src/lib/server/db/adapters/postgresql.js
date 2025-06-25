import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// PostgreSQL 连接配置
const client = postgres(env.DATABASE_URL, {
	// 预生产环境推荐配置
	max: 10, // 最大连接数
	idle_timeout: 20, // 空闲超时（秒）
	connect_timeout: 10, // 连接超时（秒）
	prepare: false // 禁用预处理语句以提高兼容性
});

export const db = drizzle(client, { schema }); 