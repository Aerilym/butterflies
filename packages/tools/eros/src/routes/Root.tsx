import { useEffect, useState } from 'react';
import '../App.css';
//import '../navbar.css';
import '../navigation.css';
import 'react-tooltip/dist/react-tooltip.css';
import '../styles/tooltips.css';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth, UserData } from '../components/authentication/AuthProvider';
import { capitaliseWords } from '../helper';
import { navMap, NavMap } from '../main';

export const rootNavLinks: { label: string; target: string; description: string }[] = [
  {
    target: '/config',
    label: 'App Config',
    description: 'Configure all aspects of the the app settings, preferences, and environment',
  },
  {
    target: '/users',
    label: 'User Management',
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
    label: 'Internal Settings',
    description: 'Manage the internal tools and settings for everyone working on the app.',
  },
  {
    target: '/meet',
    label: 'Meeting Platform',
    description: 'Meet with other users in a video chat room.',
  },
].sort((a, b) => a.label.localeCompare(b.label));

const lockedNavbarPaths = rootNavLinks.map((link) => link.target).concat(['/', '/profile']);

function buildNavigationMap(map: NavMap, depth: number = 0, parentPath?: string) {
  return Object.keys(map).map((key) => {
    const page = map[key];

    const path = parentPath ? `/${parentPath}/${page.path}` : page.path;

    if (page.subpages) {
      return (
        <div
          onPointerEnter={() => {
            const dropdown = document.querySelector(`#${key}-dropdown`) as HTMLElement;
            if (depth > 0) dropdown.style.maxWidth = '200px';
            else {
              dropdown.style.maxHeight = '200px';
            }
          }}
          onPointerLeave={() => {
            const dropdown = document.querySelector(`#${key}-dropdown`) as HTMLElement;
            if (depth > 0) dropdown.style.maxWidth = '0px';
            else {
              dropdown.style.maxHeight = '0px';
            }
          }}
        >
          {path ? (
            <Link className={parentPath ? 'navbar-dropdown-item' : 'navbar-item'} to={path}>
              {page.name}
            </Link>
          ) : (
            <a className={parentPath ? 'navbar-dropdown-item' : 'navbar-item'}>{page.name}</a>
          )}
          <div
            className={depth > 0 ? 'navbar-dropdown-horizontal' : 'navbar-dropdown'}
            id={`${key}-dropdown`}
          >
            {buildNavigationMap(page.subpages, depth + 1, page.path)}
          </div>
        </div>
      );
    }

    return path ? (
      <Link className={parentPath ? 'navbar-dropdown-item' : 'navbar-item'} to={path}>
        {page.name}
      </Link>
    ) : (
      <a className={parentPath ? 'navbar-dropdown-item' : 'navbar-item'}>{page.name}</a>
    );
  });
}

function Navigation({
  navMap,
  user,
  showNavBar,
  lockNavBar,
}: {
  navMap: NavMap;
  user?: UserData | null;
  showNavBar: boolean;
  lockNavBar: boolean;
}) {
  return (
    <div className={'navbar' + (showNavBar || lockNavBar ? ' navbar-expanded' : '')}>
      <Link className="brand-name" to="/">
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <img
            src="/logo.svg"
            alt="logo"
            width={50}
            height={50}
            style={{
              marginRight: '6px',
            }}
          />
          <div>
            <span style={{ fontSize: 'large' }}>EROS</span>
            <br></br>
            <span style={{ fontSize: 'small' }}>by Butterflies</span>
          </div>
        </div>
      </Link>
      {buildNavigationMap(navMap)}

      <div
        onPointerEnter={() => {
          const dropdown = document.querySelector(`#profile-dropdown`) as HTMLElement;
          dropdown.style.maxHeight = '200px';
        }}
        onPointerLeave={() => {
          const dropdown = document.querySelector(`#profile-dropdown`) as HTMLElement;
          dropdown.style.maxHeight = '0px';
        }}
      >
        <Link className={'navbar-dropdown-item profile-circle'} to="/profile">
          {user?.initials}
        </Link>
        <div className="navbar-dropdown" id={`profile-dropdown`}>
          <Link className={'navbar-dropdown-item'} to="/profile">
            {capitaliseWords(user?.first_name + ' ' + user?.last_name)}
          </Link>
          <Link className={'navbar-dropdown-item'} to="/logout">
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
}

function Root() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const [lockNavbar, setLockNavbar] = useState(false);

  const { user } = useAuth();
  const { pathname } = useLocation();

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      setShowNavbar(event.clientY < 100);
    }

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    console.log('pathname', pathname);
    if (lockedNavbarPaths.includes(pathname)) {
      setLockNavbar(true);
    } else {
      setLockNavbar(false);
    }
  }, [pathname]);

  return (
    <div className="App">
      {/* <nav
        className="navigation"
        style={{
          top: showNavbar || lockNavbar ? '0' : '-100%',
          transition: 'top 0.5s ease-in-out',
        }}
      >
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
                  className={pathname.startsWith(link.target) ? 'route-active' : ''}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="profile-circle"
          onClick={() => {
            setIsProfileExpanded(!isProfileExpanded);
          }}
        >
          {user?.initials}
        </div>
        <div className={isProfileExpanded ? 'profile-menu expanded' : 'profile-menu'}>
          <ul>
            <li>{capitaliseWords(user?.first_name + ' ' + user?.last_name)}</li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
          </ul>
        </div>
      </nav> */}
      <Navigation navMap={navMap} user={user} showNavBar={showNavbar} lockNavBar={lockNavbar} />
      <Outlet />
    </div>
  );
}

export default Root;
