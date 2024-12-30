import { request } from "@/apis/requestBuilder"
import Label from "@/components/Label"
import { SELECT_ID_SHIP_COMPANY } from "@/constant"
import { useAsyncCallback, useOptions } from "@/hooks"
import {Form, Input, Select, DatePicker, Button, Space} from "antd"
import { useState, useEffect, useContext } from "react"
import { DetailDataContext } from "./dataProvider"
import { AutoComplete } from "antd"
import { PlusCircleFilled } from "@ant-design/icons"
import { Modal } from "antd"
import { useRef } from "react"
import { useMemo } from "react"
import { useImperativeHandle } from "react"
import { forwardRef } from "react"
import FormItem from "antd/lib/form/FormItem"
import pubSub from "@/helpers/pubSub"
import classNames from "classnames";

const getPorts = () => {
  return request('admin/country/tree').get().send()
}

const usePorts = () => {
  const [portTree, setPortTree] = useState([])
  const [fetch, loading] = useAsyncCallback(async () => {
    const rep = await getPorts()
    setPortTree(rep)
  })
  useEffect(() => {
    fetch()
  }, [])
  return {
    portTree,
    loading,
    fetch
  }
}

const CountrySelect = ({ tree, bindId, bindName, ...props }) => {
  const form = Form.useFormInstance()
  return (
    <Select
      {...props}
      showSearch
      options={tree}
      filterOption={(input, option) => {
        const upperCase = input.toUpperCase()
        return (
          option.label.toUpperCase().includes(upperCase) ||
          option.code.includes(upperCase)
        )
      }}
      onSelect={(_, option) =>{
        form.setFieldsValue({
          [bindName]: `${option['label']}/${option['code']}`,
          [bindId]: void 0
        })
      }}
      dropdownAlign={{
        overflow: { adjustY: false }
      }}
      onClear={() => form.setFieldsValue({
        [bindName]: '',
        [bindId]: void 0
      })}
      allowClear
      fieldNames={{
        value: 'id',
        label: 'code',
      }}
      optionRender={({ data }) => <div>{data['label']}<span className="float-right">({data['code']})</span></div>}
    />
  )
}

const PortSelect = ({ tree, bindId, bindName, ...props }) => {
  let options = []
  const form = Form.useFormInstance()
  const parentValue = Form.useWatch(bindId, form)
  if(parentValue) {
    options = tree.find(item => item.id === parentValue)?.children ?? []
  }

  useEffect(() => {
    if(!parentValue) {
      form.setFieldValue(bindName, '')
    }
  }, [bindName, form, parentValue]);

  return (
    <Select
      {...props}
      onSelect={(_, option) => form.setFieldValue(bindName, `${option['label']}/${option['code']}`)}
      options={options}
      showSearch
      fieldNames={{
        value: 'id',
        label: 'code',
      }}
      filterOption={(input, option) => {
        const upperCase = input.toUpperCase()
        return (
          option.label.toUpperCase().includes(upperCase) ||
          option.code.includes(upperCase)
        )
      }}
      onClear={() => form.setFieldValue(bindName, '')}
      labelRender={({ value }) => {
        const item = options.find(item => item.id === value)
        if(!item)
            return ''
        return `${item['label']}(${item['code']})`
      }}
      dropdownAlign={{
        overflow: { adjustY: false }
      }}
      allowClear
      optionRender={({ data }) => <div>{data['label']}<span className="float-right">({data['code']})</span></div>}
    />
  )
}

