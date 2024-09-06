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
import classNames from "classnames";
import PortFullName from "@/components/PortFullName";
const useTabOrderList = (type) => {
  const [list, setList] = useState([]);
  const [reload, loading] = useAsyncCallback(async () => {
    const res = await request('/admin/order/container_list').get({
      'node_status': type
    }).send()
    setList(res)
  })
  useEffect(() => {
    reload()
  }, [type])
  return { list, reload, loading }
}
const colors = ['danger', 'warning', 'success']
function Card({
  end,
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
      className="border-2 border-t-[6px] rounded cursor-pointer overflow-hidden"
      style={{
        borderColor: themeColor(colors[type], 60),
        ...grayscale
      }}
      {...props}
    >

      <div className="flex p-2 overflow-hidden">
        <div
          className="rounded-full w-8 h-8 leading-8 text-center text-white flex-shrink-0"
          style={{ backgroundColor: themeColor(colors[type], 60) }}
        ></div>
        <div className="ml-2 flex-1 w-1">
          <div className="truncate">{address || 'VAN場所'}</div>
          <div className="truncate">
            <PortFullName country={pol[0]} port={pol[1]} placeholder="POL" />
            {' - '}
            <PortFullName country={pod[0]} port={pod[1]} placeholder="POD" />
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="flex-1 flex flex-col items-center  p-2">
          <div className="flex text-lg font-bold">
            <div>{customer[0]}</div>
            <div className="w-0.5 h-full bg-gray-300 mx-4"></div>
            <div>{transCom?.[0]}</div>
          </div>
          <div className="text-sm text-gray-400 mt-2">{bkgNo}</div>
        </div>
        <div
          className="flex justify-center items-center flex-col px-2"
          style={{ background: themeColor(colors[type], 90) }}
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
  children = () => null
}) => {
  return (
    <div className="bg-white mb-[20px] rounded-lg shadow p-4">
      <div>{title}</div>
      <div
        className={classNames(
          'grid grid-cols-4 lg:grid-cols-5 gap-8 flex-wrap mt-4 [&>*]:!h-[140px]',
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

function Po() {
  const { tab } = useParams()
  const { list, reload, loading } = useTabOrderList(tab)
  const [compList, loadingComp] = useCompleteList(tab)
  const order = useRef(null)
  const navigate = useNavigate()
  const [topNode, topNodeLoading] = useAsyncCallback(async () => {
    await request('/admin/order/change_top').data({
      'id': order.current['order_id'],
      'node_status': tab,
    }).send()
    pubSub.publish('Info.Toast', '已置顶任务', 'success')
    reload()
  })

  const [menu, open] = useContextMenu(
    <div
      className="
        fixed w-32 z-50 border cursor-pointer
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
      <OrderGroup
        title="未完成"
        loading={loading}
        list={list}
      >
        {item => (
          <Card
            onContextMenu={e => contextMenuHandle(e, item)}
            onClick={() => navigate(`/orderDetail/${item['order_id']}`)}
            customer={item['company_name']}
            transCom={item['trans_com_name']}
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
              date={item['order']['deliver_time']}
              time={item['order']['deliver_time_range']}
              end
            />
        )}
      </OrderGroup>
      {menu}
    </div>
  );
}

export default Po;
