import { Outlet } from 'react-router-dom';

import { useAuth } from '../components/authentication/AuthProvider';
import InternalProfile from '../components/profile/InternalProfile';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="top-container">
      {user ? <InternalProfile user={user} /> : <h1>Not logged in</h1>}
      <Outlet />
    </div>
  );
}
