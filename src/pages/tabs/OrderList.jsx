import { themeColor } from "@/helpers/color";
import { request } from "@/apis/requestBuilder";
import { useEffect, useState, useRef } from "react";
import { useAsyncCallback, useCompleteList, useContextMenu } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import pubSub from "@/helpers/pubSub";
import { useParams } from "react-router-dom";
import SkeletonList from "@/components/SkeletonList";
import { Empty } from "antd";

const useTabOrderList = (type) => {
  const [list, setList] = useState([]);
  const [reload, loading] = useAsyncCallback(async () => {
    const res = await request('/admin/order/tab_order_list').get({
      'node_status': type
    }).send()
    setList(res)
  })
  useEffect(() => { reload() }, [type])
  return { list, reload, loading }
}
const colors = ['danger', 'warning', 'success']
function Card({
  orderInfo = {},
  ...props
}) {
  const grayscale = {};
  if (orderInfo.end) {
    grayscale.filter = "grayscale(100%)";
  }
  return (
    <div
      className="border-2 border-t-[6px] rounded h-32 cursor-pointer overflow-hidden"
      style={{
        borderColor: themeColor(colors[orderInfo.color], 60),
        ...grayscale
      }}
      {...props}
    >
      <div className="flex p-2 overflow-hidden" style={{ background: themeColor(colors[orderInfo.color], 95) }}>
        <div
          className="rounded-full w-8 h-8 leading-8 text-center text-white flex-shrink-0"
          style={{ backgroundColor: themeColor(colors[orderInfo.color], 60) }}
        >
          {orderInfo['company_name']?.[0]}
        </div>
        <div className="ml-2 flex-1 w-1" >
          <div className="truncate">{orderInfo['cy_cut']?.substring(5)}</div>
          <div>{orderInfo['loading_port_name']?.split('/')[0]}-{orderInfo['delivery_port_name']?.split('/')[0]}</div>
        </div>
      </div>
      <div className="flex justify-between p-2">
        <div>{orderInfo.containers?.[0]?.['common']}</div>
        <div>{orderInfo['bkg_no']}</div>
      </div>
    </div>
  );
}

const OrderGroup = ({ title, list, loading, children, empty }) => {
  return (

    <div className="bg-white  m-2 rounded-lg shadow p-4">
      <div>{title}</div>
      <div className="grid grid-cols-4 lg:grid-cols-5 gap-8 flex-wrap mt-4">
        <SkeletonList
          empty={<Empty></Empty>}
          list={list}
          loading={loading}
          skeletonCount={8}
          skeletonClassName="w-full h-32"
        >{children}</SkeletonList>
      </div>
    </div>
  )
}

function OrderList() {
  const { tab } = useParams()
  const { list, reload, loading } = useTabOrderList(tab)
  const [compList, loadingComp] = useCompleteList(tab)
  const order = useRef(null)
  const navigate = useNavigate()
  const [topNode, topNodeLoading] = useAsyncCallback(async () => {
    await request('/admin/order/change_top').data({
      'id': order.current['id'],
      'node_status': tab,
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
        onClick={() => {}}
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
      <OrderGroup
        title="未完成"
        loading={loading}
        list={list}
      >
        {item => (
          <Card
            key={item['id']}
            onContextMenu={e => contextMenuHandle(e, item)}
            onClick={() => navigate(`/orderDetail/${item['id']}`)}
            orderInfo={item}
          />
        )}
      </OrderGroup>
      <OrderGroup
        title="直近完了"
        loading={loadingComp}
        list={compList}
      >
        {item => (
          <Card
            key={item['id']}
            onClick={() => navigate(`/orderDetail/${item['id']}`)}
            orderInfo={item.order}
          />
        )}
      </OrderGroup>
      {menu}
    </div>
  );
}

export default OrderList;
