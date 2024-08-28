import { useState } from "react";
import { Select, Avatar } from "antd";
import { BKG_TYPES, EXPORT_NODE_NAMES } from "@/constant";
import { useEffect } from "react";
import { request } from "@/apis/requestBuilder";
import dayjs from "dayjs";
import { Button, Space, Spin } from "antd/lib";
import { useAsyncCallback } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import classNames from "classnames";

const bkgTypes = Object.entries(BKG_TYPES)
  .map(([value, label]) => ({
    label, value: Number(value)
  }))

const useCalendarList = () => {
  const start = useRef(dayjs().startOf("week"))
  const bkgType = useRef(null)
  const [list, setList] = useState([]);
  const moveNext = () => {
    start.current = start.current.add(1, "week")
    reload()
  };
  const movePrev = () => {
    start.current = start.current.subtract(1, "week")
    reload()
  };
  const moveCurrent = () => {
    start.current = dayjs()
    reload()
  };
  const changeType = (val) => {
    bkgType.current = val
    reload()
  }
  const [reload, loading] = useAsyncCallback(async () => {
    const rep = await request('/admin/order/list_by_calendar').get({
      'start': start.current.format("YYYY-MM-DD"),
      'end': start.current.add(6, "day").format("YYYY-MM-DD"),
      'bkg_type': bkgType.current
    }).send()
    const weeks = []
    for(let i = 0; i< 7; i++) {
      const list = []
      const day = start.current.add(i, "day")
      const ymd = day.format("YYYY-MM-DD")
      if(rep[ymd]) {
        list.push(...rep[ymd].map(item => ({
          id: item['id'],
          avatar: item['company_name'][0],
          type: EXPORT_NODE_NAMES[item['active_nodes']?.[0]?.['node_id']] ?? '',
          ben: item['containers'].length,
          loading: `${item['loading_country_name']?.split('/')[1]?.trim() ?? ''}${item['loading_port_name']?.split('/')[1]?.trim() ?? ''}`,
          delivery: `${item['delivery_country_name']?.split('/')[1]?.trim() ?? ''}${item['delivery_port_name']?.split('/')[1]?.trim() ?? ''}`,
          bkgNo: item['bkg_no'],
        })))
      }
      weeks.push({
        id: i,
        title: start.current.add(i, "day").format("ddd"),
        date: start.current.add(i, "day").format("M-D"),
        children: list,
      })
    }
    setList(weeks)
  })
  useEffect(() => {
    reload()
  }, [])
  return {
    loading, moveNext, movePrev, start, moveCurrent, list, changeType
  }
}

const CalendarItem = ({ item }) => {
  const navigate = useNavigate()
  return (
    <div className={classNames("border-r border-gray-500 text-[15px] first:border-l flex-1", item.className)}>
      <div className="text-center text-gray-600 text-[16px] mb-1">
        {item.title}
      </div>
      <div className="text-center text-gray-600 mb-2">{item.date}</div>
      {item.children.map((el) => (
        <div
          className="flex items-center justify-around odd:bg-gray-100 text-gray-700 cursor-pointer"
          onClick={() => navigate(`/orderDetail/${el.id}`)}
          key={el.id}
        >
          <Avatar size={26} style={{ backgroundColor: "#313131" }}>
            {el.avatar}
          </Avatar>
          <div>{el.ben}本</div>
          <div className="flex flex-col">
            <div className="text-nowrap">{el.loading}</div>
            <div className="text-nowrap">{el.delivery}</div>
          </div>
          <div className="break-words w-12">{el.bkgNo}</div>
          {el.type && (
            <Avatar size={26} style={{ backgroundColor: "#FD7556" }}>
              {el.type}
            </Avatar>
          )}
        </div>
      ))}
    </div>
  );
};

const OrderCalendar = () => {
  const { start, moveNext, moveCurrent, movePrev, changeType, loading, list } = useCalendarList();
  return (
    <div className="main-content h-full flex flex-col">
      <div className="flex justify-end relative">
        <div className="absolute left-0 right-0 m-auto w-[100px] text-center text-gray-700 text-[22px] font-bold">
          {start.current.format("YYYY-MM")}
        </div>
        <div>
          <Select
            className="mr-4"
            options={bkgTypes}
            placeholder="BKG TYPE"
            style={{ width: 160 }}
            onChange={changeType}
            allowClear
          />
          <Space.Compact>
            <Button onClick={movePrev}>前周</Button>
            <Button onClick={moveCurrent} type="primary">本周</Button>
            <Button onClick={moveNext}>翌周</Button>
          </Space.Compact>
        </div>
      </div>

      <div className="flex-1 flex mt-4">
        {list.map((item) => (
          <CalendarItem key={item.id} item={item} />
        ))}
      </div>
      <Spin spinning={loading}  fullscreen />
    </div>
  );
};
export default OrderCalendar;
