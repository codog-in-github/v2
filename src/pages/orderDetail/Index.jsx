import { Form } from "antd"
import Management from "./Management"
import { namespaceClass } from "@/helpers/style"
import classNames from "classnames"
import Customer from "./Customer"

import './Index.scss'
import Goods from "./Goods"
import ProcessStatus from "./ProcessStatus"
import Ship from "./Ship"
import Chat from "./Chat"
import Files from "./Files"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useState } from "react"
import { request } from "@/apis/requestBuilder"
import dayjs from "dayjs"

const newConatainer = () => {
  return {
    com: '',
    car: [newCar()]
  }
}

const newCar = () => {
  return {}
}

const c = namespaceClass('order-detail')

const formDataTransfer = (rep) => {
  const result = {}
  // Management
  result.orderDate = dayjs(rep['bkg_date'])
  result.companyNo = rep['order_no']

  // customer
  result.customerName = rep['company_name']
  result.customerAbbr = rep['short_name']
  result.customerPostalCode = rep['zip_code']
  result.customerAddr = rep['address']
  result.customerResponsiblePersion = rep['header']
  result.customerContact = rep['mobile']
  result.companyCode = rep[' c']
  return result
}
const useFillFormData = (form, id) => {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    request('/admin/order/detail')
      .get()
      .query({ id })
      .send()
      .then(formDataTransfer)
      .then((data) => form.setFieldsValue(data))
      .finally(() => {
        setLoading(false)
      })
  }, [id, form])
  return loading
}

const OrderDetail = () => {
  const [form] = Form.useForm()
  const { id } = useParams()
  const loading = useFillFormData(form, id)
  const onAddContainerHandle = () => {
    const oldValue = form.getFieldValue('containers')
    form.setFieldsValue({
      containers: [...oldValue, newConatainer()]
    })
  }
  const onAddCarHandle = (key) => {
    const oldValue = form.getFieldValue('containers')
    oldValue[key].car = [
      ...oldValue[key].car,
      newCar()
    ]
    form.setFieldsValue({
      containers: [...oldValue]
    })
  }
  return (
    <>
      <Form
        form={form}
        layout="vertical"
        className={classNames(
          c('form'),
          'flex-1 grid grid-cols-3 gap-[2px] m-2 rounded bg-gray-400 grid-rows-[100px_200px_160px_220px_1fr]'
        )}
        initialValues={{
          containers: [newConatainer()]
        }}>
        <Management
          className="col-span-3 bg-white flex items-center"
          onSave={() => {
            const data = form.getFieldsValue()
            console.log(data);
          }} />
        <Customer className="bg-white py-2" />
        <Goods
          className="row-span-2 bg-white flex flex-col overflow-hidden"
          onAddContainer={onAddContainerHandle}
          onAddCar={onAddCarHandle} />
        <ProcessStatus className="row-span-4 bg-white" />
        <Ship className="row-span-2 bg-white" />
        <Chat className="row-span-2 bg-white flex flex-col" />
        <Files className="bg-white"></Files>
      </Form>
    </>
  )
}

export default OrderDetail