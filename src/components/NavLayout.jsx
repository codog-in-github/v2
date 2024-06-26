import Sidebar from './NavSidebar';
import Navbar from './NavTopbar';
import { Outlet } from 'react-router-dom';

function NavLayout() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
}

export default NavLayout;