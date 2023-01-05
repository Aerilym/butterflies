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
].sort((a, b) => a.label.localeCompare(b.label));

export default function Users() {
  return (
    <div className="top-container">
      <nav className="navigation side-nav">
        <div className="navigation-menu expanded">
          <ul>
            {usersLinks.map((link) => (
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
