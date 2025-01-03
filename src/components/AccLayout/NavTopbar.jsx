import logo from '@/assets/images/icons/chz_logo.webp'
import Avatar from '@/components/Avatar';
import { NavButton, NavButtonGroup } from '@/components/NavButton';
import { namespaceClass } from '@/helpers/style';
import classnames from 'classnames';
import { CaretDownOutlined } from '@ant-design/icons';
import {Badge, Dropdown} from 'antd';
import {useCallback, useEffect, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
const c = namespaceClass('nav-top-bar')
import * as Icon from '@/components/Icon'
import { useSelector } from 'react-redux';
import {request} from "@/apis/requestBuilder.js";
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
  const unReadMsgCount = useSelector(state => state.user.message.unread)
  const [counts, setCounts] = useState({})

  useEffect(() => {
    request('/admin/acc/tab_counts').get().send().then(setCounts)
  }, []);

  return (
    <div className={classnames(c(''), 'bg-white flex items-center', className)}>
      <Link to="/top" className='flex gap-1 items-center'>
        <img className={classnames(c('logo'))} src={logo}></img>
        <div className={classnames(c('title'))}>春海組システム</div>
      </Link>

      <NavButtonGroup
        className="ml-20 space-x-4"
        buttonWidth={160}
      >
        <NavButton to="/acc/todo" badge={counts.todo}>
          <Icon.UnPaySea className="mr-2" />
          海上未支出
        </NavButton>
        <NavButton to="/acc/payCheck" className="ml-2" badge={counts.pay_check}>
          <Icon.UnPayCosts className={'mr-2'} />
          上游未支出
        </NavButton>
        <NavButton to="/acc/entryList" className="ml-2" badge={counts.entry_list}>
          <Icon.UnEntry className={'mr-2'} />
          未入金
        </NavButton>
        <NavButton to="/acc/reqNotice" className="ml-2" badge={counts.req_notice}>
          <Icon.ChangeRequestBook className={'mr-2'} />
          変更請求書
        </NavButton>
        <NavButton to="/acc/reqDoneNotice" className="ml-2" badge={counts.req_done_notice}>
          <Icon.OffNode className={'mr-2'} />
          熄灯申请
        </NavButton>
      </NavButtonGroup>

      <div className="flex ml-auto pr-4">
        <Dropdown
           menu={{ items: [
            { key: '1', label: <div onClick={logoutHandle}>サインアウト</div> },
           ] }}
        >
          <div className='flex gap-2 items-center'>
            <Badge count={unReadMsgCount}>
              <Avatar/>
            </Badge>
            <span className='mx-2'>{username}</span>
            <CaretDownOutlined />
          </div>
        </Dropdown>
      </div>
    </div>
  );
}

export default NavTopbar;
