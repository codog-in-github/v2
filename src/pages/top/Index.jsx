import { Skeleton } from 'antd';
import Card from './Card';
import './top.scss'
import AddCard from './AddCard';
import { namespaceClass } from '@/helpers/style';
import classNames from 'classnames';
import { useState } from 'react';
import AddModal from './AddModal';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { request } from '@/apis/requestBuilder';
import { useSelector } from 'react-redux';
import { useTopOrderList } from './dataHooks';
import MessageList from './MessageList';

const c = namespaceClass('page-top')
const saveOrder = (data) => {
  return request('admin/order/create').data(data).send()
}

const useSaveOrder = (next) => {
  const orderType = useSelector(state => state.order.type)
  const saveHandle = useCallback(async (data) => {
    const id = await saveOrder({
      'bkg_type': orderType,
      'customer_id': data.customer,
      'remark': data.remark
    })
    if(next) {
      next(id)
    }
  }, [next, orderType])
  return saveHandle
}
function MainContent() {
  const { orders, loading } = useTopOrderList()
  const [activeIndex, setActiveIndex] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const navigate = useNavigate()

  const toDetail = useCallback(({ id }) => {
    navigate('/orderDetail/' + id)
  }, [navigate])

  const closeAddModal = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const onOkEditHandle = useSaveOrder(toDetail)
  const onOkHandle = useSaveOrder(closeAddModal)

  return (
    <div className="flex h-full overflow-auto" onClick={() => setActiveIndex(null)}>
      <div className={classNames(c('main-content'), 'flex-1', 'overflow-auto')}>
        <div className="grid grid-cols-4 [&>*]:!h-[160px] gap-4 flex-wrap">
          <AddCard onClick={() => setModalOpen(true)} />
          {loading && Array(7).fill(0).map((_, k) => {
            return (
              <Skeleton.Node className='!w-full !h-full' key={k} active>
                <></>
              </Skeleton.Node>
            )
          })}
          {orders.map((order, i) => (
            <Card
              key={i}
              {...order}
              className="border-2 border-transparent cursor-pointer"
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
          <div className="grid grid-cols-4 [&>*]:!h-[160px] gap-4 flex-wrap">
            {loading && Array(7).fill(0).map((_, k) => {
            return (
              <Skeleton.Node className='!w-full !h-full' key={k} active >
                <></>
              </Skeleton.Node>
            )
          })}
            <Card 
              avatarText='無'
              avatarColor='#8F8F8F'
              companyName='無錫永興貨運有限公司'
              contactPerson='王大明'
              contactPhone='86-15240056982'
              end
            />
          </div>
        </div>
      </div>
      <div className={classNames(c('message-bar'), 'px-2 py-[22px] bg-white h-full flex flex-col overflow-hidden border-l')}>
        <MessageList />
      </div>
      <AddModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onOkHandle}
        onOkEdit={onOkEditHandle}
      />
    </div>
  );
}

export default MainContent;