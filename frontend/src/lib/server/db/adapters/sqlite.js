import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = new Database(env.DATABASE_URL); // 创建数据库连接

export const db = drizzle(client, { schema }); // 创建数据库Drizzle ORM实例
