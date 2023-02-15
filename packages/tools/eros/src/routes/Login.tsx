import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Authentication from '../components/authentication/Authentication';
import { useAuth } from '../components/authentication/AuthProvider';

export default function Login() {
  const { userID } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (userID) {
      navigate('/');
    }
  }, [userID]);
  return (
    <div className="top-container">
      <div
        className="content"
        style={{
          margin: '10%',
        }}
      >
        <div>
          <h1>Eros</h1>
          <h2>Butterflies</h2>
          <img src="/logo.svg" alt="logo" width={200} height={200} />
        </div>
        <div>
          <h1>Login</h1>
          <Authentication />
        </div>
      </div>
    </div>
  );
}
