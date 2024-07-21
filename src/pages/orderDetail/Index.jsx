import { Form } from "antd"
import Management from "./Management"
import Customer from "./Customer"
import Goods from "./Goods"
import ProcessStatus from "./ProcessStatus"
import Ship from "./Ship"
import Chat from "./Chat"
import Files from "./Files"
import { newConatainer, useDetailData } from "./dataHooks"

const OrderDetail = () => {
  const { loading, form, messages, sendMessage, saveOrderFile, files } = useDetailData()
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
    <Form
      form={form}
      layout="vertical"
      className="
        [&_.ant-form-item-label]:!pb-0
        [&_.ant-form-item-explain]:hidden
        [&_.ant-form-item]:mb-0
        flex-1
        grid grid-cols-3 gap-[2px] m-2 grid-rows-[100px_200px_160px_220px_1fr]
        rounded bg-gray-400
      "
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
      <Chat
        className="row-span-2 bg-white flex flex-col"
        messages={messages}
        onSend={sendMessage}
      />
      <Files
        files={files}
        className="bg-white"
        onUpload={saveOrderFile}
      />
    </Form>
  )
}

export default OrderDetail
