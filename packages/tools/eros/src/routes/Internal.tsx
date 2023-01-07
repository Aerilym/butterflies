import { Outlet, Link, useLocation } from 'react-router-dom';

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
      <nav className="navigation side-nav">
        <div className="navigation-menu expanded">
          <ul>
            {internalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.target}
                  className={
                    useLocation().pathname.split('/')[2] === link.target ? 'route-active' : ''
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
