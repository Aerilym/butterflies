import { router } from './router';

/**
 * The bindings assigned to the Worker.
 * @see {@link https://developers.cloudflare.com/workers/runtime-apis/kv/#referencing-kv-from-workers}
 * @param NAMESPACE_NAME The KV namespace.
 * @example
 * const url = await env.NAMESPACE_NAME.get('URL');
 */
export interface Env {
  CLICKUP_ZULIP_SPACE_MAP: KVNamespace;
  BUTTERFLIES_EMAIL_MAP: KVNamespace;
  CLICKUP_API_KEY: string;
  ZULIP_BOT_EMAIL_CLICKUP: string;
  ZULIP_BOT_API_KEY_CLICKUP: string;
  ZULIP_BOT_EMAIL_EROS: string;
  ZULIP_BOT_API_KEY_EROS: string;
  GOOGLE_CAL_API_KEY: string;
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
  /**
   * The scheduled handler is called whenever a scheduled cron event is triggered.
   * @see {@link https://developers.cloudflare.com/workers/runtime-apis/scheduled-event/#syntax-module-worker}
   * @param controller The scheduled event information.
   * @param env The bindings assigned to the Worker.
   * @param ctx The context of the Worker.
   */
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    return handleScheduled({ controller, env, ctx });
  },
};

/**
 * Handle incoming HTTP requests.
 * @param {FetchPayload} payload The payload containing the request, env and ctx.
 * @returns The response outcome to the request.
 */
async function handleFetch({ request, env, ctx }: FetchPayload): Promise<Response> {
  const path = new URL(request.url).pathname;
  const pathArray = path.split('/').filter((item) => item !== '');
  return await router(pathArray, { request, env, ctx });
}

/**
 * Handle incoming scheduled cron events.
 * @param {ScheduledPayload} payload The payload containing the controller, env and ctx.
 */
async function handleScheduled({ controller, env, ctx }: ScheduledPayload): Promise<void> {
  return;
}
