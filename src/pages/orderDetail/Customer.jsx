import Label from "@/components/Label"
import {Input, Form, Select, Button} from "antd"
import {useCallback, useContext, useEffect, useRef, useState} from "react"
import { DetailDataContext } from "./dataProvider"
import {request} from "@/apis/requestBuilder.js";
import {PlusCircleFilled} from "@ant-design/icons";
import CustomerAddModal from "@/components/CustomerAddModal.jsx";

const Customer = ({ className }) => {
  const {onModifyChange, rootRef, canEditCuster, form} = useContext(DetailDataContext)
  const [customers, setCustomers] = useState([])

  const addModalRef = useRef(null);

  useEffect(() => {
    request('admin/order/get_department_customers')
      .get().send().then(setCustomers)
  }, []);

  const onCustomerAdd = useCallback((customer) => {
    setCustomers(customers => [...customers, customer])
    form.setFieldValue('customerId', customer.id)
    onCustomerSelect(null, customer)
  }, [])

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
              notFoundContent={(
                <Button
                  onClick={() => addModalRef.current.open()}
                  className={'w-full'}
                  type={'primary'}
                  icon={<PlusCircleFilled />}
                >
                  <span className="ml-1">お客様追加</span>
                </Button>
              )}
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
      <CustomerAddModal ref={addModalRef} onSuccess={onCustomerAdd} />
    </div>
  )
}

export default Customer
