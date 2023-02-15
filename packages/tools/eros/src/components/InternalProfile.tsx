import { capitaliseWords } from '../helper';
import { UserData } from './authentication/AuthProvider';

export default function InternalProfile({ user }: { user: UserData }) {
  return (
    <div className="profile-container">
      <div className="profile-body">
        <div className="profile-image">
          <img src={user.avatar_url} alt="profile" />
        </div>
        <div className="profile-info">
          <h3>Preferred Name: {capitaliseWords(user.preferred_name)}</h3>
          <h3>Full Name: {capitaliseWords(user.first_name + ' ' + user.last_name)}</h3>
          <h3>{user.email}</h3>
        </div>
      </div>
    </div>
  );
}
