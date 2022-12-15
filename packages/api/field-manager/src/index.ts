/**
 * The bindings assigned to the Worker.
 * @see {@link https://developers.cloudflare.com/workers/runtime-apis/kv/#referencing-kv-from-workers}
 * @param NAMESPACE_NAME The KV namespace.
 * @example
 * const url = await env.NAMESPACE_NAME.get('URL');
 */
export interface Env {
  NAMESPACE_DATING_FIELDS: KVNamespace;
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
  if (request.method === 'OPTIONS') return handleOptions(request);

  switch (request.method) {
    case 'GET':
      return await handleList(env.NAMESPACE_DATING_FIELDS);

    case 'POST':
    case 'PUT':
      return await handleAdd(env.NAMESPACE_DATING_FIELDS, request);

    default:
      return new Response('Endpoint or method not found', {
        status: 404,
      });
  }
}

/**
 * Handle incoming scheduled cron events.
 * @param {ScheduledPayload} payload The payload containing the controller, env and ctx.
 */
async function handleScheduled({ controller, env, ctx }: ScheduledPayload): Promise<void> {
  return;
}

/**
 * Get all the fields. The values are stores as metadata if they are under 1024 bytes, otherwise
 * they are stored as a value. Metadata is retrieved with the list command so only those keys
 * that don't have an associated metadata, have to make an additional call for their value.
 * @param namespace The KV Namespace.
 */
async function handleList(namespace: KVNamespace): Promise<Response> {
  const value: KVNamespaceListResult<{ value: string | null }> = await namespace.list();
  const valueRequests: { key: string; index: number }[] = [];
  const fields = value.keys.map((key, index) => {
    if (!key.metadata || !key.metadata.value) valueRequests.push({ key: key.name, index });
    return {
      name: key.name,
      value: key.metadata?.value,
    };
  });
  if (valueRequests.length > 0) {
    const values = await Promise.all(
      valueRequests.map(async (pair) => {
        return namespace.get(pair.key);
      }),
    );
    valueRequests.forEach((item) => {
      fields[item.index].value = values[item.index];
    });
  }

  const finalResults: OnboardingStepItem[] = fields.map((field) => {
    return {
      ...JSON.parse(field.value ?? '{}'),
    };
  });

  return jsonResponse(finalResults, 200);
}

async function handleAdd(namespace: KVNamespace, request: Request) {
  const fieldItem: OnboardingStepItem = await request.json();

  const key = fieldItem.field;

  const value = JSON.stringify(fieldItem);

  byteSize(value) > 1024
    ? await namespace.put(key, value)
    : await namespace.put(key, '', {
        metadata: { value: value },
      });
  return jsonResponse('fields added', 201);
}

const byteSize = (str: string) => new Blob([str]).size;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const handleOptions = (request: Request) => {
  if (
    request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null &&
    request.headers.get('Access-Control-Request-Headers') !== null
  ) {
    // Handle CORS pre-flight request.
    return new Response(null, {
      headers: corsHeaders,
    });
  } else {
    // Handle standard OPTIONS request.
    return new Response(null, {
      headers: {
        Allow: 'GET, POST, HEAD, OPTIONS',
      },
    });
  }
};

const jsonResponse = (data: any, code: number) => {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
    status: code,
  });
};
