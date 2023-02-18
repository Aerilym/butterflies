import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from './AuthProvider';

export const ProtectedRoute = ({ children }: { children: any }) => {
  const { userID } = useAuth();

  const location = useLocation();

  if (!userID) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};
