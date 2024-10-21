import { request } from "@/apis/requestBuilder";
import { useEffect, useState, useRef } from "react";
import { useAsyncCallback } from "@/hooks";
import SkeletonList from "@/components/SkeletonList";
import {Button, Empty, Modal} from "antd";
import { forwardRef } from "react";
import { useImperativeHandle } from "react";
import dayjs from "dayjs";
import classNames from "classnames";
import CompanyAvatar from "@/components/CompanyAvatar";
import { DEPARTMENTS } from "@/constant";
import { Link } from "react-router-dom";
import ListModal from "./ListModal.jsx";

const useTabReqNoticeList = () => {
  const [list, setList] = useState({
    todo: [],
    done: []
  });
  const [reload, loading] = useAsyncCallback(async () => {
    const res = await request('/admin/acc/void_list').get().send()
    setList(res)
  })
  useEffect(() => {
    reload()
  }, [])
  return { list, reload, loading }
}
function Card({
  item = {},
  className,
  end = false,
  onClick = () => {},
  ...props
}) {
  return (
    <div
      className={classNames(
        'bg-white p-4 shadow-lg shadow-gray-50 rounded border-2 flex-shrink-0 flex flex-col relative hover:border-primary overflow-hidden cursor-pointer',
        className,
      )}
      onClick={() => onClick(item)}
      {...props}
    >

      <div className='flex flex-1'>
        <CompanyAvatar  text={item['order']['short_name'][0]} />
        <div className='ml-4'>
          <div className='font-semibold text-[#1B1B1B]'>
            请求书变更申请-{DEPARTMENTS[item['order']['department']]}-{item['void_by_name']}
          </div>
          <div className="text-sm flex items-center justify-between text-[#848484] mt-2">
            <div>{dayjs(item['void_at']).format('YYYY-MM-DD')}</div>
            <div>变更日期</div>
          </div>
        </div>
      </div>

      <div className='flex my-2 items-center text-sm text-[#484848]'>
        <div className='mr-auto w-1/2'>{item['order']['bkg_no']}</div>
        <div className='h-4 border-l border-gray-300'></div>
        <div className='ml-auto w-1/2 text-right text-nowrap'>{item['no']}</div>
      </div>
    </div>
  );
}

const OrderGroup = ({ title, list, loading, button, children }) => {
  return (
    <div className="mb-[20px] rounded-lg">
      <div className="flex items-center">
        <div>{title}</div>
        <div className={'ml-2'}>{button}</div>
      </div>
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-8 flex-wrap mt-4 [&:has(.ant-empty)]:!grid-cols-1">
        <SkeletonList
          empty={<Empty />}
          list={list}
          loading={loading}
          skeletonCount={8}
          skeletonClassName="!w-full !h-32"
        >{children}</SkeletonList>
      </div>
    </div>
  )
}

const ConfirmModal = forwardRef(function ConfirmModal({
  onSuccess = () => {}
}, ref) {
  const [open, setOpen] = useState(false)
  const [read, reading] = useAsyncCallback(async () => {
    await request('/admin/acc/read_void').data({ id: from.id }).send()
    setOpen(false)
    onSuccess()
  })
  const [from, setFrom] = useState(null)
  const [to, setTo] = useState(null)
  useImperativeHandle(ref, () => ({
    open(item) {
      setFrom(item)
      setTo(item['replace_book'])
      setOpen(true)
    }
  }), [])


  return (
    <Modal
      title="详细"
      open={open}
      onCancel={() => setOpen(false)}
      width={340}
      onOk={read}
      okText={'確認変更'}
      okButtonProps={{ loading: reading }}
    >
      { !!from && !!to && (
        <div className={'p-5'}>
          <div>
            作废：
            <Link
              className={'text-primary-500'}
              target="_blank"
              to={`/rb/edit/${from['id']}/order/${from['order_id']}/type/${from['order_id']}?d=1`}
            >{from.name}</Link>
          </div>
          <div>
            添加：
            <Link
              target="_blank"
              className={'text-primary-500'}
              to={`/rb/edit/${to['id']}/order/${to['order_id']}/type/${to['order_id']}?d=1`}
            >{to.name}</Link>
          </div>
        </div>
      ) }
    </Modal>
  )
})

function ReqNoticeList() {
  const modalRef = useRef(null)
  const { list, reload, loading } = useTabReqNoticeList()
  const listModalRef = useRef(null);

  return (
    <div className="flex-1">
      <OrderGroup
        title="未完成"
        loading={loading}
        list={list.todo}
      >
        {item => (
          <Card
            key={item['id']}
            onClick={() => modalRef.current.open(item)}
            item={item}
          />
        )}
      </OrderGroup>
      <OrderGroup
        title="直近完了"
        loading={loading}
        button={<Button onClick={() => listModalRef.current.open()}>查看全部</Button>}
        list={list.done}
      >
        {item => (
          <Card
            key={item['id']}
            item={item}
          />
        )}
      </OrderGroup>
      <ConfirmModal onSuccess={reload} ref={modalRef} />
      <ListModal ref={listModalRef} />
    </div>
  );
}

export default ReqNoticeList;
