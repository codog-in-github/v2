import Label from "@/components/Label"
import { Select } from "antd"
import { Button, Form, Input, DatePicker, TimePicker } from "antd"
import { debounce } from "lodash"
import { useState } from "react"
import classNames from "classnames"
import { DetailDataContext, newCar, newConatainer } from "./dataProvider"
import { useCallback } from "react"
import { Space } from "antd"
import { useOptions } from "@/hooks"
import { SELECT_ID_CONTAINER_TYPE } from "@/constant"
import { createContext } from "react"
import { useContext } from "react"
import { AutoComplete } from "antd"
import { useRef } from "react"

const usePage = (list) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const movePage = (index) => {
    if (index > list.length - 1) {
      setCurrentIndex(list.length - 1)
    } else if (index < 0) {
      setCurrentIndex(0)
    } else {
      setCurrentIndex(index)
    }
  }
  const debounceOnWheelHandle = debounce((e) => {
    if (e.deltaY < 0) {
      movePage(currentIndex - 1)
    } else {
      movePage(currentIndex + 1)
    }
  }, 100)
  const onWheelHandle = (e) => {
    const nextIndex = currentIndex + (e.deltaY < 0 ? -1 : 1)
    if (nextIndex >= 0 && nextIndex < list.length) {
      e.stopPropagation()
      debounceOnWheelHandle(e)
    }
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
  for (let i = 0; i < max; i++) {
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
    <div
      className={classNames(
        'flex flex-shrink-0 gap-2 justify-center',
        { 'flex-col': direction === 'vertical' }
      )}
    >
      {dots}
    </div>
  )
}
const ContainerList = ({
  list,
  onAddContainer,
  onRemoveContainer,
}) => {
  const {
    page, onWheelHandle, movePage, movePageForce
  } = usePage(list)
  const { containerTypes } = useContext(GoodsContext)
  const { rootRef, form, onModifyChange } = useContext(DetailDataContext)
  return (
    <div ref={rootRef} className="flex overflow-hidden">
      <div className="flex-1 h-16">
        {
          list.map((props) => (
            <div
              key={props.key}
              className="w-full flex-shrink-0 transition-transform flex flex-col h-full"
              style={{
                transform: `translateY(${-page * 100}%)`
              }}>
              <Form.Item name={[props.name, 'id']} hidden />
              <div className="flex gap-1 items-end mb-2">
                <Form.Item className="flex-1" name={[props.name, 'commodity']}>
                  <Input addonBefore="COM" onChange={onModifyChange} />
                </Form.Item>
                <Form.Item className="flex-1" label="Container type" name={[props.name, 'containerType']}>
                  <AutoComplete
                    onChange={onModifyChange}
                    placement="topLeft"
                    options={containerTypes}
                    getPopupContainer={() => rootRef.current}
                    onSelect={(value) => form.setFieldValue(['cars', 0, 'vanType'], value)}
                  />
                </Form.Item>
                <Form.Item className="flex-1" label="QUANTITY" name={[props.name, 'quantity']}>
                  <Input />
                </Form.Item>
                {list.length > 1 ? (
                  <>
                    <Button
                      danger
                      type="primary"
                      icon='-'
                      onClick={() => {
                        onRemoveContainer(props.name)
                        if(page !== 0) {
                          movePage(page - 1)
                        }
                      }}
                    />
                    <Button
                      type="primary"
                      className="bg-success hover:!bg-success-400"
                      icon="+"
                      onClick={() => {
                        onAddContainer()
                        setTimeout(movePageForce, 0, list.length)
                      }}
                    />
                  </>
                ) : (
                <Button
                  type="primary"
                  className="bg-success hover:!bg-success-400"
                  onClick={() => {
                    onAddContainer()
                    setTimeout(movePageForce, 0, list.length)
                  }}>ADD</Button>
                )}
              </div>
            </div>
          ))
        }
      </div>
      <Pagination
        className="ml-2"
        activeClass="bg-success"
        direction="vertical"
        max={list.length}
        current={page}
        onChange={movePage} />
    </div>
  )
}

