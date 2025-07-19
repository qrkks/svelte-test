TITLE: Consuming Page Data in Svelte `+page.svelte`
DESCRIPTION: This Svelte component demonstrates how to consume data loaded by a `+page.js` file. It uses `$props()` to destructure the `data` prop, which contains the `post` object, and then renders its title and content within the HTML structure.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_1

LANGUAGE: Svelte
CODE:
```
<--- file: src/routes/blog/[slug]/+page.svelte --->
<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();
</script>

<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>
```

----------------------------------------

TITLE: Loading Server-Side Page Data with `+page.server.js`
DESCRIPTION: This `load` function, defined in `+page.server.js`, is designed to run exclusively on the server. It demonstrates fetching blog post data from a server-side database using `db.getPost` and ensures type safety with `PageServerLoad`. This approach is suitable for operations requiring private environment variables or direct database access.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_3

LANGUAGE: JavaScript
CODE:
```
/// file: src/routes/blog/[slug]/+page.server.js
// @filename: ambient.d.ts
declare module '$lib/server/database' {
	export function getPost(slug: string): Promise<{ title: string, content: string }>
}

// @filename: index.js
// ---cut---
import * as db from '$lib/server/database';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		post: await db.getPost(params.slug)
	};
}
```

----------------------------------------

TITLE: Loading Page Data with `+page.js` in SvelteKit
DESCRIPTION: This JavaScript `load` function, defined in `+page.js`, fetches data for a SvelteKit page. It runs on both the server and browser, returning a `post` object with dynamic title and content based on route parameters. The returned data is made available to the corresponding `+page.svelte` component via its `data` prop.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_0

LANGUAGE: JavaScript
CODE:
```
/// file: src/routes/blog/[slug]/+page.js
/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	return {
		post: {
			title: `Title for ${params.slug} goes here`,
			content: `Content for ${params.slug} goes here`
		}
	};
}
```

----------------------------------------

TITLE: Accessing Cookies in SvelteKit Layout Server Load (JS)
DESCRIPTION: This snippet shows how to access and retrieve cookies within a SvelteKit `LayoutServerLoad` function. It uses the `cookies.get()` method to read a `sessionid` cookie, which is then used to fetch user data from a database, demonstrating server-side cookie management.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_14

LANGUAGE: js
CODE:
```
// @filename: ambient.d.ts
declare module '$lib/server/database' {
	export function getUser(sessionid: string | undefined): Promise<{ name: string, avatar: string }>
}

// @filename: index.js
// ---cut---
import * as db from '$lib/server/database';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
	const sessionid = cookies.get('sessionid');

	return {
		user: await db.getUser(sessionid)
	};
}
```

----------------------------------------

TITLE: Defining Server Load Function in SvelteKit (JavaScript)
DESCRIPTION: This JavaScript snippet defines a server-side `load` function in `+page.server.js`. It's an asynchronous function that returns an object containing `serverMessage`. This data is accessible only on the server and can be passed to a universal `load` function or directly to the page if no universal `load` exists.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_9

LANGUAGE: js
CODE:
```
/// file: src/routes/+page.server.js
/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {
		serverMessage: 'hello from server load function'
	};
}
```

----------------------------------------

TITLE: Defining Universal Load Function with Server Data in SvelteKit (JavaScript)
DESCRIPTION: This JavaScript snippet defines a universal `load` function in `+page.js`. It receives the output of the server `load` function (if present) via the `data` property in its argument. It then combines `serverMessage` from the server data with its own `universalMessage` before returning the combined object, demonstrating how universal `load` functions can process data from server `load` functions.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_10

LANGUAGE: js
CODE:
```
/// file: src/routes/+page.js
// @errors: 18047
/** @type {import('./$types').PageLoad} */
export async function load({ data }) {
	return {
		serverMessage: data.serverMessage,
		universalMessage: 'hello from universal load function'
	};
}
```

----------------------------------------

TITLE: Triggering SvelteKit Load Function Reruns from Svelte Component
DESCRIPTION: This Svelte component demonstrates how to manually trigger a rerun of the associated `load` function using `invalidate` and `invalidateAll` from `$app/navigation`. It provides a button that, when clicked, will force the `load` function to re-fetch data, updating the displayed random number.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_30

LANGUAGE: Svelte
CODE:
```
<script>
	import { invalidate, invalidateAll } from '$app/navigation';

	/** @type {import('./$types').PageProps} */
	let { data } = $props();

	function rerunLoadFunction() {
		// any of these will cause the `load` function to rerun
		invalidate('app:random');
		invalidate('https://api.example.com/random-number');
		invalidate(url => url.href.includes('random-number'));
		invalidateAll();
	}
</script>

<p>random number: {data.number}</p>
<button onclick={rerunLoadFunction}>Update random number</button>
```

----------------------------------------

TITLE: Accessing Route ID in SvelteKit Page Load (JS)
DESCRIPTION: This snippet demonstrates how to access the `route.id` property within a SvelteKit `PageLoad` function. The `route.id` provides the name of the current route directory, relative to `src/routes`, useful for understanding the matched route pattern.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_11

LANGUAGE: js
CODE:
```
/// file: src/routes/a/[b]/[...c]/+page.js
/** @type {import('./$types').PageLoad} */
export function load({ route }) {
	console.log(route.id); // '/a/[b]/[...c]'
}
```

----------------------------------------

