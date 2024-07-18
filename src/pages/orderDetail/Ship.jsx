import { request } from "@/apis/requestBuilder"
import Label from "@/components/Label"
import { useAsyncCallback } from "@/hooks"
import { Form, Input, Select, DatePicker } from "antd"
import { useState, useEffect } from "react"

const getPorts = () => {
  return request('admin/country/tree').get().send()
}
const usePorts = () => {
  const [portTree, setPortTree] = useState([])
  const { callback, loading } = useAsyncCallback(async () => {
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

const CountrySelect = ({ tree, bind, onChange, ...props }) => {
  const form = Form.useFormInstance()
  return (
    <Select
      {...props}
      showSearch
      options={tree}
      optionFilterProp="code"
      onChange={(...args) => {
        form.setFieldValue(bind, void 0)
        onChange(...args)
      }}
      fieldNames={{
        value: 'id',
        label: 'code',
      }}
      optionRender={({ data }) => <div>{data['label']}<span className="float-right">({data['code']})</span></div>}
    />
  )
}

const PortSelect = ({ tree, bind, ...props }) => {
  let options = []
  const form = Form.useFormInstance()
  const parentValue = Form.useWatch(bind, form)
  if(parentValue) {
    options = tree.find(item => item.id === parentValue)?.children ?? []
  }
  return (
    <Select
      {...props}
      options={options}
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
  return (
    <div className={className}>
      <Label>船社情報</Label>
      <div className="px-2">
      <div className="flex items-end gap-1">
          <Input name="id" hidden />
          <Form.Item className="flex-1" label="CARRIER" name="carrier">
            <Input />
          </Form.Item>
          <span className="relative bottom-1">/</span>
          <Form.Item className="flex-1" label="VESSEL NAME" name="vesselName">
            <Input />
          </Form.Item>
          <span className="relative bottom-1">/</span>
          <Form.Item className="flex-1" label="VOYAGE" name="voyage">
            <Input />
          </Form.Item>
        </div>
        <div className="flex gap-2 mt-2">
          <div className="grid grid-cols-2 gap-x-2 flex-1 bg-[#37832e] p-2 text-white [&_label]:!text-white">
            <div className="col-span-2">PORT OF LOADING</div>
            <Form.Item label="Country/Region" name="loadingCountry">
              <CountrySelect
                loading={portLoading}
                tree={portTree}
                bind="loadingPort"
              />
            </Form.Item>
            <Form.Item label="Port" name="loadingPort">
              <PortSelect
                loading={portLoading}
                tree={portTree}
                bind="loadingCountry"
              />
            </Form.Item>
            <Form.Item className="col-span-2" label="ETD" name="etd">
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item className="col-span-2" label="CY OPEN" name="cyOpen">
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item label="CY CUT" rules={[{ required: true }]} name="cyCut">
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item label="DOC CUT" name="docCut">
              <DatePicker className="w-full" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 flex-1 bg-[#abdae0] p-2 gap-x-2">
            <div className="col-span-2">PORT OF DELIVERY</div>
            <Form.Item label="Country/Region" name="deliveryCountry">
              <CountrySelect
                loading={portLoading}
                tree={portTree}
                bind="deliveryPort"
              />
            </Form.Item>
            <Form.Item label="Port" name="deliveryPort">
              <PortSelect
                loading={portLoading}
                tree={portTree}
                bind="deliveryCountry"
              />
            </Form.Item>
            <Form.Item className="col-span-2" label="ETA" name="eta">
              <DatePicker />
            </Form.Item>
            <Form.Item  label="FREE TIME DEM" name="freeTimeDem">
              <Input />
            </Form.Item>
            <Form.Item  label="FREE TIME DET" name="freeTimeDet">
              <Input />
            </Form.Item>
            <div className="col-span-2">PORT OF DISCHARGE</div>
            <Form.Item label="Country/Region" name="dischargeCountry">
              <CountrySelect
                loading={portLoading}
                tree={portTree}
                bind="dischargePort"
              />
            </Form.Item>
            <Form.Item label="Port" name="dischargePort">
              <PortSelect
                loading={portLoading}
                tree={portTree}
                bind="dischargeCountry"
              />
            </Form.Item>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ship