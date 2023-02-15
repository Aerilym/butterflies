import { Outlet, Link, useLocation } from 'react-router-dom';

export const usersLinks: { label: string; target: string; description: string }[] = [
  {
    label: 'User List',
    target: 'list',
    description: 'View all users',
  },
  {
    label: 'Match List',
    target: 'matches',
    description: 'View all matches',
  },
  {
    label: 'Profile List',
    target: 'profiles',
    description: 'View all profiles',
  },
  {
    label: 'Preference List',
    target: 'preferences',
    description: 'View all preferences',
  },
  {
    label: 'Custom List',
    target: 'custom',
    description: 'View a table you specify',
  },
].sort((a, b) => a.label.localeCompare(b.label));

export default function Users() {
  return (
    <div className="top-container">
      <Outlet />
    </div>
  );
}
