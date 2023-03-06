import { useParams } from 'react-router-dom';

import { useAuth } from '../../components/authentication/AuthProvider';
import Meeting from '../../components/meet/Meeting';

export default function Room() {
  const { roomId } = useParams();
  const { user } = useAuth();
  if (!roomId) {
    return <div>Invalid Room ID</div>;
  }
  return (
    <div
      style={{
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => {
          window.open('https://app.clickup.com/t/860q2d03v', '_blank');
        }}
        style={{
          padding: '1rem',
          border: 'none',
          borderRadius: '1rem 0 0 0',
          color: 'white',
          cursor: 'pointer',
          position: 'absolute',
          bottom: 0,
          right: 0,
        }}
      >
        <img
          src="/images/icons/clickup.svg"
          style={{
            height: '3rem',
            paddingRight: '0.3rem',
            paddingLeft: '0.3rem',
          }}
        />
      </button>
      <Meeting roomName={roomId} user={user} />
    </div>
  );
}
