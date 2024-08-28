import { themeColor } from "@/helpers/color";
import { request } from "@/apis/requestBuilder";
import { useEffect, useState, useRef } from "react";
import { useAsyncCallback, useContextMenu } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import pubSub from "@/helpers/pubSub";
import SkeletonList from "@/components/SkeletonList";
import { ORDER_NODE_TYPE_REQUEST, ORDER_TAB_STATUS_REQUEST } from "@/constant";
import { Avatar } from "antd";

const useReqList = () => {
  const [list, setList] = useState({});
  const [reload, loading] = useAsyncCallback(async () => {
    const res = await request('/admin/order/req_list').get().send()
    setList(res)
  })
  useEffect(() => { reload() }, [])
  return { list, reload, loading }
}

const groups = [
  { color: 'danger', title: '作成待', key: 'undo' },
  { color: 'success', title: '発送待', key: 'unsend' },
  { color: 'success', title: '入金待', key: 'unentry' },
]

const ListGroup = ({ title, color, list, onContextMenu, loading }) => {
  const navigate = useNavigate()
  return (

    <div className="bg-white mb-[20px] rounded-lg shadow p-4">
      <div>{title}</div>
      <div className="grid grid-cols-4 lg:grid-cols-6 gap-8 flex-wrap mt-4 [&:has(.ant-empty)]:!grid-cols-1">
        <SkeletonList
          list={list}
          loading={loading}
          skeletonCount={8}
          skeletonClassName="w-full h-32"
        >
          {item => (
            <Card
              key={item['id']}
              onContextMenu={e => onContextMenu(e, item)}
              onClick={() => navigate(`/orderDetail/${item['id']}`)}
              color={color}
              orderInfo={item}
            />
          )}
        </SkeletonList>
      </div>
    </div>
  )
}
function Card({
  orderInfo = {},
  color,
  ...props
}) {
  const grayscale = {};
  if (orderInfo.end) {
    grayscale.filter = "grayscale(100%)";
  }
  return (
    <div
      className="border-2 border-t-[6px] rounded h-[120px] cursor-pointer overflow-hidden text-[#484848]"
      style={{
        borderColor: themeColor(color, 60),
        ...grayscale
      }}
      {...props}
    >
      <div className="flex p-2 overflow-hidden" style={{ background: themeColor(color, 95) }}>
        <Avatar
          size={40}
          style={{ backgroundColor: themeColor(color, 60) }}
        >
          {orderInfo['company_name']?.[0]}
        </Avatar>
        <div className="ml-2 flex-1 w-1" >
          <div className="truncate text-[22px] flex items-center w-full">
            <span className="mr-auto">{orderInfo['cy_cut']?.substring(5)}</span>
            <span className="text-[14px]" style={{ color: themeColor(color, 60) }}>CY CUT</span>
          </div>
          <div className="truncate">{orderInfo['loading_port_name']?.split('/')[0]}-{orderInfo['delivery_port_name']?.split('/')[0]}</div>
        </div>
      </div>
      <div className="flex justify-between p-2">
        <div className="truncate">{orderInfo.containers?.[0]?.['common']}</div>
        <div>{orderInfo['bkg_no']}</div>
      </div>
    </div>
  );
}

function RequestBookPage() {
  const { list, reload, loading } = useReqList()
  const order = useRef(null)
  const [topNode, topNodeLoading] = useAsyncCallback(async () => {
    await request('/admin/order/change_top').data({
      'id': order.current['id'],
      'node_status': ORDER_TAB_STATUS_REQUEST,
      'is_top': 1
    }).send()
    pubSub.publish('Info.Toast', '已置顶任务', 'success')
    reload()
  })

  const [menu, open] = useContextMenu(
    <div
      className="
        fixed w-32 z-50 border cursor-OrderListinter
        text-center bg-white shadow-md
        leading-8 rounded-md overflow-hidden
      "
      onClick={e => e.stopPropagation()}
    >
      {/* <div
        type='primary'
        className='text-primary hover:text-white hover:bg-primary active:bg-primary-600'
        onClick={() => { }}
      >指派任务</div> */}
      <div
        type='primary'
        className='text-primary hover:text-white hover:bg-primary active:bg-primary-600'
        onClick={topNode}
      >
        {topNodeLoading && <LoadingOutlined className="mr-2" />}
        置顶任务
      </div>
    </div>
  )
  /**
   * 
   * @param {Event} e 
   */
  const contextMenuHandle = (e, item) => {
    e.preventDefault()
    order.current = item
    open({
      x: e.clientX,
      y: e.clientY
    })
  }
  return (
    <div className="flex-1">
      { groups.map(item => (
        list[item.key] && (
          <ListGroup
            key={item.key}
            list={list[item.key]}
            title={item.title}
            color={item.color}
            loading={loading}
            onContextMenu={contextMenuHandle}
          ></ListGroup>
        )
      )) }
      {menu}
    </div>
  );
}

export default RequestBookPage;