TITLE: Accessing Page Data in SvelteKit Layouts (Svelte)
DESCRIPTION: This Svelte snippet demonstrates how a parent layout component can access data from a child page or layout using the `page.data` store. It imports `page` from `$app/state` and uses `page.data.title` to dynamically set the document title within the `<svelte:head>` section, allowing for titles based on child component data.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_8

LANGUAGE: svelte
CODE:
```
<--- file: src/routes/+layout.svelte --->
<script>
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.data.title}</title>
</svelte:head>
```

----------------------------------------

TITLE: Making Credentialed Fetch Requests in SvelteKit Load (JS)
DESCRIPTION: This example demonstrates using the SvelteKit-provided `fetch` function within a `PageLoad` function to retrieve data from an API. This `fetch` function extends the native `fetch` API, allowing relative requests on the server and inheriting `cookie` and `authorization` headers for credentialed requests. It fetches an item based on a dynamic `id` from `params`.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_13

LANGUAGE: js
CODE:
```
/// file: src/routes/items/[id]/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	const res = await fetch(`/api/items/${params.id}`);
	const item = await res.json();

	return { item };
}
```

----------------------------------------

TITLE: Avoiding Waterfalls with Parallel Data Fetching in SvelteKit
DESCRIPTION: This snippet illustrates how to prevent waterfalls in `load` functions by calling independent asynchronous operations in parallel. `getData(params)` is called before `await parent()` because its result does not depend on parent data, optimizing load times.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_20

LANGUAGE: js
CODE:
```
// @filename: ambient.d.ts
declare function getData(params: Record<string, string>): Promise<{ meta: any }>

// @filename: index.js
// ---cut---
/** @type {import('./$types').PageLoad} */
export async function load({ params, parent }) {
	const data = await getData(params);
	const parentData = await parent();

	return {
		...data,
		meta: { ...parentData.meta, ...data.meta }
	};
}
```

----------------------------------------

TITLE: Using requireLogin in a SvelteKit Server Load Function
DESCRIPTION: This JavaScript snippet demonstrates how to integrate the `requireLogin` function (defined in `src/lib/server/auth.js`) into a SvelteKit `+page.server.js` `load` function. By calling `requireLogin()`, it ensures that the user is authenticated before proceeding, as `requireLogin` will redirect if the user is not logged in. If authentication succeeds, it returns a message including the user's name.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_32

LANGUAGE: JavaScript
CODE:
```
/// file: +page.server.js
// @filename: ambient.d.ts

declare module '$lib/server/auth' {
	interface User {
		name: string;
	}

	export function requireLogin(): User;
}

// @filename: index.ts
// ---cut---
import { requireLogin } from '$lib/server/auth';

export function load() {
	const user = requireLogin();

	// `user` is guaranteed to be a user object here, because otherwise
	// `requireLogin` would throw a redirect and we wouldn't get here
	return {
		message: `hello ${user.name}!`
	};
}
```

----------------------------------------

TITLE: Loading Blog Post Summaries in SvelteKit Layout Server Load
DESCRIPTION: This SvelteKit `LayoutServerLoad` function fetches a list of blog post summaries from a database. Since it does not depend on any dynamic URL parameters, it will not rerun unnecessarily during navigation between different blog post pages, as its data remains valid.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_27

LANGUAGE: JavaScript
CODE:
```
// @filename: ambient.d.ts
declare module '$lib/server/database' {
	export function getPostSummaries(): Promise<Array<{ title: string, slug: string }>>
}

// @filename: index.js
// ---cut---
import * as db from '$lib/server/database';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	return {
		posts: await db.getPostSummaries()
	};
}
```

----------------------------------------

TITLE: Loading Single Blog Post Data in SvelteKit Page Server Load
DESCRIPTION: This SvelteKit `PageServerLoad` function fetches a single blog post from a database based on the `slug` parameter from the URL. It demonstrates how `params.slug` is tracked as a dependency, causing the `load` function to rerun when the slug changes during navigation.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_26

LANGUAGE: JavaScript
CODE:
```
// @filename: ambient.d.ts
declare module '$lib/server/database' {
	export function getPost(slug: string): Promise<{ title: string, content: string }>
}

// @filename: index.js
// ---cut---
import * as db from '$lib/server/database';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		post: await db.getPost(params.slug)
	};
}
```

----------------------------------------

TITLE: Handling Promise Rejections in SvelteKit Server Load
DESCRIPTION: This JavaScript snippet illustrates how to handle promise rejections in a SvelteKit server `load` function to prevent unhandled promise rejection errors. It shows attaching a no-op `catch` to a manually rejected promise (`ok_manual`) and notes that SvelteKit's `fetch` automatically handles rejections (`ok_fetch`). It also highlights a `dangerous_unhandled` promise that could crash the server if not caught.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_25

LANGUAGE: js
CODE:
```
/// file: src/routes/+page.server.js
/** @type {import('./$types').PageServerLoad} */
export function load({ fetch }) {
	const ok_manual = Promise.reject();
	ok_manual.catch(() => {});

	return {
		ok_manual,
		ok_fetch: fetch('/fetch/that/could/fail'),
		dangerous_unhandled: Promise.reject()
	};
}
```

----------------------------------------

TITLE: Defining Root Layout Data in SvelteKit
DESCRIPTION: This snippet defines a basic `load` function in the root `+layout.js` file. It returns an object `{ a: 1 }`, making this data available to child `load` functions and components within the application's layout structure.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_16

