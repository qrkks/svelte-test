import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

export const GET = async () => {
    try {
        const users = await db
            .select({
                id: table.user.id,
                username: table.user.username,
                email: table.user.email,
                createdAt: table.user.createdAt
            })
            .from(table.user)
            .orderBy(table.user.id);
        
        return json({ 
            success: true, 
            users 
        });
    } catch (error) {
        console.error('获取用户列表失败:', error);
        return json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}; 