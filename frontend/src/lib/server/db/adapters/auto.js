import { env } from '$env/dynamic/private';

// 根据环境变量选择数据库实现
const dbType = env.DB_TYPE || 'sqlite'; // 默认使用 sqlite

let db;

switch (dbType.toLowerCase()) {
	case 'postgresql':
	case 'postgres':
	case 'pg': {
		const { db: pgDb } = await import('./postgresql.js');
		db = pgDb;
		console.log('📊 使用 PostgreSQL 数据库');
		break;
	}
	
	case 'sqlite':
	default: {
		const { db: sqliteDb } = await import('../sqlite.js');
		db = sqliteDb;
		console.log('📊 使用 SQLite 数据库');
		break;
	}
}

export { db }; 