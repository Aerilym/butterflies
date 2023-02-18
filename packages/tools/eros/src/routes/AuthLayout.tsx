import { Suspense } from 'react';
import { useLoaderData, useOutlet, Await } from 'react-router-dom';

import { AuthProvider } from '../components/authentication/AuthProvider';

type LoaderData = {
  userPromise: Promise<any>;
};

export const AuthLayout = () => {
  const outlet = useOutlet();
  const { userPromise } = useLoaderData() as LoaderData;
  return (
    <Suspense>
      <Await
        resolve={userPromise}
        errorElement={<div>Something went wrong!</div>}
        children={(user) => <AuthProvider userData={user}>{outlet}</AuthProvider>}
      />
    </Suspense>
  );
};
