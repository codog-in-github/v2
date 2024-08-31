import { request } from "@/apis/requestBuilder";
import { useAsyncCallback, useDepartmentList } from "@/hooks";
import { Radio, DatePicker, Form, Modal, Input } from "antd";
import dayjs from "dayjs";
import { useContext, useState } from "react";
import { DetailDataContext } from "../dataProvider";

const dateFileds = ['etd', 'eta', 'cy_open', 'cy_cut', 'doc_cut']

const BookingNotice = ({ instance }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const departmentList = useDepartmentList()
  const { form: detailForm } = useContext(DetailDataContext)

  const [exportBook, exporting] = useAsyncCallback(async () => {
    const formData = form.getFieldsValue()
    dateFileds.forEach(field => {
      if(formData[field]) {
        formData[field] = dayjs(formData[field]).format('YYYY-MM-DD')
      } else {
        formData[field] = null
      }
    })
    formData.containers = formData.containers.join('|')
    for(const field of dateFileds) {
      if([null, void 0].includes(formData[field])) {
        delete formData[field]
      }
    }
    await request('/admin/book/booking_notice/export').data(formData).download(null, true).send()
    setOpen(false)
  })

  const [setFormData, loading] = useAsyncCallback(async (id) => {
    form.resetFields()
    const rep = await request('/admin/book/booking_notice/get').get({ order_id: id }).send()
    dateFileds.forEach(field => {
      if(rep[field]) {
        rep[field] = dayjs(rep[field])
      } else {
        rep[field] = null
      }
    })
    console.log(rep.containers)
    if(rep.containers){
      rep.containers = rep.containers.split('|')
    } else {
      rep.containers = []
    }
    form.setFieldsValue(rep)
  })

  if(instance) {
    instance.current = {
      open: () => {
        setOpen(true)
        setFormData(detailForm.getFieldValue("id"))
      },
    }
  }

  return (
    <Modal
      title="BOOKING NOTICE"
      width={700}
      open={open}
      onCancel={() => setOpen(false)}
      maskClosable={false}
      okButtonProps={{ loading: exporting || loading }}
      okText="EXPORT"
      onOk={exportBook}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item name="id" noStyle></Form.Item>
        <Form.Item name="order_id" noStyle></Form.Item>
        <Form.Item name="department_id" label="ADDRESS">
          <Radio.Group options={departmentList}></Radio.Group>
        </Form.Item>
        <Form.Item name="order_no" label="社内管理番号">
          <Input readOnly></Input>
        </Form.Item>
        <Form.Item name="booker" label="BOOKER">
          <Input></Input>
        </Form.Item>
        <Form.Item name="booking_no" label="BOOKING NO">
          <Input></Input>
        </Form.Item>
        <Form.Item name="carrier" label="CARRIER">
          <Input></Input>
        </Form.Item>
        <Form.Item name="vessel" label="VESSEL">
          <Input></Input>
        </Form.Item>
        <Form.Item name="voyage" label="VOY">
          <Input></Input>
        </Form.Item>
        <Form.Item name="loading_port_name" label="POL">
          <Input></Input>
        </Form.Item>
        <Form.Item name="delivery_port_name" label="POD">
          <Input></Input>
        </Form.Item>
        <div className="grid grid-cols-2">
          <Form.Item labelCol={{ span: 8 }} name="etd" label="ETD">
            <DatePicker className="w-full"></DatePicker>
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} name="eta" label="ETA">
            <DatePicker className="w-full"></DatePicker>
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} name="cy_open" label="CY OPEN">
            <DatePicker className="w-full"></DatePicker>
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} name="cy_cut" label="CY CUT">
            <DatePicker className="w-full"></DatePicker>
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} name="doc_cut" label="DOC CUT">
            <DatePicker className="w-full"></DatePicker>
          </Form.Item>
        </div>
        <Form.List name='containers'>{list => list.map(props => (
          <Form.Item key={props.name} name={props.name} label={`CONTAINER ${props.name + 1}`}>
            <Input></Input>
          </Form.Item>
        ))}</Form.List>
        <Form.Item name="common" label="COMMON">
          <Input></Input>
        </Form.Item>
        <Form.Item name="remark" label="REMARK">
          <Input.TextArea></Input.TextArea>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default BookingNotice