LANGUAGE: js
CODE:
```
/** @type {import('./$types').LayoutLoad} */
export function load() {
	return { a: 1 };
}
```

----------------------------------------

TITLE: Consuming Layout Data in Svelte `+layout.svelte`
DESCRIPTION: This Svelte layout component consumes data loaded by a `+layout.server.js` file. It destructures `data` and `children` from `$props()`, renders the child page/layout using `{@render children()}`, and displays a list of posts from `data.posts` in a sidebar, demonstrating data sharing across layout hierarchy.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_5

LANGUAGE: Svelte
CODE:
```
<--- file: src/routes/blog/[slug]/+layout.svelte --->
<script>
	/** @type {import('./$types').LayoutProps} */
	let { data, children } = $props();
</script>

<main>
	<!-- +page.svelte is `@render`ed here -->
	{@render children()}
</main>

<aside>
	<h2>More posts</h2>
	<ul>
		{#each data.posts as post}
			<li>
				<a href="/blog/{post.slug}">
					{post.title}
				</a>
			</li>
		{/each}
	</ul>
</aside>
```

----------------------------------------

TITLE: Accessing Layout Data in Svelte `+page.svelte`
DESCRIPTION: This Svelte page component demonstrates how data loaded by a parent layout's `load` function (e.g., `data.posts`) is automatically available to child pages. It imports `page` from `$app/state` to determine the current post's index and calculate the next post, showcasing data inheritance and derived state.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_7

LANGUAGE: Svelte
CODE:
```
/// file: src/routes/blog/[slug]/+page.svelte
<script>
	+++import { page } from '$app/state';+++

	/** @type {import('./$types').
```

----------------------------------------

TITLE: Legacy Page Prop Typing in SvelteKit (Pre-2.16.0)
DESCRIPTION: This snippet shows the legacy method for typing page props in SvelteKit prior to version 2.16.0. Instead of using `PageProps`, the `data` prop had to be individually typed with `import('./$types').PageData` within the `+page.svelte` script.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_2

LANGUAGE: JavaScript
CODE:
```
/// file: +page.svelte
/** @type {{ data: import('./$types').PageData }} */
let { data } = $props();
```

----------------------------------------

TITLE: Handling SvelteKit `use:enhance` Results with `applyAction`
DESCRIPTION: When a custom callback is provided to `use:enhance`, it overrides the default post-submission behavior. To re-enable the default logic or handle specific `ActionResult` types, `applyAction` can be used. This function processes the `ActionResult` (e.g., updating form data, redirecting, or rendering errors) and ensures focus is reset appropriately.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/30-form-actions.md#_snippet_16

LANGUAGE: Svelte
CODE:
```
/// file: src/routes/login/+page.svelte
<script>
	import { enhance, applyAction } from '$app/forms';

	/** @type {import('./$types').PageProps} */
	let { form } = $props();
</script>

<form
	method="POST"
	use:enhance={({ formElement, formData, action, cancel }) => {
		return async ({ result }) => {
			// `result` is an `ActionResult` object
			if (result.type === 'redirect') {
				goto(result.location);
			} else {
				await applyAction(result);
			}
		};
	}}
>

```

----------------------------------------

TITLE: Manage Data Loading and event.locals with SvelteKit Actions
DESCRIPTION: Explains the interaction between SvelteKit actions, `load` functions, and the `handle` hook. It demonstrates how `load` functions re-run after an action and the necessity of manually updating `event.locals` within an action if it modifies data (like cookies) that `handle` uses to populate `event.locals`.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/30-form-actions.md#_snippet_13

LANGUAGE: JavaScript
CODE:
```
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	event.locals.user = await getUser(event.cookies.get('sessionid'));
	return resolve(event);
}
```

LANGUAGE: JavaScript
CODE:
```
/** @type {import('./$types').PageServerLoad} */
export function load(event) {
	return {
		user: event.locals.user
	};
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	logout: async (event) => {
		event.cookies.delete('sessionid', { path: '/' });
		event.locals.user = null;
	}
};
```

----------------------------------------

TITLE: Invoke Named Form Action from Svelte Page
DESCRIPTION: This Svelte form demonstrates how to invoke a specific named action (e.g., `register`) on the current page by appending a query parameter prefixed with `/` to the `action` attribute.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/30-form-actions.md#_snippet_4

LANGUAGE: svelte
CODE:
```
<!- file: src/routes/login/+page.svelte -->
<form method="POST" action="?/register">
```

----------------------------------------

TITLE: SvelteKit GET Method Form for Client-Side Navigation
DESCRIPTION: This HTML snippet illustrates a form using `method="GET"`. Unlike `POST` forms, SvelteKit treats `GET` forms similarly to `<a>` elements, utilizing the client-side router for navigation (e.g., `/search?q=...`) and invoking `load` functions without triggering server actions. It also mentions `data-sveltekit-*` attributes for router control.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/30-form-actions.md#_snippet_20

LANGUAGE: HTML
CODE:
```
<form action="/search">
	<label>
		Search
		<input name="q">
	</label>
</form>
```

----------------------------------------

TITLE: SvelteKit Custom Form Submission with Event Listener
DESCRIPTION: This Svelte component demonstrates how to implement a custom form submission handler without relying on SvelteKit's `use:enhance` action. It uses a standard `onsubmit` event listener to prevent default form submission, manually `fetch` the form action, `deserialize` the response, and then `invalidateAll` and `applyAction` to update the UI and rerun `load` functions.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/30-form-actions.md#_snippet_17

