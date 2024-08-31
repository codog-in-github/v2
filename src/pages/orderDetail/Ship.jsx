import { request } from "@/apis/requestBuilder"
import Label from "@/components/Label"
import { SELECT_ID_SHIP_CONPANY } from "@/constant"
import { useAsyncCallback, useOptions } from "@/hooks"
import { Form, Input, Select, DatePicker } from "antd"
import { useContext } from "react"
import { useState, useEffect } from "react"
import { DetailDataContext } from "./dataProvider"

const getPorts = () => {
  return request('admin/country/tree').get().send()
}

const usePorts = () => {
  const [portTree, setPortTree] = useState([])
  const [callback, loading] = useAsyncCallback(async () => {
    const rep = await getPorts()
    setPortTree(rep)
  }, [])
  useEffect(() => {
    callback()
  }, [])
  return {
    portTree,
    loading
  }
}

const CountrySelect = ({ tree, bind, bindName, ...props }) => {
  const form = Form.useFormInstance()
  return (
    <Select
      {...props}
      showSearch
      options={tree}
      optionFilterProp="code"
      onSelect={(_, option) =>{
        form.setFieldsValue({
          [bindName]: `${option['label']}/${option['code']}`,
          [bind]: void 0
        })
      }}
      fieldNames={{
        value: 'id',
        label: 'code',
      }}
      optionRender={({ data }) => <div>{data['label']}<span className="float-right">({data['code']})</span></div>}
    />
  )
}

const PortSelect = ({ tree, bind, bindName, ...props }) => {
  let options = []
  const form = Form.useFormInstance()
  const parentValue = Form.useWatch(bind, form)
  if(parentValue) {
    options = tree.find(item => item.id === parentValue)?.children ?? []
  }
  return (
    <Select
      {...props}
      onSelect={(_, option) => form.setFieldValue(bindName, `${option['label']}/${option['code']}`)}
      options={options}
      showSearch
      optionFilterProp="code"
      fieldNames={{
        value: 'id',
        label: 'code',
      }}
      labelRender={({ value }) => {
        const item = options.find(item => item.id === value)
        if(!item)
            return ''
        return `${item['label']}(${item['code']})`
      }}
      optionRender={({ data }) => <div>{data['label']}<span className="float-right">({data['code']})</span></div>}
    />
  )
}
const Ship = ({ className }) => {
  const { portTree, loading: portLoading } = usePorts()
  const form = Form.useFormInstance()
  const [ships] = useOptions(SELECT_ID_SHIP_CONPANY)
  const shipOptions = ships.map(item => ({ value: item.id, label: item.value, origin: item }))
  const { rootRef, onModifyChange } = useContext(DetailDataContext)
  return (
    <div className={className}>
      <Label>船社情報</Label>
      <div className="px-2">
      <div className="flex items-end gap-1">
          <Input name="id" hidden />
          <Form.Item name="carrier" noStyle></Form.Item>
          <Form.Item className="flex-1" label="CARRIER" name="carrier_id">
            <Select 
              options={shipOptions} onSelect={(_, { origin }) => {
                form.setFieldValue('carrier', origin.value)
                form.setFieldValue('vesselName', origin.extra ?? '')
              }}
              showSearch
              optionFilterProp="label"
              getPopupContainer={() => rootRef.current}
              onChange={onModifyChange}
            />
          </Form.Item>
          <span className="relative bottom-1">/</span>
          <Form.Item className="flex-1" label="VESSEL NAME" name="vesselName">
            <Input onChange={onModifyChange} />
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
                bind="loadingPort"
                bindName="loadingCountryName"
                onChange={onModifyChange}
                getPopupContainer={() => rootRef.current}
              />
            </Form.Item>
            <Form.Item name="loadingPortName" noStyle />
            <Form.Item label="Port" name="loadingPort">
              <PortSelect
                loading={portLoading}
                tree={portTree}
                bind="loadingCountry"
                bindName="loadingPortName"
                onChange={onModifyChange}
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
                bind="deliveryPort"
                bindName="deliveryCountryName"
                onChange={onModifyChange}
                getPopupContainer={() => rootRef.current}
              />
            </Form.Item>
            <Form.Item noStyle name="deliveryPortName" />
            <Form.Item label="Port" name="deliveryPort">
              <PortSelect
                loading={portLoading}
                tree={portTree}
                bind="deliveryCountry"
                bindName="deliveryPortName"
                onChange={onModifyChange}
                getPopupContainer={() => rootRef.current}
              />
            </Form.Item>
            <Form.Item className="col-span-2" label="ETA" name="eta">
              <DatePicker onChange={onModifyChange} />
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
                bind="dischargePort"
                bindName="dischargeCountryName"
                onChange={onModifyChange}
                getPopupContainer={() => rootRef.current}
              />
            </Form.Item>
            <Form.Item noStyle name="dischargePortName" />
            <Form.Item label="Port" name="dischargePort">
              <PortSelect
                loading={portLoading}
                tree={portTree}
                bind="dischargeCountry"
                bindName="dischargePortName"
                onChange={onModifyChange}
                getPopupContainer={() => rootRef.current}
              />
            </Form.Item>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ship