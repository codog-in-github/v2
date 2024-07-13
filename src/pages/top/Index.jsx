import { Switch } from 'antd';
import Card from './Card';
import Message from './Message';
import './top.scss'
import AddCard from './AddCard';
import { namespaceClass } from '@/helpers/style';
import classNames from 'classnames';
import { useState } from 'react';
import { useEffect } from 'react';
import AddModal from './AddModal';
import { useNavigate } from 'react-router-dom';
const c = namespaceClass('page-top')
function getOrders() {
  return new Promise(res => {
    setTimeout(res, 1000, [{
      avatarText: '無',
      avatarColor: '#fff00f',
      companyName: '無錫永興貨運有限公司',
      contactPerson: '王大明',
      contactPhone: '86-15240056982',
      warningTime: new Date(Date.now() + 1000 * 60 * 60),
    },{
      avatarText: 'A',
      avatarColor: '#fff00f',
      companyName: '無錫永興貨運有限公司',
      contactPerson: '王大明',
      contactPhone: '86-15240056982',
      warningTime: new Date(Date.now() + 1000 * 60 * 60 * 0.5),
    }])
  })
}
function MainContent() {
  const [orders, setOrders] = useState([])
  const [activeIndex, setActiveIndex] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const nav = useNavigate()
  useEffect(() => {
    getOrders().then(setOrders)
  }, []);
  return (
    <div className="flex h-full overflow-auto" onClick={() => setActiveIndex(null)}>
      <div className={classNames(c('main-content'), 'flex-1', 'overflow-auto')}>
        <div className="flex gap-4 flex-wrap">
          <AddCard onClick={() => setModalOpen(true)} />
          {orders.map((order, i) => (
            <Card
              key={i}
              {...order}
              active={i === activeIndex}
              onClick={(e) => {
                e.stopPropagation()
                setActiveIndex(i)
              }}
            />
          ))}
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">直近完了</h2>
          <div className="flex space-x-4">
            <Card end />
            <Card end />
          </div>
        </div>
        </div>
      <div className={classNames(c('message-bar'), 'p-2 bg-white h-full flex flex-col overflow-hidden')}>
        <div className="flex mb-4">
          <div className='mr-auto'>社内伝達</div>
          <div className='mr-1'>@ME</div>
          <Switch></Switch>
        </div>
        <div className="space-y-4 flex-1 overflow-auto  pr-2">
          <Message />
          <Message />
          <Message />
          <Message />
          <Message />
          <Message />
          <Message />
        </div>
      </div>
      <AddModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => {}}
        onOkEdit={() => {
          nav('/orderDetail')
        }}
      />
    </div>
  );
}

export default MainContent;