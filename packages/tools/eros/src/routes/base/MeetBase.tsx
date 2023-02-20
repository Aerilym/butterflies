import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../components/authentication/AuthProvider';
import InternalProfile from '../../components/profile/InternalProfile';

interface ScheduledMeeting {
  name: string;
  start: Date;
  end: Date;
}

const schedule = [
  {
    name: 'General-Meeting',
    start: new Date('2023-02-13T10:00:00.000Z'),
    end: new Date('2023-02-13T11:00:00.000Z'),
  },
];

export default function MeetBase() {
  const [meetingID, setMeetingID] = useState<string>('');
  const { user } = useAuth();
  return (
    <div className="container">
      <div className="content">
        <div>
          <h2>Scheduled Meetings</h2>
          {schedule.map((meeting: ScheduledMeeting) => (
            <button
              key={meeting.name}
              onClick={() => {
                window.location.href = `/meet/${meeting.name}`;
              }}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '1rem',
                marginBottom: '1rem',
              }}
            >
              <h2>{meeting.name}</h2>
              <h3>Start: {formatDistanceToNow(meeting.start)}</h3>
            </button>
          ))}
        </div>
        <div>
          <h2>Join Meeting</h2>
          <input
            type="text"
            placeholder="Meeting ID"
            value={meetingID}
            onChange={(e) => setMeetingID(e.target.value)}
          />
          <button
            onClick={() => {
              window.location.href = `/meet/${meetingID}`;
            }}
          >
            Join
          </button>
        </div>
        <div>
          <h2>Logged In User</h2>
          {user ? <InternalProfile user={user} /> : <h1>Not logged in</h1>}
        </div>
      </div>
    </div>
  );
}
