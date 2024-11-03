import Card from './Card';
import './top.scss'
import AddCard from './AddCard';
import { namespaceClass } from '@/helpers/style';
import classNames from 'classnames';
import {useRef, useState} from 'react';
import AddModal from './AddModal';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { request } from '@/apis/requestBuilder';
import { useSelector } from 'react-redux';
import { useTopOrderList } from './dataProvider';
import MessageList from './MessageList';
import { useCompleteList, useContextMenu } from '@/hooks';
import SkeletonList from '@/components/SkeletonList';
import { ORDER_TAB_STATUS_TOP } from '@/constant';
import dayjs from 'dayjs';
import pubSub from '@/helpers/pubSub';
import { Form } from 'antd';
import OrderFilter from '@/components/OrderFilter';
import UserPicker from "@/components/UserPicker.jsx";

const c = namespaceClass('page-top')
const saveOrder = (data) => {
  return request('admin/order/create').data(data).send()
}

const useSaveOrder = (next) => {
  const orderType = useSelector(state => state.order.type)
  const saveHandle = useCallback(async (data) => {
    const id = await saveOrder({
      'order_type': orderType,
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
  const [form] = Form.useForm()
  const userPicker = useRef(null)
  const { orders, loading, refresh } = useTopOrderList(form)
  const [modalOpen, setModalOpen] = useState(false)
  const navigate = useNavigate()
  const [completeList, completeLoading] = useCompleteList(ORDER_TAB_STATUS_TOP)
  const [onContextOrder, setOnContextOrder] = useState(null)
  const messageList = useRef(null);
  const toDetail = useCallback(({ id }) => {
    navigate('/orderDetail/' + id)
  }, [navigate])

  const closeAddModal = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const onOkEditHandle = useSaveOrder(toDetail)
  const onOkHandle = useSaveOrder(() => {
    refresh()
    pubSub.publish('Info.Order.Change')
    closeAddModal()
  })

  const [menu, show, close] = useContextMenu(
    <div
      onClick={e => e.stopPropagation()}
      className={classNames([
        'fixed w-24 z-50 border',
        'text-center bg-white shadow-md',
        'leading-8 rounded-md overflow-hidden'
      ])}
    >
      {/*{onContextOrder && onContextOrder.isTempOrder && (*/}
      {/*  <div*/}
      {/*    className={classNames([*/}
      {/*      'text-danger-500 hover:text-white hover:bg-danger-500 border-t active:bg-danger-700'*/}
      {/*    ])}*/}
      {/*  >终止任务</div>*/}
      {/*)}*/}

      <div
        className='text-primary-500 hover:text-white hover:bg-primary-500 border-t active:bg-danger-700'
        onClick={async () => {
          close()
          const user = await userPicker.current.pick()
          const params = {
            'order_id': onContextOrder.orderId,
            'node_id': onContextOrder.nodeId,
            'user_id': user
          }
          await request('admin/order/dispatch').data(params).send()
          pubSub.publish('Info.Toast', '仲間に協力', 'success')
          messageList.current.loadTop()
        }}
      >仲間に協力</div>
    </div>
  )

  return (
      <div className="no-padding flex h-full overflow-auto">
        <div className={classNames(c('main-content'), 'flex-1', 'overflow-auto', 'p-[20px]')}>
        <div className='flex justify-between items-center mb-[20px]'>
          <h2 className="text-xl font-semibold">進行中</h2>
          <OrderFilter form={form} onSearch={refresh} />
        </div>
        <div
          className="grid min-[1800px]:grid-cols-4 grid-cols-3 [&>*]:!h-[160px] gap-4 flex-wrap"
        >
          <SkeletonList
            skeletonCount={7}
            skeletonClassName="!w-full !h-full"
            loading={loading}
            list={orders}
            showEmpty={false}
            prepend={<AddCard onClick={() => setModalOpen(true)} />}
          >
            {(order) => (
              <Card
                key={order.renderKey}
                orderInfo={order}
                onToDetail={id => navigate(`/orderDetail/${id}`)}
                onContextMenu={e => {
                  e.preventDefault()
                  setOnContextOrder(order)
                  show({ x: e.clientX, y: e.clientY })
                }}
              />
            )}
          </SkeletonList>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">直近完了</h2>
          <div
            className="grid min-[1800px]:grid-cols-4 grid-cols-3 [&>*]:!h-[160px] gap-4 flex-wrap [&:has(.ant-empty)]:!grid-cols-1"
          >
          <SkeletonList
            skeletonCount={10}
            skeletonClassName="!w-full !h-full"
            list={completeList}
            loading={completeLoading}
          >
            {item => (
              <Card
                orderInfo={{
                  avatarText: item.order?.company_name?.[0],
                  companyName: item.order?.company_name,
                  bkgNo: item.order?.bkg_no,
                }}
                end={{
                  name: item.sender,
                  time: dayjs(item.mail_at).format('YYYY年MM月DD日 HH:mm')
                }}
              />
            )}
            </SkeletonList>
          </div>
        </div>
      </div>
      <div className={classNames(c('message-bar'), 'px-2 py-[22px] bg-white h-full flex flex-col overflow-hidden border-l')}>
        <MessageList ref={messageList} />
      </div>
      <AddModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onOkHandle}
        onOkEdit={onOkEditHandle}
      />
      {menu}
      <UserPicker ref={userPicker} />
    </div>
  );
}

export default MainContent;
