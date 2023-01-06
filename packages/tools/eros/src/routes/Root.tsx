import { useState } from 'react';
import '../App.css';
import '../navbar.css';
import 'react-tooltip/dist/react-tooltip.css';
import '../styles/tooltips.css';
import { Outlet, Link, useLocation } from 'react-router-dom';

const rootNavLinks: { label: string; target: string; description: string }[] = [
  {
    target: '/config',
    label: 'Config',
    description: 'Configure all aspects of the the app settings, preferences, and environment',
  },
  {
    target: '/users',
    label: 'Users',
    description: 'Manage all users and everything about them.',
  },
  {
    target: '/godview',
    label: 'God View',
    description: 'See all...',
  },
  /* {
    target: '/analytics',
    label: 'Analytics',
    description: 'View the app analytics.',
  }, */
  {
    target: '/internal',
    label: 'Internal',
    description: 'Manage the internal tools and settings for everyone working on the app.',
  },
].sort((a, b) => a.label.localeCompare(b.label));

function Root() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  return (
    <div className="App">
      <nav className="navigation">
        <Link className="brand-name" to="/">
          Eros
        </Link>

        <button
          className="hamburger"
          onClick={() => {
            setIsNavExpanded(!isNavExpanded);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="white"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className={isNavExpanded ? 'navigation-menu expanded' : 'navigation-menu'}>
          <ul>
            {rootNavLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.target}
                  className={useLocation().pathname.startsWith(link.target) ? 'route-active' : ''}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link to="/profile">
          <div className="profile-circle"></div>
        </Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default Root;
