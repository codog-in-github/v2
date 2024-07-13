import Label from "@/components/Label"
import { Select } from "antd"
import { DatePicker } from "antd"
import { Input } from "antd"
import { Form } from "antd"

const Ship = ({className }) => {
  return (
    <div className={className}>
      <Label>船社情報</Label>
      <div className="px-2">
      <div className="flex items-end gap-1">
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
              <Select />
            </Form.Item>
            <Form.Item label="Port" name="loadingPort">
              <Select />
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
              <Select />
            </Form.Item>
            <Form.Item label="Port" name="deliveryCountry">
              <Select />
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
              <Select></Select>
            </Form.Item>
            <Form.Item label="Port" name="dischargePort">
              <Select></Select>
            </Form.Item>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ship