const CarList = ({
  list,
  onAddCar,
  containerFieldName,
  onRemoveCar
}) => {
  const {
    page, onWheelHandle, movePage, movePageForce
  } = usePage(list)
  const { rootRef, onModifyChange } = useContext(DetailDataContext)
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex w-full h-full" >
        {list.map((props) => (
          <div
            key={props.key}
            className="bg-[#d9e4ef] p-2 h-full w-full flex-shrink-0 transition-transform overflow-hidden"
            style={{ transform: `translateX(${-page * 100}%)` }}>
            <Form.Item name={[props.name, 'id']} hidden />
            <div className="flex gap-2">
              <Form.Item className="flex-1" label="VAN場所" name={[props.name, 'vanPlace']}>
                <Input onChange={onModifyChange} />
              </Form.Item>
              <Form.Item className="w-32" label="TYPE" name={[props.name, 'vanType']}>
                <Input onChange={onModifyChange} />
              </Form.Item>
            </div>
            <div className="flex gap-2 items-end">
              <Form.Item className="w-32" label="2軸3軸" name={[props.name, 'carType']}>
                <Select
                  onChange={onModifyChange}
                  getPopupContainer={() => rootRef.current} options={[
                    { label: '2軸', value: 1 },
                    { label: '3軸', value: 2 }
                  ]}
                >
                </Select>
              </Form.Item>
              <Form.Item className="w-32" label="日付" name={[props.name, 'date']}>
                <DatePicker getPopupContainer={() => rootRef.current} onChange={onModifyChange} />
              </Form.Item>
              <Form.Item className="w-36" label="時間" name={[props.name, 'time']}>
                <TimePicker.RangePicker
                  format="HH:mm"
                  getPopupContainer={() => rootRef.current}
                  onChange={onModifyChange}
                />
              </Form.Item>
              {list.length > 1 && <Button
                className="ml-auto"
                danger
                type="primary"
                onClick={() => {
                  onRemoveCar(props.name)
                  if(page !== 0) {
                    movePage(page - 1)
                  }
                }}
              >DEL</Button>}
              <Button
                className="ml-auto"
                type="primary"
                onClick={() => {
                  onAddCar(containerFieldName)
                  setTimeout(movePageForce, 0, list.length)
                }}
              >ADD</Button>
            </div>
            <div className="border-t border-gray-400 border-dashed my-2" />
            <div className="flex gap-2">
              <Form.Item className="flex-1" label="運送会社" name={[props.name, 'transCom']}>
                <Input onChange={onModifyChange} />
              </Form.Item>
              <Form.Item className="flex-1" label="ドライバー" name={[props.name, 'driver']}>
                <Input onChange={onModifyChange} />
              </Form.Item>
              <Form.Item className="flex-1" label="連絡先" name={[props.name, 'tel']}>
                <Input onChange={onModifyChange} />
              </Form.Item>
              <Form.Item className="flex-1" label="車番" name={[props.name, 'carCode']}>
                <Input onChange={onModifyChange} />
              </Form.Item>
            </div>
            <div className="flex gap-2">
              <Form.Item className="flex-1" label="CONTAINER" name={[props.name, 'container']}>
                <Input onChange={onModifyChange} />
              </Form.Item>
              <Form.Item className="flex-1" label="SEAL" name={[props.name, 'seal']}>
                <Input onChange={onModifyChange} />
              </Form.Item>
              <Form.Item className="flex-1" label="TARE">
                <Space.Compact>
                  <Form.Item noStyle name={[props.name, 'tare']}>
                    <Input onChange={onModifyChange} />
                  </Form.Item>
                  <Form.Item noStyle name={[props.name, 'tareType']}>
                    <Select
                      getPopupContainer={() => rootRef.current}
                      className="w-4"
                      options={[
                        { label: 'T', value: 1 },
                        { label: 'KG', value: 2 }
                      ]}
                      onChange={onModifyChange}
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        activeClass="bg-primary"
        className="my-2"
        max={list.length}
        current={page}
        onChange={movePage}
      />
    </div>
  )
}
const GoodsContext = createContext()
const Goods = ({ className }) => {
  const form = Form.useFormInstance()
  const [containerTypes] = useOptions(SELECT_ID_CONTAINER_TYPE)
  const { onModifyChange } = useContext(DetailDataContext)

  const onAddContainerHandle = useCallback(() => {
    onModifyChange()
    const oldValue = form.getFieldValue('containers')
    form.setFieldValue('containers', [...oldValue, newConatainer()])
  },[form, onModifyChange])

  const onAddCarHandle = useCallback(() => {
    onModifyChange()
    const oldValue = form.getFieldValue('cars')
    form.setFieldValue('cars', [...oldValue, newCar()])
  }, [form, onModifyChange])

  const onRemoveContainerHandle = useCallback((key) => {
    onModifyChange()
    const oldValue = form.getFieldValue('containers')
    oldValue.splice(key, 1)
    form.setFieldValue('containers', [...oldValue])
  }, [form, onModifyChange])

  const onRemoveCarHandle = useCallback((key) => {
    onModifyChange()
    console.log(key)
    const oldValue = form.getFieldValue('cars')
    oldValue.splice(key, 1)
    form.setFieldValue('cars', [...oldValue])
  }, [form, onModifyChange])
  // const [carCompanys] = useOptions(1)
  return (
    <GoodsContext.Provider value={{ containerTypes }}>
      <div className={className}>
        <Label className="flex-shrink-0">貨物情報</Label>
        <div className="mx-2 flex-1 overflow-hidden">
          <Form.List name="containers">
            {(list) => (
              <ContainerList
                onAddContainer={onAddContainerHandle}
                onRemoveContainer={onRemoveContainerHandle}
                list={list}
              />
            )}
          </Form.List>
          <Form.List name="cars">
            {(list) => (
              <CarList
                list={list}
                onAddCar={onAddCarHandle}
                onRemoveCar={onRemoveCarHandle}
              />
            )}
          </Form.List>
        </div>
      </div>
    </GoodsContext.Provider>
  )
}

export default Goods
