import logo from '@/assets/images/icons/chz_logo.webp'
import Avatar from '@/components/Avatar';
import { NavButton, NavButtonGroup } from '@/components/NavButton';
import { namespaceClass } from '@/helpers/style';
import classnames from 'classnames';
import { CaretDownOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
const c = namespaceClass('nav-top-bar')
import * as Icon from '@/components/Icon'
import { useSelector } from 'react-redux';
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
  const username = useSelector(state => state.user.userInfo.name)
  return (
    <div className={classnames(c(''), 'bg-white flex items-center', className)}>
      <Link to="/top" className='flex gap-1 items-center'>
        <img className={classnames(c('logo'))} src={logo}></img>
        <div className={classnames(c('title'))}>春海組システム</div>
      </Link>
      <NavButtonGroup className="ml-20 space-x-4">
        <NavButton to="/acc/todo">
          <Icon.Top classname="w-4 h-4 inline relative bottom-[3px]" />
          <span className='ml-2'>未支出</span>
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
              <span className='mx-2'>{username}</span>
            <CaretDownOutlined />
          </div>
        </Dropdown>
      </div>
    </div>
  );
}

export default NavTopbar;