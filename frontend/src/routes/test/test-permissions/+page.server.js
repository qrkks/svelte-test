import { requirePermission } from '$lib/server/middleware/permissions';
import { getAllUserPermissions } from '$lib/server/permissions';

export const load = async (event) => {
    // 1. 权限检查
    await requirePermission('system:admin')(event);
    
    // 2. 获取用户所有权限信息
    const allPermissions = await getAllUserPermissions(event.locals.user.id);
    
    // 3. 调试信息
    console.log(JSON.stringify(allPermissions));
    
    return {
        user: event.locals.user,
        permissions: allPermissions
    };
}; 