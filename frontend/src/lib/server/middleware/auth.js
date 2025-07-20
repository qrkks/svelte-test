import { redirect } from '@sveltejs/kit';

export function requireAuth(event) {
    if (!event.locals.user) {
        redirect(302, `/settings/auth/login?redirectTo=${event.url.pathname}`);
    }
    return event.locals.user;
}
