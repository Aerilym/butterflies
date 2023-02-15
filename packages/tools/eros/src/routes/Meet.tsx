import { Outlet } from 'react-router-dom';

export default function Meet() {
  return (
    <div
      style={{
        overflow: 'hidden',
      }}
    >
      <Outlet />
    </div>
  );
}
