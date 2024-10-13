import { request } from "@/apis/requestBuilder";
import { useEffect, useState, useRef } from "react";
import { useAsyncCallback, useContextMenu } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import pubSub from "@/helpers/pubSub";
import SkeletonList from "@/components/SkeletonList";
import { ORDER_TAB_STATUS_REQUEST} from "@/constant";
import { Avatar, Form } from "antd";
import OrderFilter from "@/components/OrderFilter";
import PortFullName from "@/components/PortFullName";
import { CARD_COLORS } from "./common";
import TopBadge from "@/components/TopBadge";
import UserPicker from "@/components/UserPicker.jsx";

const useReqList = (form) => {
  const [list, setList] = useState({});
  const [reload, loading] = useAsyncCallback(async () => {
    const res = await request('/admin/order/req_list')
      .get(form.getFieldsValue()).send()
    setList(res)
  })
  useEffect(() => {
    form.setFieldsValue({
      'filter_key': 'bkg_no',
      'filter_value': '',
    })
    reload()
  }, [])
  return { list, reload, loading }
}

const groups = [
  { color: 0, title: '作成待', key: 'undo' },
  { color: 2, title: '発送待', key: 'unsend' },
  { color: 2, title: '入金待', key: 'unentry' },
]

const ListGroup = ({
  title,
  color,
  list,
  onContextMenu,
  loading,
  filter
}) => {
  const navigate = useNavigate()
  return (

    <div className="bg-white mb-[20px] rounded-lg shadow p-4">
      <div className="flex justify-between">
        <div>{title}</div>
        <div>{filter}</div>
      </div>
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
      className="border-2 border-t-[6px] rounded h-[120px] cursor-pointer overflow-hidden text-[#484848] relative"
      style={{
        borderColor: CARD_COLORS[color].border,
        ...grayscale
      }}
      {...props}
    >
      {!!orderInfo.request_book_node.is_top && <TopBadge>请</TopBadge>}
      <div className="flex p-2 overflow-hidden" style={{ background: CARD_COLORS[color].bg }}>
        <Avatar
          size={40}
          style={{ backgroundColor: CARD_COLORS[color].border }}
        >
          {orderInfo['short_name']?.[0]}
        </Avatar>
        <div className="ml-2 flex-1 w-1" >
          <div className="truncate text-[22px] flex items-center w-full">
            <span className="mr-auto">
              {orderInfo['cy_cut']?.substring(5)}
              <span className={'text-[16px] font-normal mx-2'}>{
                orderInfo['cy_cut_time'] ? 'PM' : 'AM'
              }</span>
            </span>
            <span className="text-[14px]" style={{color: CARD_COLORS[color].text}}>CY CUT</span>
          </div>
          <div className="truncate">
            <PortFullName
              country={orderInfo['loading_country_name']}
              port={orderInfo['loading_port_name']}
              placeholder="POL"
            />
            {' - '}
            <PortFullName
              country={orderInfo['delivery_country_name']}
              port={orderInfo['delivery_port_name']}
              placeholder="POD"
            />
          </div>
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
  const [filterForm] = Form.useForm()
  const { list, reload, loading } = useReqList(filterForm)
  const userPicker = useRef(null);
  const order = useRef(null)
  const [topNode, topNodeLoading] = useAsyncCallback(async () => {
    close()
    await request('/admin/order/change_top').data({
      'id': order.current['id'],
      'node_status': ORDER_TAB_STATUS_REQUEST,
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
            'node_id': order.current.request_book_node.id,
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
      { groups.map((item, i) => (
        list[item.key] && (
          <ListGroup
            filter={ i === 0 && <OrderFilter form={filterForm} onSearch={reload} /> }
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
      <UserPicker ref={userPicker} />
    </div>
  );
}

export default RequestBookPage;
