import logo from '@/assets/images/icons/chz_logo.webp'
import Avatar from './Avatar';
import { NavButton, NavButtonGroup } from './NavButton';
import { namespaceClass } from '@/helpers/style';
import classnames from 'classnames';
import { CaretDownOutlined } from '@ant-design/icons';
import {Badge, Dropdown} from 'antd';
import { useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as Icon from '@/components/Icon'
import {useSelector, useStore} from 'react-redux';
import {
  ORDER_TAB_STATUS_ACL,
  ORDER_TAB_STATUS_BL_COPY,
  ORDER_TAB_STATUS_CUSTOMER_DOCUMENTS,
  ORDER_TAB_STATUS_CUSTOMS,
  ORDER_TAB_STATUS_DRIVE,
  ORDER_TAB_STATUS_PO,
  ORDER_TAB_STATUS_SUR,
  ORDER_TYPE_EXPORT
} from '@/constant';
import { useEffect } from 'react';
import pubSub from '@/helpers/pubSub';
import { useState } from 'react';
import { useAsyncCallback } from '@/hooks';
import { request } from '@/apis/requestBuilder';
import Echo from "@/helpers/echo.js";

const c = namespaceClass('nav-top-bar')
const useLogout = () => {
  const navigate = useNavigate()
  const store = useStore()

  return useCallback(() => {
    const { user } = store.getState()
    Echo.leaveChannel('user.' + user.userInfo.id)
    Echo.leaveChannel('department.' + user.userInfo.department)
    navigate('/')
    localStorage.removeItem('token')
  }, [navigate])
}

const ExportMenus = ({ badgeCounts }) => {
  return (
    <>
      <NavButton to={`/ct/${ORDER_TAB_STATUS_PO}`} badge={badgeCounts[1]}>
        <Icon.Po className="w-4 h-4 inline relative bottom-[2px]" />
        <span className='ml-2'>PO</span>
      </NavButton>
      <NavButton to={`/ct/${ORDER_TAB_STATUS_DRIVE}`} badge={badgeCounts[2]}>
        <Icon.Drive className="w-4 h-4 inline relative bottom-[2px]" />
        <span className='ml-2'>DRIVE</span>
      </NavButton>
      <NavButton to={`/od/${ORDER_TAB_STATUS_CUSTOMS}`} badge={badgeCounts[3]}>
        <Icon.GateDoc className="w-4 h-4 inline relative bottom-[2px]" />
        <span className='ml-2'>通関資料</span>
      </NavButton>
      <NavButton to={`/od/${ORDER_TAB_STATUS_ACL}`} badge={badgeCounts[4]}>
        <Icon.Acl className="w-4 h-4 inline relative bottom-[2px]" />
        <span className='ml-2'>ACL</span>
      </NavButton>
      <NavButton to={`/od/${ORDER_TAB_STATUS_CUSTOMER_DOCUMENTS}`} badge={badgeCounts[5]}>
        <Icon.Permission className="w-4 h-4 inline relative bottom-[2px]" />
        <span className='ml-2'>許可</span>
      </NavButton>
      <NavButton to={`/od/${ORDER_TAB_STATUS_BL_COPY}`} badge={badgeCounts[6]}>
        <Icon.BlCopy className="w-4 h-4 inline relative bottom-[2px]" />
        <span className='ml-2'>BL COPY</span>
      </NavButton>
      <NavButton to={`/od/${ORDER_TAB_STATUS_SUR}`} badge={badgeCounts[7]}>
        <Icon.Sur className="w-4 h-4 inline relative bottom-[2px]" />
        <span className='ml-2'>SUR</span>
      </NavButton>
      <NavButton to="/rbl" badge={badgeCounts[8]}>
        <Icon.RequestBook />
        <span className='ml-2'>請求書</span>
      </NavButton>
    </>
  )
}

const ImportMenus = ({ badgeCounts }) => {
  return (
    <>
      <NavButton to={`/ct/12`} badge={badgeCounts[12]}>
        <Icon.Po className="w-4 h-4 inline relative bottom-[2px]" />
        <span className='ml-2'>配送依赖</span>
      </NavButton>
      <NavButton to={`/ct/13`} badge={badgeCounts[13]}>
        <Icon.Drive className="w-4 h-4 inline relative bottom-[2px]" />
        <span className='ml-2'>PO</span>
      </NavButton>
      <NavButton to={`/ct/14`} badge={badgeCounts[14]}>
        <Icon.Drive className="w-4 h-4 inline relative bottom-[2px]" />
        <span className='ml-2'>DRIVE</span>
      </NavButton>
      <NavButton to={`/ct/15`} badge={badgeCounts[15]}>
        <Icon.Drive className="w-4 h-4 inline relative bottom-[2px]" />
        <span className='ml-2'>通関依頼</span>
      </NavButton>
      <NavButton to={`/ct/16`} badge={badgeCounts[16]} style={{ '--nav-button-width': '150px' }}>
        <Icon.Drive className="w-4 h-4 inline relative bottom-[2px]" />
        <span className='ml-2'>D/O切り替え</span>
      </NavButton>
      <NavButton to={`/ct/17`} badge={badgeCounts[17]}>
        <Icon.Drive className="w-4 h-4 inline relative bottom-[2px]" />
        <span className='ml-2'>許可書送付</span>
      </NavButton>
      <NavButton to={`/rbl`}>
        <Icon.Drive className="w-4 h-4 inline relative bottom-[2px]" />
        <span className='ml-2'>請求書作成</span>
      </NavButton>
    </>
  )
}
const NavTopbar = ({ className }) => {
  const username = useSelector(state => state.user.userInfo.name)
  const unReadMsgCount = useSelector(state => state.user.message.unread)
  const orderType = useSelector(state => state.order.type)

  const logoutHandle = useLogout()
  const [badgeCounts, setBadgeCounts] = useState([])
  const [updateBadge] = useAsyncCallback(async () => {
    const data = await request('/admin/order/tabs_todo_total').get({ order_type: orderType }).send()
    setBadgeCounts(data)
  })

  useEffect(() => {
    pubSub.subscribe('Info.Order.Change', updateBadge)
    return () => {
      pubSub.unsubscribe('Info.Order.Change', updateBadge)
    }
  }, [updateBadge])

  useEffect(() => {
    updateBadge()
  }, [updateBadge, orderType])

  return (
    <div className={classnames(c(''), 'bg-white flex items-center', className)}>
      <Link to="/top" className='flex gap-1 items-center'>
        <img className={classnames(c('logo'))} src={logo}></img>
        <div className={classnames(c('title'))}>春海組システム</div>
      </Link>

      <NavButtonGroup className="ml-20 flex-1 overflow-auto space-x-4">
        <NavButton to="/top" badge={badgeCounts[0]}>
          <Icon.Top classname="w-4 h-4 inline relative bottom-[3px]" />
          <span className='ml-2'>TOP</span>
        </NavButton>

        { orderType === ORDER_TYPE_EXPORT ? (
          <ExportMenus badgeCounts={badgeCounts}></ExportMenus>
        ): (
          <ImportMenus badgeCounts={badgeCounts}></ImportMenus>
        ) }

      </NavButtonGroup>

      <div className="flex ml-auto pr-4">
        <Dropdown
           menu={{ items: [
            { key: '1', label: <div onClick={logoutHandle}>サインアウト</div> },
           ] }}
        >
          <div className='flex gap-2 items-center'>
            <Badge count={unReadMsgCount}>
              <Avatar />
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
