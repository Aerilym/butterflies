import { handleTaskEvent } from './clickup-webhook/tasks';
import { jsonResponse } from './helpers';
import type { ClickUpWebhookBody } from './types/clickup';

export async function router(
  pathArray: Array<string>,
  { request, env, ctx }: FetchPayload,
): Promise<Response> {
  const rootPath = pathArray.shift();
  const servicePath = pathArray.shift();

  if (!rootPath || !servicePath || rootPath !== 'api' || servicePath !== 'clickup') {
    return jsonResponse({ error: 'Invalid path' }, 404);
  }

  switch (pathArray.shift()) {
    case 'clickup-origin':
      return await handleClickupOrigin(pathArray, { request, env, ctx });

    case 'zulip-origin':
      return await handleZulipOrigin(pathArray, { request, env, ctx });

    case 'eros-origin':
      return await handleErosOrigin(pathArray, { request, env, ctx });

    default:
      return jsonResponse({ error: 'Invalid path' }, 404);
  }
}

export async function handleClickupOrigin(
  pathArray: Array<string>,
  { request, env, ctx }: FetchPayload,
): Promise<Response> {
  const body = (await request.json()) as ClickUpWebhookBody;

  switch (body.event.substring(0, 4)) {
    case 'task':
      return await handleTaskEvent(body.event.substring(4), body, { request, env, ctx });

    default:
      return jsonResponse({ error: 'Task not supported yet' }, 404);
  }
}

export async function handleZulipOrigin(
  pathArray: Array<string>,
  { request, env, ctx }: FetchPayload,
): Promise<Response> {
  return new Response('Hello World');
}

export async function handleErosOrigin(
  pathArray: Array<string>,
  { request, env, ctx }: FetchPayload,
): Promise<Response> {
  return new Response('Hello World');
}