LANGUAGE: Svelte
CODE:
```
<!- file: src/routes/login/+page.svelte -->
<script>
	import { invalidateAll, goto } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';

	/** @type {import('./$types').PageProps} */
	let { form } = $props();

	/** @param {SubmitEvent & { currentTarget: EventTarget & HTMLFormElement}} event */
	async function handleSubmit(event) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);

		const response = await fetch(event.currentTarget.action, {
			method: 'POST',
			body: data
		});

		/** @type {import('@sveltejs/kit').ActionResult} */
		const result = deserialize(await response.text());

		if (result.type === 'success') {
			// rerun all `load` functions, following the successful update
			await invalidateAll();
		}

		applyAction(result);
	}
</script>

<form method="POST" onsubmit={handleSubmit}>
	<!-- content -->
</form>
```

----------------------------------------

TITLE: Handling Streamed Promises in Svelte Component
DESCRIPTION: This Svelte component demonstrates how to consume streamed promises from a `load` function using the `#await` block. It displays a loading state while `data.comments` is resolving, then renders the comments upon resolution, and provides error handling if the promise rejects. This enables skeleton loading states for asynchronously loaded data.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_24

LANGUAGE: svelte
CODE:
```
<!- file: src/routes/blog/[slug]/+page.svelte -->
<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();
</script>

<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>

{#await data.comments}
	Loading comments...
{:then comments}
	{#each comments as comment}
		<p>{comment.content}</p>
	{/each}
{:catch error}
	<p>error loading comments: {error.message}</p>
{/await}
```

----------------------------------------

TITLE: Handling Expected Errors with SvelteKit `error` Helper
DESCRIPTION: This `+layout.server.js` snippet demonstrates using the `error` helper from `@sveltejs/kit` to throw expected HTTP errors. It checks user authentication and admin status, throwing 401 (Unauthorized) or 403 (Forbidden) errors respectively, which will render the nearest `+error.svelte`.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_21

LANGUAGE: js
CODE:
```
// @filename: ambient.d.ts
declare namespace App {
	interface Locals {
		user?: {
			name: string;
			isAdmin: boolean;
		}
	}
}

// @filename: index.js
// ---cut---
import { error } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }) {
	if (!locals.user) {
		error(401, 'not logged in');
	}

	if (!locals.user.isAdmin) {
		error(403, 'not an admin');
	}
}
```

----------------------------------------

TITLE: Accessing Parent Layout Data in SvelteKit
DESCRIPTION: This `load` function in a nested layout (`/abc/+layout.js`) demonstrates how to access data from a parent `load` function using `await parent()`. It retrieves the `a` property from the root layout's data and returns a new property `b` derived from it.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_17

LANGUAGE: js
CODE:
```
/** @type {import('./$types').LayoutLoad} */
export async function load({ parent }) {
	const { a } = await parent();
	return { b: a + 1 };
}
```

----------------------------------------

TITLE: Define Default Form Action in SvelteKit
DESCRIPTION: This JavaScript snippet demonstrates how to export a `default` action within a `+page.server.js` file. This action will be invoked when a form on the corresponding page makes a POST request without specifying a named action.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/30-form-actions.md#_snippet_0

LANGUAGE: js
CODE:
```
/// file: src/routes/login/+page.server.js
/** @satisfies {import('./$types').Actions} */
export const actions = {
	default: async (event) => {
		
	}
};
```

----------------------------------------

TITLE: Customizing SvelteKit `use:enhance` Behavior
DESCRIPTION: To customize the progressive enhancement behavior, `use:enhance` accepts a `SubmitFunction` callback. This function runs immediately before form submission, allowing access to form elements, data, and the ability to cancel submission. It can optionally return another callback to handle the `ActionResult` after submission, enabling custom UI updates like loading indicators.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/30-form-actions.md#_snippet_15

LANGUAGE: Svelte
CODE:
```
<form
	method="POST"
	use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		// `formElement` is this `<form>` element
		// `formData` is its `FormData` object that's about to be submitted
		// `action` is the URL to which the form is posted
		// calling `cancel()` will prevent the submission
		// `submitter` is the `HTMLElement` that caused the form to be submitted

		return async ({ result, update }) => {
			// `result` is an `ActionResult` object
			// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
		};
	}}
>

```

----------------------------------------

TITLE: Define Named Form Actions in SvelteKit
DESCRIPTION: Instead of a single default action, this JavaScript code illustrates how to export multiple named actions (e.g., `login`, `register`) within `+page.server.js`. Each named action can handle distinct form submissions.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/30-form-actions.md#_snippet_3

LANGUAGE: js
CODE:
```
/// file: src/routes/login/+page.server.js
/** @satisfies {import('./$types').Actions} */
export const actions = {
	login: async (event) => {
		
	},
	register: async (event) => {
		
	}
};
```

----------------------------------------

TITLE: Access Form Data and Display Messages in Svelte Page
DESCRIPTION: This Svelte component demonstrates how to access the `form` property, which contains data returned by a server-side action. It shows how to conditionally display ephemeral messages (e.g., 'Successfully logged in!') based on the action's response.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/30-form-actions.md#_snippet_8

