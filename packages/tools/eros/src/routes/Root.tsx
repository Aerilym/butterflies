import { useState } from 'react';
import '../App.css';
import '../navbar.css';
import 'react-tooltip/dist/react-tooltip.css';
import '../styles/tooltips.css';
import { Outlet, Link, useLocation } from 'react-router-dom';

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
            <li>
              <Link
                to="/config"
                className={useLocation().pathname.startsWith('/config') ? 'route-active' : ''}
              >
                Config
              </Link>
            </li>
            <li>
              <Link
                to="/users"
                className={useLocation().pathname.startsWith('/users') ? 'route-active' : ''}
              >
                Users
              </Link>
            </li>
            <li>
              <Link
                to="/godview"
                className={useLocation().pathname.startsWith('/godview') ? 'route-active' : ''}
              >
                God View
              </Link>
            </li>
            <li>
              <Link
                to="/analytics"
                className={useLocation().pathname.startsWith('/analytics') ? 'route-active' : ''}
              >
                Analytics
              </Link>
            </li>
            <li>
              <Link
                to="/internal"
                className={useLocation().pathname.startsWith('/internal') ? 'route-active' : ''}
              >
                Internal
              </Link>
            </li>
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
