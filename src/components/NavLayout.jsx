import NavSidebar from './NavSidebar';
import NavTopbar from './NavTopbar';
import { Outlet } from 'react-router-dom';

function NavLayout() {
  return (
    <div className="flex flex-col h-screen">
      <NavTopbar />
      <div className="flex-1 flex bg-gray-50">
        <NavSidebar />
        <Outlet />
      </div>
    </div>
  );
}

export default NavLayout;