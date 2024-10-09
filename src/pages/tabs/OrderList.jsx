import { themeColor } from "@/helpers/color";
import { request } from "@/apis/requestBuilder";
import { useEffect, useState, useRef } from "react";
import { useAsyncCallback, useCompleteList, useContextMenu } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import pubSub from "@/helpers/pubSub";
import { useParams } from "react-router-dom";
import SkeletonList from "@/components/SkeletonList";
import { Empty, Avatar } from "antd";
import { EXPORT_NODE_NAMES, ORDER_TAB_STATUS_ACL } from "@/constant";
import PortFullName from "@/components/PortFullName";
import OrderFilter from "@/components/OrderFilter";
import { Form } from "antd";
import { CARD_COLORS } from "./common";
import TopBadge from "@/components/TopBadge";
import UserPicker from "@/components/UserPicker.jsx";

const useTabOrderList = (type, form) => {
  const [list, setList] = useState([]);
  const [reload, loading] = useAsyncCallback(async () => {
    const res = await request('/admin/order/tab_order_list').get({
      'node_status': type,
      ...form.getFieldsValue()
    }).send()
    const orders = []
    for(const item of res) {
      orders.push({
        ...item.order,
        node: item,
        color: item.color,
        top: item.is_top ? EXPORT_NODE_NAMES[item.node_id] : null,
      })
    }
    setList(orders)
  })
  useEffect(() => {
    form.setFieldsValue({
      'filter_key': 'bkg_no',
      'filter_value': '',
    })
    reload()
  }, [type])
  return { list, reload, loading }
}
function Card({
  tab,
  orderInfo = {},
  end = false,
  ...props
}) {
  return (
    <div
      className="border-2 border-t-[6px] rounded h-[120px] cursor-pointer overflow-hidden text-[#484848] relative"
      style={{
        borderColor: end ? '#C0C0C0' : CARD_COLORS[orderInfo.color].border,
      }}
      {...props}
    >
      {orderInfo.top && <TopBadge>{orderInfo.top}</TopBadge>}
      <div
        className="flex p-2 overflow-hidden items-center"
        style={{ background: end ? '#f1f1f1' : CARD_COLORS[orderInfo.color].bg }}
      >
        <Avatar
          size={40}
          style={{ backgroundColor: end ? '#C0C0C0' : CARD_COLORS[orderInfo.color].border }}
        >
          {orderInfo['short_name']?.[0]}
        </Avatar>
        <div className="ml-2 flex-1 w-1" >
          <div className="truncate text-[22px] flex items-center w-full">
            <span className="mr-auto font-bold">
              {orderInfo[~~(tab) === ORDER_TAB_STATUS_ACL ? 'doc_cut':'cy_cut']?.substring(5)}
              <span className={'text-[16px] font-normal mx-2'}>{
                orderInfo[~~(tab) === ORDER_TAB_STATUS_ACL ? 'doc_cut_time':'cy_cut_time'] ? 'PM' : 'AM'
              }</span>
            </span>
            <span className="text-[14px]" style={{ color: end ? '#C0C0C0' : CARD_COLORS[orderInfo.color].text }}>
              {~~tab === ORDER_TAB_STATUS_ACL ?'DOC CUT': 'CY CUT'}
            </span>
          </div>
          <div className="truncate">
            <PortFullName country={orderInfo['loading_country_name']} port={orderInfo['loading_port_name']} placeholder="POL" />
            {' - '}
            <PortFullName country={orderInfo['delivery_country_name']} port={orderInfo['delivery_port_name']} placeholder="POD" />
          </div>
        </div>
      </div>
      <div className="flex justify-between p-2 items-baseline">
        <div className="truncate text-sm">{orderInfo.containers?.[0]?.['common'] || 'COM'}</div>
        <div>{orderInfo['bkg_no']}</div>
      </div>
    </div>
  );
}

const OrderGroup = ({ title, list, loading, filter, children }) => {
  return (
    <div className="bg-white mb-[20px] rounded-lg shadow p-4">
      <div className="flex justify-between">
        <div>{title}</div>
        <div>{filter}</div>
      </div>
      <div className="grid grid-cols-4 lg:grid-cols-6 gap-8 flex-wrap mt-4 [&:has(.ant-empty)]:!grid-cols-1">
        <SkeletonList
          empty={<Empty></Empty>}
          list={list}
          loading={loading}
          skeletonCount={8}
          skeletonClassName="!w-full !h-32"
        >{children}</SkeletonList>
      </div>
    </div>
  )
}

function OrderList() {
  const { tab } = useParams()
  const [filterForm] = Form.useForm()
  const { list, reload, loading } = useTabOrderList(tab, filterForm)
  const [compList, loadingComp] = useCompleteList(tab)
  const order = useRef(null)
  const navigate = useNavigate()
  const userPicker = useRef(null);
  const [topNode, topNodeLoading] = useAsyncCallback(async () => {
    await request('/admin/order/change_top').data({
      'id': order.current['id'],
      'node_status': tab,
      'is_top': 1
    }).send()
    pubSub.publish('Info.Toast', 'TOP PAGEに', 'success')
    reload()
  })

  const [menu, open, close] = useContextMenu(
    <div
      className="
        fixed w-32 z-50 border cursor-OrderListinter
        text-center bg-white shadow-md
        leading-8 rounded-md overflow-hidden
      "
      onClick={e => e.stopPropagation()}
    >
      <div
        className='text-primary hover:text-white hover:bg-primary active:bg-primary-600'
        onClick={async () => {
          close()
          const user = await userPicker.current.pick()
          const params = {
            'order_id': order.current.id,
            'node_id': order.current.node.id,
            'user_id': user
          }
          await request('admin/order/dispatch').data(params).send()
          pubSub.publish('Info.Toast', '仲間に協力', 'success')
        }}
      >仲間に協力</div>
      <div
        className='text-primary hover:text-white hover:bg-primary active:bg-primary-600'
        onClick={topNode}
      >
        {topNodeLoading && <LoadingOutlined className="mr-2"/>}
        TOP PAGEに
      </div>
    </div>
  )
  /**
   *
   * @param {Event} e
   * @param {Object} item
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
        filter={<OrderFilter form={filterForm} onSearch={reload} />}
      >
        {item => (
          <Card
            tab={tab}
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
            tab={tab}
            end
            key={item['id']}
            onClick={() => navigate(`/orderDetail/${item['order_id']}`)}
            orderInfo={item.order}
          />
        )}
      </OrderGroup>
      {menu}
      <UserPicker ref={userPicker} />
    </div>
  );
}

export default OrderList;