LANGUAGE: svelte
CODE:
```
<!- file: src/routes/login/+page.svelte -->
<script>
	/** @type {import('./$types').PageProps} */
	let { data, form } = $props();
</script>

{#if form?.success}
	<!-- this message is ephemeral; it exists because the page was rendered in
	       response to a form submission. it will vanish if the user reloads -->
	<p>Successfully logged in! Welcome back, {data.user.name}</p>
{/if}
```

----------------------------------------

TITLE: Handle Validation Errors in SvelteKit Form Actions
DESCRIPTION: Demonstrates how to use SvelteKit's `fail` function to return HTTP status codes (e.g., 400) and validation data from server-side actions. It also shows how to display these errors and pre-fill form fields in the Svelte component using the `form` prop.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/30-form-actions.md#_snippet_11

LANGUAGE: JavaScript
CODE:
```
import { fail } from '@sveltejs/kit';
import * as db from '$lib/server/db';

/** @satisfies {import('./$types').Actions} */
export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if (!email) {
			return fail(400, { email, missing: true });
		}

		const user = await db.getUser(email);

		if (!user || user.password !== db.hash(password)) {
			return fail(400, { email, incorrect: true });
		}

		cookies.set('sessionid', await db.createSession(user), { path: '/' });

		return { success: true };
	},
	register: async (event) => {
		
	}
};
```

LANGUAGE: Svelte
CODE:
```
<form method="POST" action="?/login">
	{#if form?.missing}<p class="error">The email field is required</p>{/if}
	{#if form?.incorrect}<p class="error">Invalid credentials!</p>{/if}
	<label>
		Email
		<input name="email" type="email" value={form?.email ?? ''}>
	</label>
	<label>
		Password
		<input name="password" type="password">
	</label>
	<button>Log in</button>
	<button formaction="?/register">Register</button>
</form>
```

----------------------------------------

TITLE: Invoke Default Form Action from Svelte Page
DESCRIPTION: This Svelte component shows a basic HTML `<form>` element. When submitted, it automatically targets the `default` action defined in the `+page.server.js` file for the current page, requiring no client-side JavaScript.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/30-form-actions.md#_snippet_1

LANGUAGE: svelte
CODE:
```
<!- file: src/routes/login/+page.svelte -->
<form method="POST">
	<label>
		Email
		<input name="email" type="email">
	</label>
	<label>
		Password
		<input name="password" type="password">
	</label>
	<button>Log in</button>
</form>
```

----------------------------------------

TITLE: Handle Form Data and Respond in SvelteKit Action
DESCRIPTION: This JavaScript code demonstrates the anatomy of a SvelteKit action. It shows how an action receives a `RequestEvent`, reads form data using `request.formData()`, performs server-side operations like setting cookies, and returns a response object (e.g., `{ success: true }`) to the client.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/30-form-actions.md#_snippet_7

LANGUAGE: js
CODE:
```
/// file: src/routes/login/+page.server.js
// @filename: ambient.d.ts
declare module '$lib/server/db';

// @filename: index.js
// ---cut---
import * as db from '$lib/server/db';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	const user = await db.getUserFromSession(cookies.get('sessionid'));
	return { user };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		const user = await db.getUser(email);
		cookies.set('sessionid', await db.createSession(user), { path: '/' });

		return { success: true };
	},
	register: async (event) => {
		
	}
};
```

----------------------------------------

TITLE: Example SvelteKit Params Object (JSON)
DESCRIPTION: This JSON snippet illustrates the structure of the `params` object derived from a SvelteKit route. Given a `route.id` like `/a/[b]/[...c]` and a `url.pathname` of `/a/x/y/z`, it shows how dynamic segments (`[b]`) and rest parameters (`[...c]`) are mapped to properties in the `params` object.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_12

LANGUAGE: json
CODE:
```
{
	"b": "x",
	"c": "y/z"
}
```

----------------------------------------

TITLE: Setting Response Headers in SvelteKit Load (JS)
DESCRIPTION: This example illustrates how to use the `setHeaders` function within a SvelteKit `PageLoad` function to control HTTP response headers during server-side rendering. It fetches data from an external API and then sets `age` and `cache-control` headers on the SvelteKit response, useful for caching the rendered HTML.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_15

LANGUAGE: js
CODE:
```
// @errors: 2322 1360
/// file: src/routes/products/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, setHeaders }) {
	const url = `https://cms.example.com/products.json`;
	const response = await fetch(url);

	// Headers are only set during SSR, caching the page's HTML
	// for the same length of time as the underlying data.
	setHeaders({
		age: response.headers.get('age'),
		'cache-control': response.headers.get('cache-control')
	});

	return response.json();
}
```

----------------------------------------

TITLE: Accessing Merged Parent Data in SvelteKit Page Load
DESCRIPTION: This `load` function for a page (`/abc/+page.js`) shows how `parent()` provides merged data from all parent layout `load` functions. It retrieves both `a` (from root layout) and `b` (from immediate parent layout) to calculate and return `c`.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_18

LANGUAGE: js
CODE:
```
/** @type {import('./$types').PageLoad} */
export async function load({ parent }) {
	const { a, b } = await parent();
	return { c: a + b };
}
```

----------------------------------------

TITLE: Consuming Merged Data in SvelteKit Page Component
DESCRIPTION: This Svelte component (`/abc/+page.svelte`) demonstrates how to consume the data returned by the `load` functions. It uses `$props()` to access the `data` object, which contains the merged properties `a`, `b`, and `c` from the parent layouts and page `load` functions.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_19

LANGUAGE: svelte
CODE:
```
<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();
</script>

