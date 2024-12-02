import Label from "@/components/Label"
import {Input, Form, Select} from "antd"
import {useCallback, useContext, useEffect, useState} from "react"
import { DetailDataContext } from "./dataProvider"
import {request} from "@/apis/requestBuilder.js";

const Customer = ({ className }) => {
  const { onModifyChange, rootRef, canEditCuster, form } = useContext(DetailDataContext)
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    request('admin/order/get_department_customers')
      .get().send().then(setCustomers)
  }, []);

  const onCustomerSelect = useCallback((_, customer) => {
    form.setFieldsValue({
      customerName: customer.name,
      customerAbbr: customer.abbr,
      zipcode: customer.zipcode,
      customerAddr: customer.addr,
      customerResponsiblePerson: customer.default_contact?.name,
      mobile: customer.default_contact?.tel,
      companyCode: customer.code
    })
  }, [form]);

  return (
    <div className={className}>
      <Label>お客様情報</Label>
      <div className="px-2">
        <div className="flex items-end gap-1">
          <Form.Item name="customerName" noStyle></Form.Item>
          <Form.Item
            className="flex-1"
            label="お客様名"
            name="customerId"
            rules={[{ required: true, message: 'お客様名' }]}
          >
            <Select
              getPopupContainer={() => rootRef.current}
              dropdownAlign={{
                overflow: { adjustY: false }
              }}
              fieldNames={{
                value: 'id',
                label: 'name'
              }}
              disabled={!canEditCuster}
              showSearch
              optionFilterProp={'name'}
              onSelect={onCustomerSelect}
              options={customers}
              onChange={onModifyChange}
            />
          </Form.Item>
          <span className="relative bottom-1">/</span>
          <Form.Item className="flex-1" label="略称" name="customerAbbr">
            <Input onChange={onModifyChange} />
          </Form.Item>
          <span className="relative bottom-1">/</span>
          <Form.Item className="flex-1" label="〒" name="zipcode">
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
          <Form.Item className="flex-1" label="連絡先" name="mobile">
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
