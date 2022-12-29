import Header from '../components/Header';
import { Outlet, Link } from 'react-router-dom';

export default function Internal() {
  return (
    <div className="top-container">
      <nav className="navigation side-nav">
        <div className="navigation-menu expanded">
          <ul>
            <li>
              <Link to="dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="authentication">Authentication</Link>
            </li>
            <li>
              <Link to="users">Users</Link>
            </li>
          </ul>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