<!-- renders `1 + 2 = 3` -->
<p>{data.a} + {data.b} = {data.c}</p>
```

----------------------------------------

TITLE: Untracking URL Path Dependency in SvelteKit Page Load
DESCRIPTION: This SvelteKit `PageLoad` function demonstrates how to use the `untrack` utility to prevent a `load` function from rerunning when a specific dependency, in this case `url.pathname`, changes. The `load` function will only return 'Welcome!' if the path is exactly '/' and will not rerun on path changes.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_28

LANGUAGE: JavaScript
CODE:
```
/** @type {import('./$types').PageLoad} */
export async function load({ untrack, url }) {
	// Untrack url.pathname so that path changes don't trigger a rerun
	if (untrack(() => url.pathname === '/')) {
		return { message: 'Welcome!' };
	}
}
```

----------------------------------------

TITLE: Implementing Shared Authentication with getRequestEvent in SvelteKit
DESCRIPTION: This JavaScript snippet defines a `requireLogin` function that leverages SvelteKit's `getRequestEvent` to access the current request's `locals` and `url`. It checks if a user is logged in (assuming `locals.user` is populated by a SvelteKit `handle` hook) and redirects to `/login` if not, preserving the original URL as a `redirectTo` parameter. Otherwise, it returns the authenticated user object.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_31

LANGUAGE: JavaScript
CODE:
```
/// file: src/lib/server/auth.js
// @filename: ambient.d.ts
interface User {
	name: string;
}

declare namespace App {
	interface Locals {
		user?: User;
	}
}

// @filename: index.ts
// ---cut---
import { redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';

export function requireLogin() {
	const { locals, url } = getRequestEvent();

	// assume `locals.user` is populated in `handle`
	if (!locals.user) {
		const redirectTo = url.pathname + url.search;
		const params = new URLSearchParams({ redirectTo });

		redirect(307, `/login?${params}`);
	}

	return locals.user;
}
```

----------------------------------------

TITLE: Manually Invalidating SvelteKit Load Function Dependencies
DESCRIPTION: This SvelteKit `PageLoad` function fetches a random number from an external API and declares a custom dependency using `depends('app:random')`. This allows the `load` function to be manually rerun by calling `invalidate('https://api.example.com/random-number')` or `invalidate('app:random')`, enabling explicit control over data freshness.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_29

LANGUAGE: JavaScript
CODE:
```
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, depends }) {
	// load reruns when `invalidate('https://api.example.com/random-number')` is called...
	const response = await fetch('https://api.example.com/random-number');

	// ...or when `invalidate('app:random')` is called
	depends('app:random');

	return {
		number: await response.json()
	};
}
```

----------------------------------------

TITLE: Loading Data Universally with +page.js in SvelteKit
DESCRIPTION: Shows how to use a `+page.js` module to export a `load` function for fetching data required by a page. This function runs on both the server during SSR and in the browser during client-side navigation, handling dynamic content and error states.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/10-routing.md#_snippet_2

LANGUAGE: javascript
CODE:
```
/// file: src/routes/blog/[slug]/+page.js
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	if (params.slug === 'hello-world') {
		return {
			title: 'Hello world!',
			content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
		};
	}

	error(404, 'Not found');
}
```

----------------------------------------

TITLE: Manual Typing for SvelteKit Page Props (Older Versions)
DESCRIPTION: This JavaScript example shows the manual way to type `data` and `form` props for a SvelteKit page in older versions before `PageProps` was introduced. It explicitly imports `PageData` and `ActionData` from `$types.d.ts`.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/10-routing.md#_snippet_16

LANGUAGE: JavaScript
CODE:
```
/// file: +page.svelte
/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
let { data, form } = $props();
```

----------------------------------------

TITLE: Customizing Error Pages with +error.svelte
DESCRIPTION: Demonstrates how to create a `+error.svelte` file to customize the error page for a specific route, displaying the error status and message from the `$app/state` module.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/10-routing.md#_snippet_4

LANGUAGE: svelte
CODE:
```
<script>
	import { page } from '$app/state';
</script>

<h1>{page.status}: {page.error.message}</h1>
```

----------------------------------------

TITLE: Accessing SvelteKit Layout Data in Child Pages
DESCRIPTION: This Svelte component snippet shows how to access data loaded by a parent `+layout.js` file within a child `+page.svelte` component. The data is destructured from the `$props()` object, allowing child pages to utilize shared layout information.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/10-routing.md#_snippet_10

LANGUAGE: svelte
CODE:
```
<!- file: src/routes/settings/profile/+page.svelte -->
<script>
	/** @type {import('./$types').PageProps} */
	let { data } = $props();

	console.log(data.sections); // [{ slug: 'profile', title: 'Profile' }, ...]
</script>
```

----------------------------------------

TITLE: SvelteKit Page Submitting Data to API Endpoint
DESCRIPTION: This Svelte component demonstrates how a client-side page can send data to a SvelteKit API endpoint using a `POST` request. It captures two numbers from input fields, sends them as JSON to `/api/add`, and displays the calculated sum received from the server.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/10-routing.md#_snippet_12

LANGUAGE: svelte
CODE:
```
<!- file: src/routes/add/+page.svelte -->
<script>
	let a = 0;
	let b = 0;
	let total = 0;

	async function add() {
		const response = await fetch('/api/add', {
			method: 'POST',
			body: JSON.stringify({ a, b }),
			headers: {
				'content-type': 'application/json'
			}
		});

		total = await response.json();
	}
