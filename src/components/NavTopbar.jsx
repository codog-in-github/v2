import logo from '@/assets/images/icons/chz_logo.webp'
import Avatar from './Avatar';
import { NavButton, NavButtonGroup } from './NavButton';
import { namespaceClass } from '@/helpers/style';
import classnames from 'classnames';
import { CaretDownOutlined, HomeFilled } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const c = namespaceClass('nav-top-bar')

const useLogout = () => {
  const navigate = useNavigate()
  const handle = useCallback(() => {
    localStorage.removeItem('token')
    navigate('/')
  }, [navigate])
  return handle
}
const NavTopbar = ({ className }) => {
  const logoutHandle = useLogout()
  return (
    <div className={classnames(c(''), 'bg-white flex items-center', className)}>
      <img className={classnames(c('logo'))} src={logo}></img>
      <div className={classnames(c('title'))}>春海組システム</div>
      <NavButtonGroup className="ml-20 space-x-4">
        <NavButton to="/top">
          <HomeFilled />
          <span className='ml-1'>TOP</span>
        </NavButton>
        <NavButton to="/po">PO</NavButton>
        <NavButton to="/drive">DRIVE</NavButton>
        <NavButton to="/customs">通関資料</NavButton>
        <NavButton to="/acl">ACL</NavButton>
        <NavButton to="/permission">許可</NavButton>
        <NavButton to="/invoice">請求書</NavButton>
      </NavButtonGroup>
      <div className="flex ml-auto pr-4">
        <Dropdown
           menu={{ items: [
            { key: '1', label: <div onClick={logoutHandle}>プロフィール</div> },
           ] }}
           
        >
          <div className='flex gap-2 items-center'>
            <Avatar></Avatar>
              <span className='mx-2'>吉田</span>
            <CaretDownOutlined />
          </div>
        </Dropdown>
      </div>
    </div>
  );
}

export default NavTopbar;