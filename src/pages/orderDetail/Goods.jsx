import Label from "@/components/Label"
import { Select } from "antd"
import { Button, Form, Input, DatePicker, TimePicker } from "antd"
import { debounce } from "lodash"
import { useState } from "react"
import classNames from "classnames"

const usePage = (list) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const movePage = (index) => {
    if(index > list.length - 1) {
      setCurrentIndex(list.length - 1)
    } else if(index < 0) {
      setCurrentIndex(0)
    } else {
      setCurrentIndex(index)
    }
  }
  const debounceOnWheelHandle = debounce((e) => {
    if(e.deltaY < 0) {
      movePage(currentIndex - 1)
    } else {
      movePage(currentIndex + 1)
    }
  }, 100)
  const onWheelHandle = (e) => {
    e.stopPropagation()
    debounceOnWheelHandle(e)
  }
  return {
    page: currentIndex,
    onWheelHandle,
    movePage,
    movePageForce: setCurrentIndex
  }
}

const Pagination = ({
  max,
  current,
  onChange,
  direction,
  className,
  activeClass
}) => {
  const dots = []
  for(let i = 0; i < max; i++) {
    dots.push(
      <div
        key={i}
        onClick={() => { onChange(i) }}
        className={classNames(
          className,
          'h-3 w-3 rounded-full cursor-pointer',
          {
            [activeClass]: i === current,
            'bg-gray-300': i !== current,
          }
        )}
      />
    )
  }
  return (
    <div className={
      classNames(
        'flex flex-shrink-0 gap-2 justify-center', {
            'flex-col': direction === 'vertical'
        }
      )
    }>
      {dots}
    </div>
  )
}
const ContainerList = ({ list, onAddCar, onAddContainer }) => {
  const {
    page, onWheelHandle, movePage, movePageForce
  } = usePage(list)
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex overflow-hidden flex-1" onWheel={onWheelHandle}>
        {
          list.map((props) => (
              <div
                key={props.key}
                className="w-full flex-shrink-0 transition-transform flex flex-col h-full"
                style={{
                  transform: `translateX(${-page * 100}%)`
                }}>
                  <div className="flex gap-1 items-end mb-2">
                      <Form.Item className="flex-1" name={[props.name, 'commodity']}>
                          <Input addonBefore="COM" />
                      </Form.Item>
                      <Form.Item className="flex-1" label="Container type" name={[props.name, 'containerType']}>
                          <Input />
                      </Form.Item>
                      <Form.Item className="flex-1" label="QUANTITY" name={[props.name, 'quantity']}>
                          <Input />
                      </Form.Item>
                      <Button
                        type="primary"
                        className="bg-success hover:!bg-success-400"
                        onClick={() => {
                          onAddContainer()
                          setTimeout(movePageForce, 0, list.length)
                        }}>ADD</Button>
                  </div>
                  <Form.List name={[props.name, 'car']}>
                      {(list) => {
                          return (
                              <CarList containerFieldName={props.name} onAddCar={onAddCar} list={list}></CarList>
                          )
                      }}
                  </Form.List>
              </div>
          ))
        }
      </div>
      <Pagination
        className="my-2"
        activeClass="bg-success"
        max={list.length}
        current={page}
        onChange={movePage} />
    </div>
  )
}

const CarList = ({list, onAddCar, containerFieldName}) => {
  const {
    page, onWheelHandle, movePage, movePageForce
  } = usePage(list)
  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="w-full h-full" onWheel={onWheelHandle}>
        {list.map((props) => (
          <div
            key={props.key}
            className="bg-[#d9e4ef] p-2 h-full transition-transform overflow-hidden"
            style={{ transform: `translateY(${-page * 100}%)` }}>
            <div className="flex gap-2">
              <Form.Item className="flex-1" label="VAN場所" name={[props.name, 'vanPlace']}>
                <Input />
              </Form.Item>
              <Form.Item className="w-32" label="TYPE" name={[props.name, 'vanType']}>
                <Input />
              </Form.Item>
            </div>
            <div className="flex gap-2 items-end">
              <Form.Item className="w-32" label="2軸3軸" name={[props.name, 'carType']}>
                <Select defaultValue='2軸'>
                  <Select.Option value="2軸">2軸</Select.Option>
                  <Select.Option value="3軸">3軸</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item className="w-32" label="日付" name={[props.name, 'date']}>
                <DatePicker />
              </Form.Item>
              <Form.Item className="w-32" label="時間" name={[props.name, 'time']}>
                <TimePicker />
              </Form.Item>
              <Button className="ml-auto" type="primary" onClick={() => {
                onAddCar(containerFieldName)
                setTimeout(movePageForce, 0, list.length)
              }}>ADD</Button>
            </div>
            <div className="border-t border-gray-400 border-dashed my-2" />
            <div className="flex gap-2">
              <Form.Item className="flex-1" label="運送会社" name={[props.name, 'transCom']}>
                <Input />
              </Form.Item>
              <Form.Item className="flex-1" label="ドライバー" name={[props.name, 'driver']}>
                <Input />
              </Form.Item>
              <Form.Item className="flex-1" label="連絡先" name={[props.name, 'tel']}>
                <Input />
              </Form.Item>
              <Form.Item className="flex-1" label="車番" name={[props.name, 'carCode']}>
                <Input />
              </Form.Item>
            </div>
            <div className="flex gap-2">
              <Form.Item className="flex-1" label="CONTAINER" name={[props.name, 'container']}>
                <Input />
              </Form.Item>
              <Form.Item className="flex-1" label="SEAL" name={[props.name, 'seal']}>
                <Input />
              </Form.Item>
              <Form.Item className="flex-1" label="TARE" name={[props.name, 'tare']}>
                <Input addonAfter={(
                  <Select defaultValue="T" value={1} >
                    <Select.Option value={1}>T</Select.Option>
                    <Select.Option value={2}>KG</Select.Option>
                  </Select>
                )} />
              </Form.Item>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        activeClass="bg-primary"
        className="ml-2"
        max={list.length}
        current={page}
        onChange={movePage}
        direction="vertical" />
    </div>
  )
}

const Goods = ({
  onAddContainer = () => {},
  onAddCar = () => {},
  className,
}) => {
  return(
    <div className={className}>
      <Label className="flex-shrink-0">貨物情報</Label>
      <div className="mx-2 flex-1 overflow-hidden">
        <Form.List name="containers">
          {(list) => (
            <ContainerList
              onAddContainer={onAddContainer}
              onAddCar={onAddCar}
              list={list}
            />
          )}
        </Form.List>
      </div>
    </div>
  )
}

export default Goods
