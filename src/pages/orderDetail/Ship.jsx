import { request } from "@/apis/requestBuilder"
import Label from "@/components/Label"
import { SELECT_ID_SHIP_CONPANY } from "@/constant"
import { useAsyncCallback, useOptions } from "@/hooks"
import { Form, Input, Select, DatePicker, Button } from "antd"
import { useContext } from "react"
import { useState, useEffect } from "react"
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
  } else {
    form.setFieldValue(bindName, '')
  }
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


const useCarrierOptions = () => {
  const [list, setList] = useState([])
  const [callback, loading] = useAsyncCallback(async () => {
    const rep = await request('admin/carrier_options').get().send()
    setList(rep)
  }, [])
  useEffect(() => {
    callback()
  }, [])
  return [list, loading, callback]
}
const Ship = ({ className }) => {
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
  const [ships] = useOptions(SELECT_ID_SHIP_CONPANY)

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
          <div className="grid grid-cols-2 gap-x-2 flex-1 bg-[#37832e] p-2 text-white [&_label]:!text-white">
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
                  ><PlusCircleFilled />ADD</Button>
                )}
                getPopupContainer={() => rootRef.current}
              />
            </Form.Item>
            <Form.Item name="loadingPortName" noStyle />
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
                      if(!pid) {
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
                  ><PlusCircleFilled />ADD</Button>
                )}
                getPopupContainer={() => rootRef.current}
              />
            </Form.Item>
            <Form.Item className="col-span-2" label="ETD" name="etd">
              <DatePicker className="w-full" onChange={onModifyChange} />
            </Form.Item>
            <Form.Item className="col-span-2" label="CY OPEN" name="cyOpen">
              <DatePicker className="w-full" onChange={onModifyChange} />
            </Form.Item>
            <Form.Item label="CY CUT" rules={[{ required: true }]} name="cyCut">
              <DatePicker className="w-full" onChange={onModifyChange} />
            </Form.Item>
            <Form.Item label="DOC CUT" name="docCut">
              <DatePicker className="w-full" onChange={onModifyChange} />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 flex-1 bg-[#abdae0] p-2 gap-x-2">
            <div className="col-span-2">PORT OF DELIVERY</div>
            <Form.Item name="deliveryCountryName" noStyle />
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
            <Form.Item className="col-span-2" label="ETA" name="eta">
              <DatePicker onChange={onModifyChange} className="w-full" />
            </Form.Item>
            <Form.Item  label="FREE TIME DEM" name="freeTimeDem">
              <Input onChange={onModifyChange} />
            </Form.Item>
            <Form.Item  label="FREE TIME DET" name="freeTimeDet">
              <Input onChange={onModifyChange} />
            </Form.Item>
            <div className="col-span-2">PORT OF DISCHARGE</div>
            <Form.Item noStyle name="dischargeCountryName" />
            <Form.Item label="Country/Region" name="dischargeCountry">
              <CountrySelect
                loading={portLoading}
                tree={portTree}
                bindId="dischargePort"
                bindName="dischargeCountryName"
                onChange={onModifyChange}
                getPopupContainer={() => rootRef.current}
                notFoundContent={(
                  <Button
                    type="primary"
                    className="w-full"
                    onClick={() => {
                      onPortAdd.current = (rep) => {
                        form.setFieldsValue({
                          dischargeCountryName: `${rep.label}/${rep.code}`,
                          dischargeCountry: rep.id,
                          dischargePort: null,
                          dischargePortName: ''
                        })
                        fetchPort()
                      }
                      addPortModalRef.current.open()
                    }}
                  ><PlusCircleFilled />ADD</Button>
                )}
              />
            </Form.Item>
            <Form.Item noStyle name="dischargePortName" />
            <Form.Item label="Port" name="dischargePort">
              <PortSelect
                loading={portLoading}
                tree={portTree}
                bindId="dischargeCountry"
                bindName="dischargePortName"
                onChange={onModifyChange}
                getPopupContainer={() => rootRef.current}
                notFoundContent={(
                  <Button
                    type="primary"
                    className="w-full"
                    onClick={() => {
                      const pid = form.getFieldValue('dischargeCountry')
                      if(!pid) {
                        return pubSub.publish('Info.Toast', '请先选择 Country/Region', 'error')
                      }
                      onPortAdd.current = (rep) => {
                        form.setFieldsValue({
                          dischargePortName: `${rep.label}/${rep.code}`,
                          dischargePort: rep.id,
                        })
                        fetchPort()
                      }
                      addPortModalRef.current.open(pid)
                    }}
                  ><PlusCircleFilled />ADD</Button>
                )}
              />
            </Form.Item>
          </div>
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

export default Ship
