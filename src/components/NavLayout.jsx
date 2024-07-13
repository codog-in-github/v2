import NavSidebar from './NavSidebar';
import NavTopbar from './NavTopbar';
import { Outlet } from 'react-router-dom';

export const TopLayout = () => {
  return (
    <div className="nav-layout flex flex-col h-screen">
      <NavTopbar className="flex-shrink-0" />
      <div className="flex-1 flex overflow-hidden">
      <Outlet />
      </div>
    </div>
  );
}

export const SideLayout = () => {
  return (
    <>
      <NavSidebar />
      <div className='nav-layout-main'>
        <Outlet />
      </div>
    </>
  )
}
