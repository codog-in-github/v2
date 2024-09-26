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
import {combie} from "@/helpers/index.js";

const departments = [
  DEPARTMENT_KOBE,
  DEPARTMENT_OSAKA,
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

const sum = (data, paths) => {
  let sum = 0
  for (const path of paths) {
    sum += get(data, path, 0)
  }
  return sum
}

const OrderTotal = () => {
  const [data, setData] = useState(null)
  const [isLastMonthDepartmentData, setIsLastMonthDepartmentData] = useState(false)

  const total = useMemo(() => sum(data, combie(departments, orderTypes, ['total'])), [data])
  const done = useMemo(() => sum(data, combie(departments, orderTypes, ['done'])), [data]);
  const lastMonthTotal = useMemo(() => sum(data, combie(departments, orderTypes, ['lastMonthTotal'])), [data])
  const lastMonthImport = useMemo(() => sum(data, combie(departments, [ORDER_TYPE_IMPORT], ['lastMonthTotal'])), [data])
  const importRate = lastMonthTotal ? (lastMonthImport / lastMonthTotal * 100).toFixed(0) : 0
  const exportRate = lastMonthTotal ? (100 - importRate) : 0

  const departmentData = useMemo(() => {
    const result = {}
    let dataKey = isLastMonthDepartmentData ? 'lastMonthTotal' : 'total'
    const allDepartmentTotal = isLastMonthDepartmentData ? total : lastMonthTotal
    for(const department of departments) {
      const singleDepartmentTotal = sum(data, combie([department], orderTypes, [dataKey]))
      const rate = allDepartmentTotal ? (singleDepartmentTotal / allDepartmentTotal * 100).toFixed(0) : 0
      result[department] = { total: singleDepartmentTotal, rate }
    }

    return result
  }, [isLastMonthDepartmentData, data])

  useEffect(() => {
    request('admin/acc/order_total').get().send()
      .then(setData)
  }, [])

  return (
    <div className={'px-4 pt-[40px] pb-[33px] h-full flex flex-col'}>
      <div className={'flex cursor-pointer'}>
        <div className={'flex-1 border-r'} onClick={() => setIsLastMonthDepartmentData(false)}>
          <div className={'text-[#585D6E] text-lg'}>总案件数</div>
          <div className={'text-[40px] font-bold'}>{total}</div>
          <div>{(done / total * 100).toFixed(0)}% <span className={'text-gray-500'}>完成</span></div>
        </div>

        <div className={'flex-1 pl-[27px]'} onClick={() => setIsLastMonthDepartmentData(true)}>
          <div className={'text-[#585D6E] text-lg'}>近一个月</div>
          <div className={'text-[40px] font-bold'}>{lastMonthTotal}</div>
          <div className={'text-gray-500 flex justify-between'}>
            <div>
              <span className={'text-[#37832E]'}>{exportRate}%</span>
              <span>出口</span>
            </div>
            <div>
              <span className={'text-[#37832E]'}>{importRate}%</span>
              <span>进口</span>
            </div>
          </div>
        </div>
      </div>

      <div className={'mt-4 bg-[#f2f4f8] flex-1 flex px-[30px] py-[20px] gap-[20px] relative'}>
        <div
          className={'bg-[#f2f4f8] w-4 h-4 absolute -top-2 rotate-45 transition-all'}
          style={{ left: isLastMonthDepartmentData ? '70%' : '20%' }}
        ></div>
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
