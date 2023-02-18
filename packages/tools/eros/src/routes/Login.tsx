import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
          <img
            src="/images/icons/butterflies.svg"
            alt="logo"
            width={256}
            height={256}
            style={{
              margin: '32px',
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '64px' }}>EROS</span>
              <br></br>
              <br></br>
              <span style={{ fontSize: '48px' }}>by Butterflies</span>
            </div>
          </div>
        </div>
        <div>
          <h1>Login</h1>
          <Authentication />
        </div>
      </div>
    </div>
  );
}
