import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="mobile-container">
      <div className="mobile-content">
        <Outlet />
      </div>
    </div>
  );
}
