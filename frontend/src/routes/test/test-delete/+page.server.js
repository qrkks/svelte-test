import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export const load = async () => {
	const testList = await db.select().from(schema.test).orderBy(desc(schema.test.id));
	return {
		testList: testList
	};
};

export const actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		console.log(formData);
		const id = formData.get('id');
		await db.delete(schema.test).where(eq(schema.test.id, id));
		return {
			success: true
		};
	}
};
