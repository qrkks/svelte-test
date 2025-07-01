import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async () => {
	try {
		const testData = await db.select().from(table.test);
		// console.log(event);
		return {
			testData
		};
	} catch (error) {
		console.error('Error loading test data:', error);
		throw error;
	}
};

export const actions = {
	insert: async ({ request }) => {
		const formData = await request.formData();
		const testInput = formData.get('test');
		console.log(testInput);
		try {
			await db.insert(table.test).values({
				testInput
			});
			return {
				success: true
			};
		} catch (error) {
			console.error('Error inserting test data:', error);
			return {
				success: false
			};
		}
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		try {
			await db.delete(table.test).where(eq(table.test.id, id));
			return {
				success: true
			};
		} catch (error) {
			console.error('Error deleting test data:', error);
			return {
				success: false
			};
		}
	}
};
