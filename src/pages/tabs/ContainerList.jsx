import { themeColor } from "@/helpers/color";
import { request } from "@/apis/requestBuilder";
import { useEffect, useState, useRef } from "react";
import { useAsyncCallback, useContextMenu } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import pubSub from "@/helpers/pubSub";
import { ORDER_TAB_STATUS_PO } from "@/constant";
import { useParams } from "react-router-dom";

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

function Card({
  end,
  type = "success",
  transCom = '',
  customer = '',
  address = '',
  date,
  bkgNo = '',
  pod = '',
  pol = '',
  ...props
}) {
  const grayscale = {};
  if (end) {
    grayscale.filter = "grayscale(100%)";
  }
  const m = dayjs(date);
  const md = m.format("MM-DD");
  const hm = m.format("HH:mm");
  return (
    <div
      className="border-2 border-t-[6px] rounded cursor-pointer overflow-hidden"
      style={{
        borderColor: themeColor(type, 60),
        ...grayscale
      }}
      {...props}
    >
      
      <div className="flex p-2 overflow-hidden">
        <div
          className="rounded-full w-8 h-8 leading-8 text-center text-white flex-shrink-0"
          style={{ backgroundColor: themeColor(type, 60) }}
        ></div>
        <div className="ml-2 flex-1 w-1">
          <div className="truncate">{address}</div>
          <div>{pol.split('/')[0]}-{pod.split('/')[0]}</div>
        </div>
      </div>
      <div className="flex">
        <div className="flex-1 flex flex-col items-center  p-2">
          <div className="flex text-lg font-bold">
            <div>{customer[0]}</div>
            <div className="w-0.5 h-full bg-gray-300 mx-4"></div>
            <div>{transCom[0]}</div>
          </div>
          <div className="text-sm text-gray-400 mt-2">{bkgNo}</div>
        </div>
        <div
          className="flex justify-center items-center flex-col px-2"
          style={{ background: themeColor(type, 90) }}
        >
          <div>{md}</div>
          <div>{hm}</div>
        </div>
      </div>
    </div>
  );
}

function Po() {
  const { tab } = useParams()
  const { list, reload } = useTabOrderList(tab)
  const order = useRef(null)
  const navigate = useNavigate()
  const [topNode, topNodeLoading] = useAsyncCallback(async () => {
    await request('/admin/order/change_top').data({
      'id': order.current['order_id'],
      'node_status': tab,
      'is_top': 1
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
      <div
        type='primary'
        className='text-primary hover:text-white hover:bg-primary active:bg-primary-600'
        onClick={() => {}}
      >指派任务</div>
      <div
        type='primary'
        className='text-primary hover:text-white hover:bg-primary active:bg-primary-600'
        onClick={topNode}
      >
        {topNodeLoading && <LoadingOutlined className="mr-2" />}
        置顶任务</div>
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
      <div className="bg-white  m-2 rounded-lg shadow p-4">
        <div>未完成</div>
        <div className="grid grid-cols-4 lg:grid-cols-5 gap-8 flex-wrap mt-4">
          {list.map(item => (
            <Card
              onContextMenu={e => contextMenuHandle(e, item)}
              onClick={() => navigate(`/orderDetail/${item['order_id']}`)}
              customer={item['company_name']}
              transCom={item['trans_com']}
              key={item['id']}
              pol={item['loading_port_name']}
              pod={item['delivery_port_name']}
              bkgNo={item['bkg_no']}
              type="danger"
              address={item['van_place']}
              date={item['deliver_time']}
            />
          ))}
        </div>
      </div>
      <div className="bg-white  m-2 rounded-lg shadow p-4">
        <div>直近完了</div>
        <div className="flex gap-8 flex-wrap mt-4">
          <Card address="中国浙江省宁波市鄞州区中…" end date={Date.now()} />
          <Card address="中国浙江省宁波市鄞州区中…" end date={Date.now()} />
          <Card address="中国浙江省宁波市鄞州区中…" end date={Date.now()} />
          <Card address="中国浙江省宁波市鄞州区中…" end date={Date.now()} />
          <Card address="中国浙江省宁波市鄞州区中…" end date={Date.now()} />
          <Card address="中国浙江省宁波市鄞州区中…" end date={Date.now()} />
        </div>
      </div>
      {menu}
    </div>
  );
}

export default Po;
