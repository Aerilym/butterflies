export const jsonResponse = (data: any, status = 200): Response => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export type ClickUpZulipSpaceMap = { to: string; topic: string };

export async function getMappedZulipStream(
  list: string,
  clickupZulipSpaceMapKV: KVNamespace,
): Promise<ClickUpZulipSpaceMap | undefined> {
  const clickupZulipSpaceMap = (await clickupZulipSpaceMapKV.get(
    list,
    'json',
  )) as ClickUpZulipSpaceMap;

  return clickupZulipSpaceMap;
}

export async function getPersonalEmail(
  email: string,
  ButterfliesEmailNamespace: KVNamespace,
): Promise<string | undefined> {
  const personalEmail = await ButterfliesEmailNamespace.get(email, 'text');

  return personalEmail ?? undefined;
}
