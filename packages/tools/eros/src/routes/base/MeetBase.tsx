import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../components/authentication/AuthProvider';
import InternalProfile from '../../components/profile/InternalProfile';

interface ScheduledMeeting {
  name: string;
  start: Date;
  end: Date;
  clickup: string;
}

const schedule = [
  {
    name: 'Design',
    start: new Date('2023-03-06T09:00:00.000Z'),
    end: new Date('2023-02-06T10:00:00.000Z'),
    clickup: 'https://app.clickup.com/t/860q2d03v',
  },
  {
    name: 'Engineering',
    start: new Date('2023-03-07T08:00:00.000Z'),
    end: new Date('2023-02-07T09:00:00.000Z'),
    clickup: 'https://app.clickup.com/t/860q2vugu',
  },
  {
    name: 'Admin',
    start: new Date('2023-03-07T09:00:00.000Z'),
    end: new Date('2023-02-07T10:00:00.000Z'),
    clickup: 'https://app.clickup.com/t/',
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
            <div
              key={meeting.name}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '1rem',
                border: '1px solid grey',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                backgroundColor: '#333',
              }}
            >
              <h3>{meeting.name}</h3> <span>{formatDistanceToNow(meeting.start)}</span>
              <h3>{`${meeting.start.toLocaleString()}`}</h3>
              <button
                onClick={() => {
                  window.location.href = `/meet/${meeting.name}`;
                }}
              >
                Join Meeting
              </button>
              <button
                onClick={() => {
                  window.open(meeting.clickup, '_blank');
                }}
              >
                ClickUp
              </button>
            </div>
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
