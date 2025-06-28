import { redirect } from '@sveltejs/kit';
export const load = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		return redirect(302, '/settings/auth/login');
	}
	return {};
};
