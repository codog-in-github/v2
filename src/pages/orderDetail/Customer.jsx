import Label from "@/components/Label"
import { Input, Form } from "antd"
import { useContext } from "react"
import { DetailDataContext } from "./dataProvider"

const Customer = ({ className }) => {
  const { onModifyChange } = useContext(DetailDataContext)
  return (
    <div className={className}>
      <Label>お客様情報</Label>
      <div className="px-2">
        <div className="flex items-end gap-1">
          <Form.Item name="customerId" noStyle></Form.Item>
          <Form.Item className="flex-1" label="お客様名" name="customerName">
            <Input readOnly />
          </Form.Item>
          <span className="relative bottom-1">/</span>
          <Form.Item className="flex-1" label="略称" name="customerAbbr">
            <Input onChange={onModifyChange} />
          </Form.Item>
          <span className="relative bottom-1">/</span>
          <Form.Item className="flex-1" label="〒" name="customerPostalCode">
            <Input onChange={onModifyChange} />
          </Form.Item>
        </div>
        <Form.Item label="住所" name="customerAddr">
          <Input onChange={onModifyChange} />
        </Form.Item>
        <div className="flex items-end gap-1">
          <Form.Item className="flex-1" label="担当者" name="customerResponsiblePerson">
            <Input onChange={onModifyChange} />
          </Form.Item>
          <span className="relative bottom-1">/</span>
          <Form.Item className="flex-1" label="連絡先" name="customerContact">
            <Input onChange={onModifyChange} />
          </Form.Item>
          <span className="relative bottom-1">/</span>
          <Form.Item className="flex-1" label="法人番号" name="companyCode">
            <Input onChange={onModifyChange} />
          </Form.Item>
        </div>
      </div>
    </div>
  )
}

export default Customer
