interface CloudflarePayload {
  env?: Env;
  ctx?: ExecutionContext;
}

interface FetchPayload extends CloudflarePayload {
  request: Request;
}

interface ScheduledPayload extends CloudflarePayload {
  controller: ScheduledController;
}
