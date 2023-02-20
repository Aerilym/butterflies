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
      <Meeting roomName={roomId} user={user} />
    </div>
  );
}
