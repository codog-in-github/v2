import NavSidebar from './NavSidebar';
import NavTopbar from './NavTopbar';
import { Outlet } from 'react-router-dom';

function NavLayout() {
  return (
    <div className="nav-layout flex flex-col h-screen">
      <NavTopbar />
      <div className="flex-1 flex">
        <NavSidebar />
        <div className='nav-layout-main'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default NavLayout;