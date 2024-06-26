import logo from '@/assets/images/icons/chz_logo.webp'
import Avatar from './Avatar';
import { NavButton, NavButtonGroup } from './NavButton';


function Navbar() {
  return (
    <div className="bg-white shadow p-4 flex items-center">
      <img className='mr-2' src={logo}></img>
      <div className='font-semibold text-lg'>春海組システム</div>
      <NavButtonGroup className="ml-4 space-x-4">
        <NavButton to="/top">TOP</NavButton>
        <NavButton to="/po">PO</NavButton>
        <NavButton to="/drive">DRIVE</NavButton>
        <NavButton to="">通関資料</NavButton>
        <NavButton to="/acl">ACL</NavButton>
        <NavButton to="">許可</NavButton>
        <NavButton to="">請求書</NavButton>
      </NavButtonGroup>
      <div className="flex items-center ml-auto">
        <Avatar></Avatar>
        <span className='ml-2'>吉田</span>
      </div>
    </div>
  );
}

export default Navbar;