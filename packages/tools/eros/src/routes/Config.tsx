import { Outlet, Link, useLocation } from 'react-router-dom';

export const configLinks: { label: string; target: string; description: string }[] = [
  {
    label: 'Onboarding',
    target: 'onboarding',
    description: 'Configure the onboarding experience for the app',
  },
  {
    label: 'Authentication',
    target: 'authentication',
    description: 'Configure the authentication settings for the app',
  },
  {
    label: 'Users',
    target: 'users',
    description: 'Configure the user fields and settings for the app',
  },
  {
    label: 'KV Override',
    target: 'kvoverride',
    description: 'Override KV pairs in the KV store',
  },
].sort((a, b) => a.label.localeCompare(b.label));

export default function Config() {
  return (
    <div className="top-container">
      <Outlet />
    </div>
  );
}
