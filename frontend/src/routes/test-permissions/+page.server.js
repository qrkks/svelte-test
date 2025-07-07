import { requirePermission } from '$lib/server/middleware/permissions';
import { getAllUserPermissions } from '$lib/server/permissions';

export const load = async (event) => {
    // 1. 权限检查
    await requirePermission('system:admin')(event);
    
    // 2. 获取用户所有权限信息
    const allPermissions = await getAllUserPermissions(event.locals.user.id);
    
    // 3. 调试信息
    console.log(JSON.stringify(allPermissions));
    // console.log('=== 权限调试信息 ===');
    // console.log('用户ID:', event.locals.user.id);
    // console.log('系统权限:', allPermissions.system);
    // console.log('组织数量:', allPermissions.organizations.length);
    
    // allPermissions.organizations.forEach((org, index) => {
    //     console.log(`组织 ${index + 1}:`, org.organizationName);
    //     console.log('组织权限:', org.permissions);
    //     console.log('子组织数量:', org.subOrganizations.length);
        
    //     org.subOrganizations.forEach((subOrg, subIndex) => {
    //         console.log(`  子组织 ${subIndex + 1}:`, subOrg.subOrganizationName);
    //         console.log('  子组织权限:', subOrg.permissions);
    //     });
    // });
    
    return {
        user: event.locals.user,
        permissions: allPermissions
    };
}; 