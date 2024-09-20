import { request } from "@/apis/requestBuilder";
import { useEffect, useState, useRef } from "react";
import { useAsyncCallback, useCompleteList, useContextMenu } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import pubSub from "@/helpers/pubSub";
import { useParams } from "react-router-dom";
import SkeletonList from "@/components/SkeletonList";
import classNames from "classnames";
import PortFullName from "@/components/PortFullName";
import OrderFilter from "@/components/OrderFilter";
import { Form } from "antd";
import { CARD_COLORS } from "./common";
import TopBadge from "@/components/TopBadge";
import { EXPORT_NODE_NAMES } from "@/constant";
import * as Icon from '@/components/Icon'
import UserPicker from "@/components/UserPicker.jsx";
const useTabOrderList = (type, form) => {
  const [list, setList] = useState([]);
  const [reload, loading] = useAsyncCallback(async () => {
    const res = await request('/admin/order/container_list').get({
      'node_status': type,
      ...form.getFieldsValue()
    }).send()
    setList(res)
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
  end,
  top,
  type = 0,
  transCom = '',
  customer = '',
  address = '',
  date,
  time,
  bkgNo = '',
  pod = ['', ''],
  pol = ['', ''],
  ...props
}) {
  const grayscale = {};
  if (end) {
    grayscale.filter = "grayscale(100%)";
  }
  const md = date.substring(5);
  const hm = time.split('-')[0] || '00:00';
  return (
    <div
      className="flex flex-col border-2 border-t-[6px] rounded cursor-pointer overflow-hidden relative"
      style={{
        borderColor: CARD_COLORS[type].border,
        ...grayscale
      }}
      {...props}
    >
      {top && <TopBadge>{top}</TopBadge>}
      <div className="flex p-2 overflow-hidden">
        <Icon.Exit color={CARD_COLORS[type].border} className="text-[24px] mt-1" />
        <div className="ml-2 flex-1 w-1 text-[#484848]">
          <div className="truncate">{address || 'VAN場所'}</div>
          <div className="truncate">
            <PortFullName country={pol[0]} port={pol[1]} placeholder="POL" />
            {' - '}
            <PortFullName country={pod[0]} port={pod[1]} placeholder="POD" />
          </div>
        </div>
      </div>
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col items-center">
          <div className="flex items-center text-[24px] font-bold text-[#2E2D2D]">
            <div>{customer[0]}</div>
            <div className="w-[2px] h-[24px] bg-gray-300 mx-4"></div>
            <div>{transCom?.[0]}</div>
          </div>
          <div className="text-sm text-gray-400 mt-2">{bkgNo}</div>
        </div>
        <div
          className="flex justify-center items-center flex-col px-2"
          style={{ background: CARD_COLORS[type].bg }}
        >
          <div>{md}</div>
          <div>{hm}</div>
        </div>
      </div>
    </div>
  );
}

const OrderGroup = ({
  loading,
  list,
  title,
  filter,
  children = () => null
}) => {
  return (
    <div className="bg-white mb-[20px] rounded-lg shadow p-4">
      <div className="flex justify-between">
        <div>{title}</div>
        {filter}
      </div>
      <div
        className={classNames(
          'grid grid-cols-4 2xl:grid-cols-5 gap-8 flex-wrap mt-4 [&>*]:!h-[140px]',
          '[&:has(.ant-empty)]:!grid-cols-1'
        )}
      >
        <SkeletonList
          skeletonCount={10}
          skeletonClassName="!w-full !h-full"
          loading={loading}
          list={list}
        >{children}</SkeletonList>
      </div>
    </div>
  )
}

function ContainerListContent() {
  const { tab } = useParams()
  const [filterForm] = Form.useForm()
  const { list, reload, loading } = useTabOrderList(tab, filterForm)
  const [compList, loadingComp] = useCompleteList(tab)
  const order = useRef(null)
  const navigate = useNavigate()
  const userPicker = useRef(null);
  const [topNode, topNodeLoading] = useAsyncCallback(async () => {
    close()
    await request('/admin/order/change_top').data({
      'id': order.current['order_id'],
      'is_top': 1,
      'node_status': tab
    }).send()
    pubSub.publish('Info.Toast', '已置顶任务', 'success')
    reload()
  })

  const [menu, open, close] = useContextMenu(
    <div
      className="
        fixed w-32 z-50 border cursor-pointer
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
            'order_id': order.current.order_id,
            'node_id': order.current.order_node_id,
            'user_id': user
          }
          await request('admin/order/dispatch').data(params).send()
          pubSub.publish('Info.Toast', '已指派', 'success')
        }}
      >指派任务</div>
      <div
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
        filter={<OrderFilter form={filterForm} onSearch={reload} />}
      >
        {item => (
          <Card
            onContextMenu={e => contextMenuHandle(e, item)}
            onClick={() => navigate(`/orderDetail/${item['order_id']}`)}
            customer={item['company_name']}
            transCom={item['trans_com_name']}
            top={item['is_top'] ? EXPORT_NODE_NAMES[item['node_id']] : null}
            key={item['id']}
            pol={[item['loading_country_name'], item['loading_port_name']]}
            pod={[item['delivery_country_name'], item['delivery_port_name']]}
            bkgNo={item['bkg_no']}
            type={item['color']}
            address={item['van_place']}
            date={item['deliver_date']}
            time={item['deliver_time_range']}
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
              onClick={() => navigate(`/orderDetail/${item['order']['id']}`)}
              customer={item['order']['company_name']}
              transCom={item['order']['details'][0]['trans_com_name']}
              key={item['order']['id']}
              pol={[item['order']['loading_country_name'], item['order']['loading_port_name']]}
              pod={[item['order']['delivery_country_name'], item['order']['delivery_port_name']]}
              bkgNo={item['order']['bkg_no']}
              type={item['order']['color']}
              address={item['order']['details'][0]['van_place']}
              date={item['order']['details'][0]['deliver_date']}
              time={item['order']['details'][0]['deliver_time_range']}
              end
            />
        )}
      </OrderGroup>
      <UserPicker ref={userPicker} />
      {menu}
    </div>
  );
}

export default ContainerListContent;
