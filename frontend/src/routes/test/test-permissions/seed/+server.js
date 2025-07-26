import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST = async ({ request }) => {
    try {
        const { userId } = await request.json();
        
        if (!userId || userId < 1) {
            return json({ 
                success: false, 
                error: '请提供有效的用户ID' 
            }, { status: 400 });
        }
        
        // 检查用户是否存在
        const user = await db
            .select()
            .from(table.user)
            .where(eq(table.user.id, userId))
            .limit(1);
        
        if (!user.length) {
            return json({ 
                success: false, 
                error: `用户ID ${userId} 不存在` 
            }, { status: 404 });
        }
        
        // 检查是否已经创建过测试数据
        const existingRoles = await db
            .select()
            .from(table.systemRole)
            .limit(1);
        
        if (existingRoles.length > 0) {
            return json({ 
                success: false, 
                error: '测试数据已经存在，请勿重复创建' 
            }, { status: 400 });
        }
        
        // 1. 创建系统角色
        await db.insert(table.systemRole).values({
            name: 'admin',
            description: '系统管理员'
        });
        
        await db.insert(table.systemRole).values({
            name: 'super_admin',
            description: '超级管理员'
        });
        
        // 2. 创建主组织角色
        await db.insert(table.organizationRole).values([
            { name: '会长', description: '协会会长' },
            { name: '副会长', description: '协会副会长' },
            { name: '秘书长', description: '协会秘书长' }
        ]);
        
        // 3. 创建子组织角色
        await db.insert(table.subOrganizationRole).values([
            { name: '主席', description: '专委会主席' },
            { name: '副主席', description: '专委会副主席' },
            { name: '委员', description: '专委会委员' },
            { name: '秘书', description: '专委会秘书' }
        ]);
        
        // 4. 创建系统权限
        await db.insert(table.systemRolePermissionLink).values([
            { systemRoleId: 1, permission: 'system:admin' },
            { systemRoleId: 1, permission: 'system:config' },
            { systemRoleId: 1, permission: 'system:user_manage' },
            { systemRoleId: 2, permission: 'system:admin' },
            { systemRoleId: 2, permission: 'system:config' },
            { systemRoleId: 2, permission: 'system:user_manage' }
        ]);
        
        // 5. 创建主组织权限
        await db.insert(table.organizationRolePermissionLink).values([
            { organizationRoleId: 1, permission: 'organization:manage' },
            { organizationRoleId: 1, permission: 'organization:view' },
            { organizationRoleId: 1, permission: 'organization:edit' },
            { organizationRoleId: 1, permission: 'sub_organization:create' },
            { organizationRoleId: 1, permission: 'sub_organization:manage' },
            { organizationRoleId: 2, permission: 'organization:view' },
            { organizationRoleId: 2, permission: 'organization:edit' },
            { organizationRoleId: 3, permission: 'organization:view' }
        ]);
        
        // 6. 创建子组织权限
        await db.insert(table.subOrganizationRolePermissionLink).values([
            { subOrganizationRoleId: 1, permission: 'sub_organization:manage' },
            { subOrganizationRoleId: 1, permission: 'sub_organization:view' },
            { subOrganizationRoleId: 1, permission: 'sub_organization:edit' },
            { subOrganizationRoleId: 2, permission: 'sub_organization:view' },
            { subOrganizationRoleId: 2, permission: 'sub_organization:edit' },
            { subOrganizationRoleId: 3, permission: 'sub_organization:view' },
            { subOrganizationRoleId: 4, permission: 'sub_organization:view' }
        ]);
        
        // 7. 创建测试组织
        await db.insert(table.organization).values({
            name: '测试协会',
            type: 'association',
            description: '用于测试的协会'
        });
        
        // 8. 创建测试子组织
        await db.insert(table.subOrganization).values({
            name: '测试专委会',
            organizationId: 1,
            type: 'committee',
            description: '用于测试的专委会'
        });
        
        // 9. 给指定用户分配角色
        await db.insert(table.userSystemRoleLink).values({
            userId: userId,
            systemRoleId: 1
        });
        
        await db.insert(table.userOrganizationRoleMap).values({
            userId: userId,
            organizationId: 1,
            organizationRoleId: 1
        });
        
        await db.insert(table.userSubOrganizationRoleMap).values({
            userId: userId,
            subOrganizationId: 1,
            subOrganizationRoleId: 1
        });
        
        return json({ 
            success: true, 
            message: `测试数据创建成功！已为用户 ${user[0].username} (ID: ${userId}) 分配了管理员角色。` 
        });
    } catch (error) {
        console.error('创建测试数据失败:', error);
        return json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}; 