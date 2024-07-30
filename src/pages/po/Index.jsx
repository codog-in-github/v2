import "./index.scss";
import moment from "moment";
import { themeColor } from "@/helpers/color";
import { request } from "@/apis/requestBuilder";
import { useEffect } from "react";
import { useState } from "react";
import { useAsyncCallback, useContextMenu } from "@/hooks";
import { useRef } from "react";

const useTabOrderList = (type) => {
  const [list, setList] = useState([]);
  const { callback, loading } = useAsyncCallback(async () => {
    const res = await request('/admin/order/tab_order_list').get({
      'node_status': type
    }).send()
    setList(res)
  })
  useEffect(() => {
    callback()
  }, [])
  return {
    list,
    reload: callback,
    loading
  }
}

function Card({ end, type = "success", address = "", date, ...props }) {
  const grayscale = {};
  if (end) {
    grayscale.filter = "grayscale(100%)";
  }
  const m = moment(date);
  const md = m.format("MM-DD");
  const hm = m.format("HH:mm");
  return (
    <div
      className="border-2 border-t-[6px] rounded"
      style={{
        borderColor: themeColor(type, 60),
        ...grayscale
      }}
      {...props}
    >
      
      <div className="flex p-2">
        <div
          className="rounded-full w-8 h-8 leading-8 text-center text-white"
          style={{ backgroundColor: themeColor(type, 60) }}
        ></div>
        <div className="ml-2">
          <div>{address}</div>
          <div>KOBE-SHANGHAI</div>
        </div>
      </div>
      <div className="flex">
        <div className="flex-1 flex flex-col items-center  p-2">
          <div className="flex text-lg font-bold">
            <div>苏</div>
            <div className="w-0.5 h-full bg-gray-300 mx-4"></div>
            <div>杭</div>
          </div>
          <div className="text-sm text-gray-400 mt-2">GQF413SK202</div>
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
  const { list } = useTabOrderList(1)
  const order = useRef(null)
  
  const [menu, open] = useContextMenu(
    <div
      className="
        fixed w-24 z-50 border cursor-pointer
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
        onClick={() => {}}
      >置顶任务</div>
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
        <div className="flex gap-8 flex-wrap mt-4">
          {list.map(item => (
            <Card
              onContextMenu={e => contextMenuHandle(e, item)}
              key={item['id']}
              type="danger"
              address="中国浙江省宁波市鄞州区中…"
              date={Date.now()}
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
