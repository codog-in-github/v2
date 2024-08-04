import logo from '@/assets/images/icons/chz_logo.webp'
import Avatar from './Avatar';
import { NavButton, NavButtonGroup } from './NavButton';
import { namespaceClass } from '@/helpers/style';
import classnames from 'classnames';
import { CaretDownOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
const c = namespaceClass('nav-top-bar')
import * as Icon from '@/components/Icon'
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
      <Link to="/top" className='flex gap-1 items-center'>
        <img className={classnames(c('logo'))} src={logo}></img>
        <div className={classnames(c('title'))}>春海組システム</div>
      </Link>
      <NavButtonGroup className="ml-20 space-x-4">
        <NavButton to="/top">
          <Icon.Top classname="w-4 h-4 inline relative bottom-[3px]" />
          <span className='ml-2'>TOP</span>
        </NavButton>
        <NavButton to="/ct/1">
          <Icon.Po className="w-4 h-4 inline relative bottom-[2px]" />
          <span className='ml-2'>PO</span>
        </NavButton>
        <NavButton to="/ct/2">
          <Icon.Drive className="w-4 h-4 inline relative bottom-[2px]" />
          <span className='ml-2'>DRIVE</span>
        </NavButton>
        <NavButton to="/tab/2">
          <Icon.GateDoc className="w-4 h-4 inline relative bottom-[2px]" />
          <span className='ml-2'>通関資料</span>
        </NavButton>
        <NavButton to="/tab/3">
          <Icon.Acl className="w-4 h-4 inline relative bottom-[2px]" />
          <span className='ml-2'>ACL</span>
        </NavButton>
        <NavButton to="/tab/4">
          <Icon.Permission className="w-4 h-4 inline relative bottom-[2px]" />
          <span className='ml-2'>許可</span>
        </NavButton>
        <NavButton to="/tab/5">
          <Icon.BlCopy className="w-4 h-4 inline relative bottom-[2px]" />
          <span className='ml-2'>BL COPY</span>
        </NavButton>
        <NavButton to="/tab/6">
          <Icon.Sur className="w-4 h-4 inline relative bottom-[2px]" />
          <span className='ml-2'>SUR</span>
          </NavButton>
        <NavButton to="/tab/9">
          <Icon.RequestBook className="w-4 h-4 inline relative bottom-[2px]" />
          <span className='ml-2'>請求書</span>
        </NavButton>
      </NavButtonGroup>
      <div className="flex ml-auto pr-4">
        <Dropdown
           menu={{ items: [
            { key: '1', label: <div onClick={logoutHandle}>サインアウト</div> },
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