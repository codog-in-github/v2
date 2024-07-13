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
const OrderDetail = () => {
  const [form] = Form.useForm()
  const onAddContainerHandle = () => {
    const oldValue = form.getFieldValue('container')
    form.setFieldsValue({
      container: [...oldValue, newConatainer()]
    })
  }
  const onAddCarHandle = (key) => {
    const oldValue = form.getFieldValue('container')
    console.log(oldValue);
    oldValue[key].car = [
      ...oldValue[key].car,
      newCar()
    ]
    form.setFieldsValue({
      container: [...oldValue]
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
          container: [newConatainer()]
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