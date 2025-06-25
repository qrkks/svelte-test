import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';

export const load = async () => {
	const user = requireLogin();
	return { user };
};

export const actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/settings/auth/login');
	}
};

function requireLogin() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return redirect(302, '/settings/auth/login');
	}

	return locals.user;
}
