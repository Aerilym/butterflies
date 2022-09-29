import { SupabaseClientOptions } from '@supabase/supabase-js';
import { SupabaseAPI } from './api';
import { getPath } from './helper';
import { createClient } from '@supabase/supabase-js';
/**
 * The bindings assigned to the Worker.
 * @see {@link https://developers.cloudflare.com/workers/runtime-apis/kv/#referencing-kv-from-workers}
 * @param NAMESPACE_NAME The KV namespace.
 * @example
 * const url = await env.NAMESPACE_NAME.get('URL');
 */
export interface Env {
  NAMESPACE_NAME: KVNamespace;
}

export default {
  /**
   * The fetch handler is called whenever a client makes a request to the worker endpoint.
   * @see {@link https://developers.cloudflare.com/workers/runtime-apis/fetch-event/#syntax-module-worker}
   * @param request The incoming HTTP request.
   * @param env The bindings assigned to the Worker.
   * @param ctx The context of the Worker.
   * @returns The response outcome to the request.
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return handleFetch({ request, env, ctx });
  },
};

/**
 * Handle incoming HTTP requests.
 * @param {FetchPayload} payload The payload containing the request, env and ctx.
 * @returns The response outcome to the request.
 */
async function handleFetch({ request, env, ctx }: FetchPayload): Promise<Response> {
  const config = {
    supabaseUrl: env.SB_URL,
    supabaseKey: env.SB_KEY,
  };

  const body: AuthBody = await request.json();

  const supabase = createClient(config.supabaseUrl, config.supabaseKey);
  const { user, session, error } = await supabase.auth.signUp({
    email: body.email,
    password: body.password,
  });

  return new Response(JSON.stringify({ user, session, error }));
}