</script>

<input type="number" bind:value={a}> +
<input type="number" bind:value={b}> =
{total}

<button onclick={add}>Calculate</button>
```

----------------------------------------

TITLE: Example Pages Consuming the Root Layout
DESCRIPTION: Provides examples of simple `+page.svelte` files for different routes (`/`, `/about`, `/settings`), demonstrating how their content is rendered within the context of the root `+layout.svelte`.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/10-routing.md#_snippet_7

LANGUAGE: html
CODE:
```
<h1>Home</h1>
```

LANGUAGE: html
CODE:
```
<h1>About</h1>
```

LANGUAGE: html
CODE:
```
<h1>Settings</h1>
```

----------------------------------------

TITLE: Streaming Data from Server Load Function in SvelteKit
DESCRIPTION: This JavaScript snippet demonstrates how to stream data from a SvelteKit server `load` function. It returns a promise for `comments` directly, allowing the page to start rendering before comments are resolved, while `post` is awaited to ensure its data is available immediately. This pattern is useful for displaying essential content quickly and loading non-essential data asynchronously.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_23

LANGUAGE: js
CODE:
```
/// file: src/routes/blog/[slug]/+page.server.js
// @filename: ambient.d.ts
declare global {
	const loadPost: (slug: string) => Promise<{ title: string, content: string }>;
	const loadComments: (slug: string) => Promise<{ content: string }>;
}

export {};

// @filename: index.js
/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	return {
		// make sure the `await` happens at the end, otherwise we
		// can't start loading comments until we've loaded the post
		comments: loadComments(params.slug),
		post: await loadPost(params.slug)
	};
}
```

----------------------------------------

TITLE: Loading Server-Side Layout Data with `+layout.server.js`
DESCRIPTION: This `load` function, placed in `+layout.server.js`, fetches data for a SvelteKit layout component, running only on the server. It retrieves a list of post summaries from a database, making this data available to the layout itself and all its child components, including nested layouts and pages.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/20-load.md#_snippet_4

LANGUAGE: JavaScript
CODE:
```
/// file: src/routes/blog/[slug]/+layout.server.js
// @filename: ambient.d.ts
declare module '$lib/server/database' {
	export function getPostSummaries(): Promise<Array<{ title: string, slug: string }>>
}

// @filename: index.js
// ---cut---
import * as db from '$lib/server/database';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	return {
		posts: await db.getPostSummaries()
	};
}
```

----------------------------------------

TITLE: Capturing and Restoring Form State with SvelteKit Snapshots
DESCRIPTION: This Svelte component demonstrates how to implement the `snapshot` feature in SvelteKit to preserve the value of a textarea across page navigations. The `capture` method saves the current `comment` state, and the `restore` method re-applies the saved value when navigating back to the page. The data must be JSON serializable for persistence.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/30-advanced/65-snapshots.md#_snippet_0

LANGUAGE: Svelte
CODE:
```
<script>
	let comment = $state('');

	/** @type {import('./$types').Snapshot<string>} */
	export const snapshot = {
		capture: () => comment,
		restore: (value) => comment = value
	};
</script>

<form method="POST">
	<label for="comment">Comment</label>
	<textarea id="comment" bind:value={comment} />
	<button>Post comment</button>
</form>
```

----------------------------------------

TITLE: Configuring Apache .htaccess for SvelteKit SPA Routing (Apache)
DESCRIPTION: This Apache `.htaccess` configuration uses `mod_rewrite` to route all requests that do not correspond to existing files or directories to a specified fallback HTML page (e.g., `200.html`). This is crucial for enabling client-side routing in a SvelteKit SPA deployed on an Apache web server, ensuring that all deep links are handled correctly.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/25-build-and-deploy/55-single-page-apps.md#_snippet_2

LANGUAGE: Apache
CODE:
```
<IfModule mod_rewrite.c>
	RewriteEngine On
	RewriteBase /
	RewriteRule ^200\.html$ - [L]
	RewriteCond %{REQUEST_FILENAME} !-f
	RewriteCond %{REQUEST_FILENAME} !-d
	RewriteRule . /200.html [L]
</IfModule>
```

----------------------------------------

TITLE: Configure SvelteKit Node Adapter
DESCRIPTION: This snippet shows how to configure SvelteKit to use the `@sveltejs/adapter-node` in `svelte.config.js` to generate a standalone Node server. It imports the adapter and sets it in the `kit.adapter` property.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/25-build-and-deploy/40-adapter-node.md#_snippet_0

LANGUAGE: js
CODE:
```
// @errors: 2307
/// file: svelte.config.js
import adapter from '@sveltejs/adapter-node';

export default {
	kit: {
		adapter: adapter()
	}
};
```

----------------------------------------

TITLE: Configuring SvelteKit for Static Site Generation with `adapter-static`
DESCRIPTION: This configuration snippet for `svelte.config.js` demonstrates how to integrate `@sveltejs/adapter-static` into a SvelteKit project. It sets up the adapter with default options for output directories (`pages`, `assets`), defines a `fallback` page, enables `precompress` for Brotli/Gzip, and enforces `strict` prerendering checks, ensuring all content is accessible.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/25-build-and-deploy/50-adapter-static.md#_snippet_0

LANGUAGE: JavaScript
CODE:
```
import adapter from '@sveltejs/adapter-static';

