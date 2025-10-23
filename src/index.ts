export default {
	/**
	 * This is the standard fetch handler for a Cloudflare Worker
	 *
	 * @param request - The request submitted to the Worker from the client
	 * @param env - The interface to reference bindings declared in wrangler.jsonc
	 * @param ctx - The execution context of the Worker
	 * @returns The response to be sent back to the client
	 */
	async fetch(request, env, ctx): Promise<Response> {
		return new Response("<h1>Under Construction</h1>", { status: 200, headers: { "Content-Type": "text/html" } });
	},
} satisfies ExportedHandler<Env>;
