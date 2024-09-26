import {useEffect, useMemo, useState} from "react";
import {request} from "@/apis/requestBuilder.js";
import { get } from 'lodash'

import {
  DEPARTMENT_KOBE,
  DEPARTMENT_KYUSHU,
  DEPARTMENT_OSAKA,
  ORDER_TYPE_EXPORT,
  ORDER_TYPE_IMPORT
} from "@/constant/index.js";
import classNames from "classnames";

const departments = [
  DEPARTMENT_OSAKA,
  DEPARTMENT_KOBE,
  DEPARTMENT_KYUSHU
]

const orderTypes = [
  ORDER_TYPE_EXPORT,
  ORDER_TYPE_IMPORT
]

const departmentName = (department) => {
  switch (department) {
    case DEPARTMENT_OSAKA:
      return '大阪'
    case DEPARTMENT_KOBE:
      return '神戸'
    case DEPARTMENT_KYUSHU:
      return '九州'
  }
}

const bgColor = (department) => {
  switch (department) {
    case DEPARTMENT_OSAKA:
      return 'bg-[#05C9E0]'
    case DEPARTMENT_KOBE:
      return 'bg-[#426CF6]'
    case DEPARTMENT_KYUSHU:
      return 'bg-[#FD7556]'
  }
}

const DepartmentItem = ({ department, total = 0, rate = 0 }) => {
  return (
    <div
      className={classNames(
        bgColor(department),
        'text-white px-4 py-3 rounded flex-1'
      )}
    >
      <div>{departmentName(department)}</div>
      <div className={'text-[30px]'}>{total}</div>
      <div className={'flex items-center'}>
        <div className={'rounded-full w-4 h-4 border-4 mr-2 border-white opacity-50'}></div>
        <div>{rate}%</div>
      </div>
    </div>
  )
}

const reduce = (data, fn) => {
  return () => {
    let total = 0
    for (const department of departments) {
      for (const orderType of orderTypes) {
        total += fn(data, department, orderType)
      }
    }
    return total
  }
}

const reduceByDepartment = (data, department, fn) => {
  let total = 0
  for (const orderType of orderTypes) {
    total += fn(data, department, orderType)
  }
  return total
}
const OrderTotal = () => {
  const [data, setData] = useState(null)
  const [departmentDataType, setDepartmentDataType] = useState('total')

  const totalOrderCount = useMemo(reduce(data, (data, department, orderType) => {
    return get(data, [department, orderType, 'total'], 0)
  }), [data]);

  const totalDoneCount = useMemo(reduce(data, (data, department, orderType) => {
    return get(data, [department, orderType, 'done'], 0)
  }), [data]);


  const departmentData = useMemo(() => {
    const data = {}
    let doneFn = (data, department, orderType) => 0
    let totalFn = (data, department, orderType) => 0
    switch (departmentDataType) {
      case 'total':
        totalFn = (data, department, orderType) => get(data, [department, orderType, 'total'], 0)
        doneFn = (data, department, orderType) => get(data, [department, orderType, 'done'], 0)
        break
      case 'import':
        doneFn = (data, department, orderType) => {
          if(orderType !== ORDER_TYPE_IMPORT) {
            return 0
          }
          return get(data, [department, orderType, 'lastMonthDone'], 0)
        }
        totalFn = (data, department, orderType) => {
          if(orderType !== ORDER_TYPE_IMPORT) {
            return 0
          }
          get(data, [department, orderType, 'lastMonthTotal'], 0)
        }
        break
      case 'export': {

        doneFn = (data, department, orderType) => {
          if(orderType !== ORDER_TYPE_EXPORT) {
            return 0
          }
          return get(data, [department, orderType, 'lastMonthDone'], 0)
        }
        totalFn = (data, department, orderType) => {
          if(orderType !== ORDER_TYPE_EXPORT) {
            return 0
          }
          get(data, [department, orderType, 'lastMonthTotal'], 0)
        }
        break
      }
    }
    for(const department of departments) {
      const total = reduceByDepartment(data, department, totalFn)
      const done = reduceByDepartment(data, department, doneFn)
      const rate = total ? (done / total).toFixed(0) : 0
      data[department] = { total, rate }
    }
    return data
  }, [departmentDataType, data])

  useEffect(() => {
    request('admin/acc/order_total').get().send()
      .then(setData)
  }, [])

  return (
    <div className={'px-4 pt-[40px] pb-[33px] h-full flex flex-col'}>
      <div className={'flex'}>
        <div className={'flex-1 border-r'}>
          <div className={'text-[#585D6E] text-lg'}>总案件数</div>
          <div className={'text-[40px] font-bold'}>{totalOrderCount}</div>
          <div>{(totalDoneCount / totalOrderCount * 100).toFixed(0)}% <span className={'text-gray-500'}>完成</span></div>
        </div>

        <div className={'flex-1 pl-[27px]'}>
          <div className={'text-[#585D6E] text-lg'}>近一个月</div>
          <div className={'text-[40px] font-bold'}>324</div>
          <div className={'text-gray-500 flex justify-between'}>
            <div>
              <span className={'text-[#37832E]'}>78%</span>
              <span>出口</span>
            </div>
            <div>
              <span className={'text-[#37832E]'}>22%</span>
              <span>进口</span>
            </div>
          </div>
        </div>
      </div>

      <div className={'mt-4 bg-[#f2f4f8] flex-1 flex px-[30px] py-[20px] gap-[20px]'}>
        {
          departments.map(department => (
            <DepartmentItem
              key={department}
              department={department}
              total={departmentData[department].total}
              rate={departmentData[department].rate}
            />
          ))
        }
      </div>
    </div>
  )
}

export default OrderTotal