export default {
	kit: {
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		})
	}
};
```

----------------------------------------

TITLE: Minimal `adapter-static` Configuration for Zero-Config Platforms
DESCRIPTION: This `svelte.config.js` example shows a simplified configuration for `@sveltejs/adapter-static` when deploying to platforms with built-in zero-config support, such as Vercel. By omitting specific adapter options, the platform can automatically apply optimal settings for static site generation, streamlining deployment.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/25-build-and-deploy/50-adapter-static.md#_snippet_2

LANGUAGE: JavaScript
CODE:
```
export default {
	kit: {
		adapter: adapter(---{...}---)
	}
};
```

----------------------------------------

TITLE: Build SvelteKit Browser Extensions with Static Adapters
DESCRIPTION: Explore methods for developing browser extensions using SvelteKit, leveraging either `adapter-static` or specialized community adapters. This approach allows you to build powerful and interactive browser extensions with the efficiency and reactivity of SvelteKit.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/10-getting-started/25-project-types.md#_snippet_12

LANGUAGE: JavaScript
CODE:
```
// svelte.config.js
import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter(),
    // Further configuration for browser extension manifest
  }
};
```

----------------------------------------

TITLE: Create SvelteKit Desktop Applications with Tauri, Wails, or Electron
DESCRIPTION: Discover how to convert your SvelteKit SPA into a cross-platform desktop application using popular frameworks like Tauri, Wails, or Electron. These tools allow you to leverage web technologies for desktop development, providing access to native system functionalities.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/10-getting-started/25-project-types.md#_snippet_11

LANGUAGE: Bash
CODE:
```
// Example: Project setup for a desktop app
// Using Tauri:
// npx create-tauri-app
// npm install -D @tauri-apps/cli

// Using Electron:
// npm install electron --save-dev
// Add a 'main' script in package.json
```

----------------------------------------

TITLE: Create SvelteKit Libraries with @sveltejs/package
DESCRIPTION: Discover how to package Svelte components and modules into reusable libraries for other Svelte applications. Utilize the `@sveltejs/package` add-on and the `sv create` CLI tool to streamline the library creation process, enabling easy sharing and consumption of your SvelteKit code.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/10-getting-started/25-project-types.md#_snippet_8

LANGUAGE: Bash
CODE:
```
sv create my-library --template library
```

----------------------------------------

TITLE: Build Offline SvelteKit Applications with Service Workers
DESCRIPTION: Understand SvelteKit's comprehensive support for service workers, enabling the development of robust offline-first applications and Progressive Web Apps (PWAs). Service workers allow your application to cache assets and data, providing a seamless user experience even without an internet connection.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/10-getting-started/25-project-types.md#_snippet_9

LANGUAGE: JavaScript
CODE:
```
// src/service-worker.js

// Example: Basic service worker registration and caching strategy
self.addEventListener('install', (event) => {
  console.log('Service worker installed');
  event.waitUntil(
    caches.open('my-app-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/build/client/app.js',
        '/build/client/index.css'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

----------------------------------------

TITLE: Optimize SvelteKit for Embedded Devices
DESCRIPTION: Understand how SvelteKit's efficient rendering makes it suitable for deployment on low-power embedded devices like microcontrollers and smart TVs. To minimize concurrent connections, which can be a limitation on such devices, consider configuring `bundleStrategy: 'single'` in your SvelteKit output.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/10-getting-started/25-project-types.md#_snippet_13

LANGUAGE: JavaScript
CODE:
```
// svelte.config.js
export default {
  kit: {
    output: {
      bundleStrategy: 'single' // Reduces concurrent requests
    }
  }
};
```

----------------------------------------

TITLE: Enabling Global Prerendering in SvelteKit Layouts
DESCRIPTION: This JavaScript snippet, placed in `src/routes/+layout.js`, sets the `prerender` option to `true`. This instructs SvelteKit to statically prerender all pages associated with this layout, making them part of the static output. It's crucial for SSG and can be set to `false` if using a Single Page Application (SPA) fallback mode.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/25-build-and-deploy/50-adapter-static.md#_snippet_1

LANGUAGE: JavaScript
CODE:
```
export const prerender = true;
```

----------------------------------------

TITLE: Disable Client-Side Rendering (CSR) in SvelteKit
DESCRIPTION: Demonstrates how to disable client-side rendering for a SvelteKit page by exporting `csr = false` from `+page.js`. This prevents JavaScript from being shipped to the client for that page, suitable for static content.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/40-page-options.md#_snippet_7

LANGUAGE: js
CODE:
```
export const csr = false;
```

----------------------------------------

TITLE: Define Prerender Entries for Dynamic SvelteKit Routes
DESCRIPTION: This JavaScript example demonstrates how to use the `entries` function within a `+page.server.js` file to explicitly list dynamic route parameters for prerendering. This is crucial when SvelteKit's crawler cannot automatically discover all necessary dynamic routes, ensuring they are included in the prerendered output.
SOURCE: https://github.com/sveltejs/kit/blob/main/documentation/docs/20-core-concepts/40-page-options.md#_snippet_5

LANGUAGE: javascript
CODE:
```
/// file: src/routes/blog/[slug]/+page.server.js
/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return [
		{ slug: 'hello-world' },
		{ slug: 'another-blog-post' }
	];
}

export const prerender = true;
```