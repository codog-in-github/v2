import {useEffect, useRef, useState} from "react";
import * as ECharts from "echarts";
import {DEPARTMENT_KOBE, DEPARTMENT_KYUSHU, DEPARTMENT_OSAKA} from "@/constant/index.js";
import dayjs from "dayjs";
import {request} from "@/apis/requestBuilder.js";
import {get} from "lodash";
import {Select} from "antd";
import color from 'color'

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
const departmentColor = (department) => {
  switch (department) {
    case DEPARTMENT_OSAKA:
      return '#05C9E0'
    case DEPARTMENT_KOBE:
      return '#426CF6'
    case DEPARTMENT_KYUSHU:
      return '#FD7556'
  }
}

const departments = [DEPARTMENT_OSAKA, DEPARTMENT_KOBE, DEPARTMENT_KYUSHU]

const OrderCharts = () => {
  const chartsContainer = useRef(null)
  const chartsInstance = useRef(null);
  const [data, setData] = useState()
  const [startDate, setStartDate] = useState(() => dayjs().add(-7, 'days'))
  const [activeDepartment, setActiveDepartment] = useState([...departments])

  useEffect(() => {
    chartsInstance.current = ECharts.init(chartsContainer.current)
    chartsInstance.current.setOption({
      grid: {
        left: 30,
        right: 20,
        top: 40,
        bottom: 30,
      },
      tooltip: {},
      legend: {
        data: departments.map(departmentName),
        show: false,
      },
      xAxis: {
        data: [],
        axisTick: {
          show: true
        },
        axisLabel: {
          formatter: (date) => date?.substring(5),
          color: '#969ea7'
        },
        boundaryGap: false,
        splitLine: {
          show: true
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#eceff4'
          }
        },
      },
      yAxis: {
        name: '件',
        nameTextStyle: {
          color: '#969ea7'
        },
        type: 'value',
        minInterval: 1,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#eceff4'
          }
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#969ea7'
        },
      },
    })
    request('admin/acc/total_per_date').get().send().then(setData)
  }, []);

  useEffect(() => {
    const selected = {}
    departments.forEach(department => {
      selected[departmentName(department)] = activeDepartment.includes(department)
    })
    chartsInstance.current.setOption({
      legend: {
        selected
      },
    })
  }, [activeDepartment]);

  useEffect(() => {
    const dates = []
    let d = startDate
    const today = dayjs()
    while(d.isBefore(today)) {
      dates.push(d.format('YYYY-MM-DD'))
      d = d.add(1, 'days')
    }

    chartsInstance.current.setOption({
      xAxis: {
        data: dates,
      },
      series: departments.map(department => ({
        type: 'line',
        name: departmentName(department),
        data: dates.map(date => get(data, [date, department], 0)),
        color: departmentColor(department),
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: departmentColor(department) },
              { offset: 1, color: departmentColor(department) + '00' }
            ],
          }
        },
      }))
    })
  }, [data]);

  return (
    <div
      className={'w-full h-full flex flex-col pt-2'}
    >
      <div className={'w-full flex items-center'}>
        <div className={'flex gap-2'}>
          {departments.map(department => {
            const activeStyle = {}
            if(activeDepartment.includes(department)) {
              activeStyle.borderColor = departmentColor(department)
              activeStyle.backgroundColor = color(departmentColor(department)).lightness(90)
            }
            return (
              <div
                key={department}
                className={'bg-[#ecedef] flex items-center rounded px-4 py-1 cursor-pointer border border-transparent'}
                style={activeStyle}
                onClick={() => setActiveDepartment(activeDepartment.includes(department) ? activeDepartment.filter(d => d !== department) : [...activeDepartment, department])}
              >
                <div className={'w-2 h-2 rounded-full mr-2'}
                     style={{ backgroundColor: departmentColor(department) }}
                />
                {departmentName(department)}
              </div>
            )
          })}
        </div>
        <Select
          className={'ml-auto'}
          value={startDate.format('YYYY-MM-DD')}
          options={[
            { value: startDate.format('YYYY-MM-DD'), label: '7日間' },
          ]}
        />
      </div>
      <div ref={chartsContainer} className={'flex-1'} />
    </div>
  )
}

export default OrderCharts
