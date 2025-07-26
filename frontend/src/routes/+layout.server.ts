import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
	locals
}: {
	locals: { user: { id: string; username: string; role: string; lastLoginTime: string } | null };
}) => {
	return {
		user: locals.user
	};
};
