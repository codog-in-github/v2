import Label from "@/components/Label"
import { Input, Form } from "antd"

const Customer = ({ className }) => {
  return (
    <div className={className}>
      <Label>お客様情報</Label>
      <div className="px-2">
        <div className="flex items-end gap-1">
          <Form.Item className="flex-1" label="お客様名" name="customerName">
            <Input readOnly />
          </Form.Item>
          <span className="relative bottom-1">/</span>
          <Form.Item className="flex-1" label="略称" name="customerAbbr">
            <Input />
          </Form.Item>
          <span className="relative bottom-1">/</span>
          <Form.Item className="flex-1" label="〒" name="customerPostalCode">
            <Input />
          </Form.Item>
        </div>
        <Form.Item label="住所" name="customerAddr">
          <Input />
        </Form.Item>
        <div className="flex items-end gap-1">
          <Form.Item className="flex-1" label="担当者" name="customerResponsiblePersion">
            <Input />
          </Form.Item>
          <span className="relative bottom-1">/</span>
          <Form.Item className="flex-1" label="連絡先" name="customerContact">
            <Input />
          </Form.Item>
          <span className="relative bottom-1">/</span>
          <Form.Item className="flex-1" label="法人番号" name="companyCode">
            <Input />
          </Form.Item>
        </div>
      </div>
    </div>
  )
}

export default Customer
