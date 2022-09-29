/**
 * Enables use of worker environment variables outside of a cloudflare worker deployment.
 * Define the environment variables in the wrangler.toml, they can then be referenced globally
 * by defining them here as VARIABLE_NAME: string. The environment variables are stored and
 * retrieved as strings but can be converted to other types as needed when adding them to the config.
 */
declare global {
  const SB_URL: string;
  const SB_KEY: string;
}
export = globalThis;
