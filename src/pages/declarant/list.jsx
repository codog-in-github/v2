import classnames from "classnames";
import { Avatar } from "antd";
import { request } from "@/apis/requestBuilder";
import { useState } from "react";
import { useEffect } from "react";
import { useAsyncCallback } from "@/hooks";
import dayjs from "dayjs";
import { CUSTOMS_STATUS_END, ORDER_TYPE_EXPORT } from "@/constant";
import { Spin } from "antd";
import pubSub from "@/helpers/pubSub";
import { createContext } from "react";
import { useContext } from "react";
import PortFullName from "@/components/PortFullName";
import {useNavigate} from "react-router-dom";

const statusNames = '未,申,質,査,許'.split(',')
const ListContext = createContext({ setStatus: async () => {} })
const getList = async (filters) => {
  const rep = await request('/admin/customs/list').get(filters).send()
  const list = []
  for(const date in rep) {
    const data = []
    const group = {
      id: date,
      date: dayjs(date).format("YYYY年MM月DD日"),
      all: rep[date].length,
      can: 0,
      data
    }
    for(const order of rep[date]) {
      if(order.customs_status < CUSTOMS_STATUS_END) {
        group.can++
      }
      data.push({
        id: order.id,
        name: order.company_name,
        kou: order.order_type === ORDER_TYPE_EXPORT ? "出" : "入",
        pol: [order.loading_country_name, order.loading_port_name],
        pod: [order.delivery_country_name, order.delivery_port_name],
        fan: order.order_no,
        status: order.customs_status,
        disabled: !order.is_confirm
      })
    }
    list.push(group)
  }
  return list
}
const DeclarantItem = ({ el }) => {
  const [status, setStatus] = useState(el.status)
  const { setStatus: setStatusApi } = useContext(ListContext)
  const navigate = useNavigate()

  useEffect(() => {
    setStatus(el.status)
  }, [el.status])
  return (
    <div
      className="grid grid-cols-[1fr_1fr_2fr_2fr_3fr] [&>*]:mx-auto bg-white text-[14px]  h-[50px] items-center even:bg-gray-100"
      onClick={() => {
        navigate('/declarant/detail/' + el.id)
      }}
    >
      <Avatar
        size={30}
        style={{ backgroundColor: "#484848", fontSize: "14px" }}
      >
        {el.name.at(0)}
      </Avatar>
      <div>{el.kou}</div>
      <div>
        <PortFullName
          country={el.pol[0]}
          port={el.pol[1]}
          placeholder="POL"
        />
        {' - '}
        <PortFullName
          country={el.pod[0]}
          port={el.pod[1]}
          placeholder="POD"
        />
      </div>
      <div>{el.fan}</div>
      {!el.disabled && (
        <div
          className="w-[180px] flex justify-around bg-gray-200 rounded-lg text-[15px]"
          onClick={e => e.stopPropagation()}
        >
          {statusNames.map((name, i) => (
            <span
              key={i}
              className={classnames(
                "rounded-full py-[2px] px-[10px] cursor-pointer",
                i === status &&  "bg-blue-500 text-white",
              )}
              onClick={() => {
                if(i <= status){
                  return
                }
                setStatusApi(el.id, i).then(() => {
                  setStatus(i)
                })
              }}
            >{name}</span>
          ))}
        </div>
      )}
    </div>
  );
};

const DeclarantCard = ({ item }) => {
  const curCardId = 1;

  const data = item.data || [];
  return (
    <div className="w-[600px] flex-none mr-[50px] border  h-full">
      <div
        className={classnames(
          "text-center py-[5px] text-[18px] border-b border-indigo-300 bg-blue-200 h-[40px]",
          curCardId === item.id && "bg-blue-500 text-white"
        )}
      >
        <span>{item.date}</span>
        <span className="ml-5">
          {item.all}件/残{item.can}件
        </span>
      </div>
      <div
        className={classnames(
          "grid grid-cols-[1fr_1fr_2fr_2fr_3fr] [&>*]:mx-auto bg-blue-200 text-[16px] py-[8px] h-[40px]",
          curCardId === item.id && "bg-blue-500 text-white"
        )}
      >
        <div>お客様</div>
        <div>入/出口</div>
        <div>POL-POD</div>
        <div>社内番号</div>
        <div className="w-[180px] flex justify-around">
          {statusNames.map((name, i) => (
            <span key={i}>{name}</span>
          ))}
        </div>
      </div>

      <div className="overflow-y-auto" style={{ height: "calc(100% - 80px)" }}>
        {data.map((el) => (
          <DeclarantItem key={el.id} el={el} />
        ))}
      </div>
    </div>
  );
};

const DeclarantList = () => {
  const [data, setData] = useState([])
  const [getListHandle, loading] = useAsyncCallback(async (filters) => {
    const data = await getList(filters)
    setData(data)
  })
  useEffect(() => {
    getListHandle()
    pubSub.subscribe("None.Customs.List.Filter", getListHandle)
    return () => {
      pubSub.unsubscribe("None.Customs.List.Filter", getListHandle)
    }
  }, [])
  const [setStatus, loadingStatus] = useAsyncCallback(async (id, status) => {
    await request('/admin/customs/set_status').post({ id, status }).send()
    pubSub.publish("Info.Toast", '通关状态修改成功', 'success')
  })
  return (
    <ListContext.Provider value={{ setStatus }}>
      <div className="h-full w-full">
        <Spin spinning={loading}  fullscreen />
        <div className="text-gray-400 text-[15px] h-[25px]">
          * 自社通关编号表示
        </div>

        <div
          className="bg-white px-[20px] py-[15px] overflow-x-auto  flex flex-nowrap"
          style={{ height: "calc(100% - 25px)" }}
        >
          {data.map((item) => (
            <DeclarantCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </ListContext.Provider>
  );
};

export default DeclarantList;
