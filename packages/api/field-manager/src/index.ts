import { OnboardingStepItem } from '../../../types/fields';

/**
 * The bindings assigned to the Worker.
 * @see {@link https://developers.cloudflare.com/workers/runtime-apis/kv/#referencing-kv-from-workers}
 * @param NAMESPACE_NAME The KV namespace.
 * @example
 * const url = await env.NAMESPACE_NAME.get('URL');
 */
export interface Env {
  NAMESPACE_DATING_FIELDS: KVNamespace;
  NAMESPACE_DATING_FIELD_OPTIONS: KVNamespace;
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

  const url = new URL(request.url);
  const path = url.pathname.split('/').filter((p) => p);

  const { searchParams } = new URL(request.url);

  switch (request.method) {
    case 'GET':
      switch (path[0]) {
        case 'options':
          if (searchParams.get('key')) {
            return await handleGetOption(env.NAMESPACE_DATING_FIELD_OPTIONS, request);
          }
          return await handleListOptions(env.NAMESPACE_DATING_FIELD_OPTIONS);
      }

      return await handleList(env.NAMESPACE_DATING_FIELDS);

    case 'POST':
    case 'PUT':
      switch (path[0]) {
        case 'options':
          return await handleSetOption(env.NAMESPACE_DATING_FIELD_OPTIONS, request);
      }

      return await handleAdd(env.NAMESPACE_DATING_FIELDS, request);

    case 'DELETE':
      switch (path[0]) {
        case 'options':
          return await handleDelete(env.NAMESPACE_DATING_FIELD_OPTIONS, request);
      }

      return await handleDelete(env.NAMESPACE_DATING_FIELDS, request);

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
  return jsonResponse('field added', 201);
}

async function handleDelete(namespace: KVNamespace, request: Request) {
  const { key } = (await request.json()) as { key: string };

  await namespace.delete(key);
  return jsonResponse('field deleted', 200);
}

const byteSize = (str: string) => new Blob([str]).size;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, HEAD, OPTIONS',
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
        Allow: 'GET, POST, PUT, DELETE, HEAD, OPTIONS',
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

async function handleListOptions(namespace: KVNamespace): Promise<Response> {
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

async function handleGetOption(namespace: KVNamespace, request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) return jsonResponse('key is required', 400);

  const res: KVNamespaceGetWithMetadataResult<string, { value: string }> =
    await namespace.getWithMetadata(key);

  const payload = {
    key,
    value: res.metadata?.value ?? res.value,
  };

  return jsonResponse(payload, 200);
}

async function handleSetOption(namespace: KVNamespace, request: Request) {
  const { key, value } = (await request.json()) as { key: string; value: string };
  await namespace.put(key, '', {
    metadata: { value: value },
  });
  return jsonResponse('option added', 201);
}
