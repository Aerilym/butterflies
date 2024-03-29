import { Outlet } from 'react-router-dom';

import { useAuth } from '../components/authentication/AuthProvider';
import { navMap } from '../main';
import Navbar from '../components/utility/Navbar';

import '../styles/app.css';
import 'react-tooltip/dist/react-tooltip.css';
import '../styles/utility/tooltips.css';

const customBarPaths = {
  locked: {
    fullPath: ['', '/', '/config', '/users', '/godview', '/analytics', '/internal', '/meet'],
    prefixPath: [],
  },
  docked: {
    fullPath: [''],
    prefixPath: ['/meet'],
  },
};

function Root() {
  const { user } = useAuth();

  return (
    <div className="App">
      <Navbar navMap={navMap} customBarPaths={customBarPaths} user={user} />
      <Outlet />
    </div>
  );
}

export default Root;
