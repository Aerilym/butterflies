import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { capitaliseWords } from '../helper';
import { NavMap } from '../main';
import '../styles/navbar.css';
import { UserData } from './authentication/AuthProvider';

export type CustomBarPaths = Record<
  string,
  {
    fullPath: string[];
    prefixPath: string[];
  }
>;

interface NavbarProps {
  navMap: NavMap;
  customBarPaths: CustomBarPaths;
  user?: UserData | null;
}

export default function Navbar({ navMap, customBarPaths, user }: NavbarProps) {
  const [showNavbar, setShowNavbar] = useState(true);
  const [docked, setDocked] = useState(false);
  const [showDocked, setShowDocked] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const navbarRef = useRef<HTMLDivElement>(null);

  let location = useLocation();

  React.useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  function shouldLock(path: string): boolean {
    return (
      customBarPaths.locked.fullPath.includes(path) ||
      customBarPaths.locked.prefixPath.some((p) => path.startsWith(p))
    );
  }

  function shouldDock(path: string): boolean {
    return (
      customBarPaths.docked.fullPath.includes(path) ||
      customBarPaths.docked.prefixPath.some((p) => path.startsWith(p))
    );
  }

  function handleLockedBar(): void {
    setShowDocked(false);
    setDocked(false);
    setShowNavbar(true);
  }

  function handleDockedBar(): void {
    if (docked) return;
    setShowNavbar(false);
    setDocked(true);
  }

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      const path = navbarRef?.current?.id ?? '/';
      console.log('gonna lock', shouldLock(path));
      if (shouldLock(path)) return handleLockedBar();
      if (shouldDock(path)) return handleDockedBar();

      const navbarHeight = navbarRef.current?.clientHeight ?? 50;
      return setShowNavbar(event.clientY < navbarHeight);
    }

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      {docked && (
        <div
          className={`docked-nav ${showDocked ? 'docked-nav-expanded' : ''}`}
          style={{
            height: navbarRef.current?.clientHeight ?? 50,
          }}
          onClick={() => {
            setShowDocked(!showDocked);
          }}
        >
          <img src="/images/icons/butterflies.svg" alt="logo" width={50} height={50} />
        </div>
      )}
      <div
        className={`navbar ${showNavbar ? 'navbar-show' : 'navbar-hide'} ${
          docked ? (showDocked ? 'navbar-show-docked' : 'navbar-hide-docked') : ''
        }`}
        ref={navbarRef}
        id={currentPath}
      >
        <Link className="brand-name" to="/">
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {!docked && (
              <img
                src="/images/icons/butterflies.svg"
                alt="logo"
                width={50}
                height={50}
                style={{
                  marginRight: '6px',
                }}
              />
            )}
            <div
              style={{
                marginLeft: docked ? '56px' : '0px',
              }}
            >
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
    </>
  );
}

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
