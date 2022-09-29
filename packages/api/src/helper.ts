export async function getPath(url: string): Promise<string> {
  const { pathname } = new URL(url);
  return pathname;
}
