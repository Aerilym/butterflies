import Header from '../components/Header';
import { Outlet, Link } from 'react-router-dom';

export default function Config() {
  return (
    <div className="top-container">
      <nav className="navigation side-nav">
        <div className={'navigation-menu expanded'}>
          <ul>
            <li>
              <Link to="onboarding">Onboarding</Link>
            </li>
            <li>
              <Link to="authentication">Authentication</Link>
            </li>
            <li>
              <Link to="users">Users</Link>
            </li>
            <li>
              <Link to="kvoverride">KV Override</Link>
            </li>
          </ul>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
