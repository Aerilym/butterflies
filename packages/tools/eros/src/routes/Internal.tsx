import { Outlet } from 'react-router-dom';

export const internalLinks: { label: string; target: string; description: string }[] = [
  {
    label: 'Dashboard',
    target: 'dashboard',
    description: 'Edit the internal dashboard',
  },
  /* {
    label: 'Authentication',
    target: 'authentication',
    description: 'Configure the internal authentication settings',
  },
  {
    label: 'Users',
    target: 'users',
    description: 'Manage the internal users',
  }, */
].sort((a, b) => a.label.localeCompare(b.label));

export default function Internal() {
  return (
    <div className="top-container">
      <Outlet />
    </div>
  );
}