const AddCarrierModal = forwardRef(function AddCarrierModal({ onSuccess }, ref) {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const [add, loading] = useAsyncCallback(async () => {
    const data = await form.validateFields()
    const rep = await request('admin/carrier_add').data(data).send()
    onSuccess(rep)
    setOpen(false)
  })
  useImperativeHandle(ref, () => {
    return {
      open: (value) => {
        console.log(value)
        setOpen(true)
      },
    }
  }, [])
  return (
    <Modal
      title="ADD"
      open={open}
      onCancel={() => setOpen(false)}
      onOk={add}
      maskClosable={false}
      okButtonProps={{ loading }}
    >
      <Form form={form} className="pt-2">
        <Form.Item label="CARRIER" name="name" rules={[{ required: true, message: 'CARRIER 必填' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
})

const AddPortModal = forwardRef(function AddPortModal ({ onSuccess }, ref) {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const [add, loading] = useAsyncCallback(async () => {
    const data = await form.validateFields()
    const rep = await request('admin/country/add').data(data).send()
    onSuccess(rep)
    setOpen(false)
  })
  useImperativeHandle(ref, () => {
    return {
      open: (pid) => {
        form.resetFields()
        if(pid) {
          form.setFieldValue('pid', pid)
        }
        setOpen(true)
      },
    }
  }, [])
  return (
    <Modal
      title="ADD"
      open={open}
      onCancel={() => setOpen(false)}
      onOk={add}
      maskClosable={false}
      okButtonProps={{ loading }}
    >
      <Form form={form} className="pt-2" labelCol={{ span: 4 }}>
        <FormItem name="pid" noStyle></FormItem>
        <Form.Item label="NAME" name="label" rules={[{ required: true, message: 'NAME 必填' }]}>
          <Input />
        </Form.Item><Form.Item label="ABBR" name="code" rules={[{ required: true, message: 'ABBR 必填' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
})

const AmPmSelect = ({ value, onChange }) => {
  const activeClass = 'bg-[#194114] text-white'
  return (
    <div
      className={'flex w-16 text-center bg-white text-[#B4B4B4] cursor-pointer text-xs h-4 rounded overflow-hidden'}
    >
      <div
        className={classNames('flex-1', {
          [activeClass]: value === 0,
        })}
        onClick={() => onChange(0)}
      >AM</div>

      <div
        className={classNames('flex-1', {
          [activeClass]: value === 1,
        })}
        onClick={() => onChange(1)}
      >PM</div>
    </div>
  )
}


const useCarrierOptions = () => {
  const [list, setList] = useState([])
  const [callback, loading] = useAsyncCallback(async () => {
    const rep = await request('admin/carrier_options').get().send()
    setList(rep)
  })

  useEffect(() => { callback() }, [])

  return [list, loading, callback]
}

const ExportShip = ({ className }) => {
  const { rootRef, onModifyChange, form } = useContext(DetailDataContext)
  const { portTree, loading: portLoading, fetch: fetchPort } = usePorts()
  const [carriers, , reloadCarrier] = useCarrierOptions()
  const addCarrierModalRef = useRef()
  const addPortModalRef = useRef()
  const onPortAdd = useRef(() => {})
  /**
   * 2024/09/02
   * 船公司列表从options表移到PartnerCompany
   * SELECT_ID_SHIP_CONPANY 只用来查询 vessel 列表
   */
  const [ships] = useOptions(SELECT_ID_SHIP_COMPANY)

  const vesselOptions = useMemo(
    () => ships.map(item => ({ value: item.extra })).filter(item => !!item.value),
    [ships]
  )
  return (
    <div className={className}>
      <Label>船社情報</Label>
      <div className="px-2">
      <div className="flex items-end gap-1">
        <Input name="id" hidden />
        <Form.Item name="carrierName" noStyle></Form.Item>
        <Form.Item className="flex-1" label="CARRIER" name="carrier_id">
          <Select
            options={carriers}
            showSearch
            optionFilterProp="label"
            dropdownAlign={{
              overflow: { adjustY: false }
            }}
            getPopupContainer={() => rootRef.current}
            onSelect={(_, item) => {
              console.log(item)
              form.setFieldValue('carrierName', item.label)
              onModifyChange()
            }}
            notFoundContent={(
              <Button
                type="primary"
                className="w-full"
                onClick={() => addCarrierModalRef.current.open()}
              ><PlusCircleFilled />ADD</Button>
            )}
          />
        </Form.Item>
        <span className="relative bottom-1">/</span>
        <Form.Item className="flex-1" label="VESSEL NAME" name="vesselName">
          <AutoComplete
            onChange={onModifyChange}
            options={vesselOptions}
            getPopupContainer={() => rootRef.current}
            filterOption={(value, option) => {
              return option.value.toLowerCase().includes(value.toLowerCase())
            }}
            dropdownAlign={{
              overflow: { adjustY: false }
            }}
          />
        </Form.Item>
        <span className="relative bottom-1">/</span>
        <Form.Item className="flex-1" label="VOYAGE" name="voyage">
          <Input onChange={onModifyChange} />
        </Form.Item>
        </div>
        <div className="flex gap-2 mt-2">
          <div
            className="grid grid-cols-2 gap-x-2 flex-1 p-2 text-white [&_label]:!text-white"
            style={{
              background: '#1E518F'
            }}
          >
            <div className="col-span-2">PORT OF LOADING</div>
            <Form.Item name="loadingCountryName" noStyle/>
            <Form.Item label="Country/Region" name="loadingCountry">
              <CountrySelect
                loading={portLoading}
                tree={portTree}
                bindId="loadingPort"
                bindName="loadingCountryName"
                onChange={onModifyChange}
                notFoundContent={(
                  <Button
                    type="primary"
                    className="w-full"
                    onClick={() => {
                      onPortAdd.current = (rep) => {
                        form.setFieldsValue({
                          loadingCountryName: `${rep.label}/${rep.code}`,
                          loadingCountry: rep.id,
                          loadingPort: null,
                          loadingPortName: ''
                        })
                        fetchPort()
                      }
                      addPortModalRef.current.open()
                    }}
                  ><PlusCircleFilled/>ADD</Button>
                )}
                getPopupContainer={() => rootRef.current}
              />
            </Form.Item>
            <Form.Item name="loadingPortName" noStyle/>
            <Form.Item label="Port" name="loadingPort">
              <PortSelect
                loading={portLoading}
                tree={portTree}
                bindId="loadingCountry"
                bindName="loadingPortName"
                onChange={onModifyChange}
                notFoundContent={(
                  <Button
                    type="primary"
                    className="w-full"
                    onClick={() => {
                      const pid = form.getFieldValue('loadingCountry')
                      if (!pid) {
                        return pubSub.publish('Info.Toast', '请先选择 Country/Region', 'error')
                      }
                      onPortAdd.current = (rep) => {
                        form.setFieldsValue({
                          loadingPortName: `${rep.label}/${rep.code}`,
                          loadingPort: rep.id,
                        })
                        fetchPort()
                      }
                      addPortModalRef.current.open(pid)
                    }}
                  ><PlusCircleFilled/>ADD</Button>
                )}
                getPopupContainer={() => rootRef.current}
              />
            </Form.Item>
            <Form.Item className="col-span-2" label="ETD" name="etd">
              <DatePicker className="w-full" onChange={onModifyChange}/>
            </Form.Item>
          </div>

          <div
            className="grid grid-cols-2 flex-1 p-2 gap-x-2"
            style={{
              background: '#F0D3DC'
            }}
          >
            <div className="col-span-2">PORT OF DELIVERY</div>
            <Form.Item name="deliveryCountryName" noStyle/>
            <Form.Item label="Country/Region" name="deliveryCountry">
              <CountrySelect
                loading={portLoading}
                tree={portTree}
                bindId="deliveryPort"
                bindName="deliveryCountryName"
                onChange={onModifyChange}
                getPopupContainer={() => rootRef.current}
                notFoundContent={(
                  <Button
                    type="primary"
                    className="w-full"
                    onClick={() => {
                      onPortAdd.current = (rep) => {
                        form.setFieldsValue({
                          deliveryCountryName: `${rep.label}/${rep.code}`,
                          deliveryCountry: rep.id,
                          deliveryPort: null,
                          deliveryPortName: ''
                        })
                        fetchPort()
                      }
                      addPortModalRef.current.open()
                    }}
                  ><PlusCircleFilled />ADD</Button>
                )}
              />
            </Form.Item>
            <Form.Item noStyle name="deliveryPortName" />
            <Form.Item label="Port" name="deliveryPort">
              <PortSelect
                loading={portLoading}
                tree={portTree}
                bindId="deliveryCountry"
                bindName="deliveryPortName"
                onChange={onModifyChange}
                getPopupContainer={() => rootRef.current}
                notFoundContent={(
                  <Button
                    type="primary"
                    className="w-full"
                    onClick={() => {
                      const pid = form.getFieldValue('deliveryCountry')
                      if(!pid) {
                        return pubSub.publish('Info.Toast', '请先选择 Country/Region', 'error')
                      }
                      onPortAdd.current = (rep) => {
                        form.setFieldsValue({
                          deliveryPortName: `${rep.label}/${rep.code}`,
                          deliveryPort: rep.id,
                        })
                        fetchPort()
                      }
                      addPortModalRef.current.open(pid)
                    }}
                  ><PlusCircleFilled />ADD</Button>
                )}
              />
            </Form.Item>
            <Form.Item  label="ETA" name="eta">
              <DatePicker onChange={onModifyChange} className="w-full" />
            </Form.Item>
            <Form.Item  label="FREE TIME" name="freeTime">
              <DatePicker onChange={onModifyChange} className={'w-full'} />
            </Form.Item>
          </div>
        </div>

        <div className={'grid grid-cols-3 gap-2 my-2'}>

          {/* line 1 */}
          <Form.Item onChange={onModifyChange} name={'cy_cfs'} label={'CY·CFS'}>
            <Input />
          </Form.Item>
          <Form.Item onChange={onModifyChange} name={'customs_location'} label={'通関場所'}>
            <Input />
          </Form.Item>
          <Form.Item name={'bonded_code'} label={'保税コード'}>
            <Input onChange={onModifyChange} style={{ background: '#F8EACF' }} />
          </Form.Item>

          {/* line 2 */}
          <Form.Item label={'品名'} name={'product_name'}>
            <Input />
          </Form.Item>
          <div className={'col-span-2 flex gap-2 items-end'}>
            <Form.Item name={'quantity_1'}>
              <Input onChange={onModifyChange} addonAfter={'VO'} />
            </Form.Item>
            <Form.Item name={'quantity_2'}>
              <Input onChange={onModifyChange} addonAfter={'KG'} />
            </Form.Item>
            <Form.Item name={'quantity_3'}>
              <Input onChange={onModifyChange} addonAfter={<>M<sup>3</sup></>} />
            </Form.Item>
          </div>

          {/* line 3 */}
          <Form.Item label={'インボイスNO.'} name={'invoice_no'}>
            <Input onChange={onModifyChange} />
          </Form.Item>
          <Form.Item label={'建値'} name={'price_type'}>
            <Input onChange={onModifyChange} style={{ background: '#F8EACF' }} />
          </Form.Item>
          <Form.Item label={'通貨'} name={'currency'}>
            <Input onChange={onModifyChange} style={{ background: '#F8EACF' }}/>
          </Form.Item>

          {/* line 4 */}
          <Form.Item label={'保険'} name={'insurance'}>
            <Select options={[
              { label: 'なし', value: 1 },
              { label: '個別', value: 2 },
              { label: '包括', value: 3 },
            ]} />
          </Form.Item>
          <Form.Item label={'評価'} name={'valuation'}>
            <Select options={[
              { label: 'なし', value: 1 },
              { label: '個別', value: 2 },
              { label: '包括', value: 3 },
            ]} />
          </Form.Item>
          <Form.Item label={'納付方法'} name={'payment_method'}>
            <Select options={[
              // 1.荷主リアル  2.春海立替  3.マルチ  4.延納
              { label: '荷主リアル', value: 1 },
              { label: '春海立替', value: 2 },
              { label: 'マルチ', value: 3 },
              { label: '延納', value: 4 },
            ]} />
          </Form.Item>
        </div>

      </div>

      <AddCarrierModal
        ref={addCarrierModalRef}
        onSuccess={(rep) => {
          form.setFieldValue('carrier_id', rep.id)
          form.setFieldValue('carrier', rep.name)
          reloadCarrier()
        }}
      ></AddCarrierModal>

      <AddPortModal
        ref={addPortModalRef}
        onSuccess={(rep) => onPortAdd.current(rep)}
      ></AddPortModal>
    </div>
  )
}

export default ExportShip
