import { Form } from "antd"
import Management from "./Management"
import Customer from "./Customer"
import Goods from "./Goods"
import ProcessStatus from "./ProcessStatus"
import Ship from "./Ship"
import Chat from "./Chat"
import Files from "./Files"
import { DetailDataContext, newCar, newConatainer, useDetailData } from "./dataProvider"
import { Spin } from "antd/lib"

const OrderDetail = () => {
  const detailHook = useDetailData()
  const {
    form,
    messages,
    sendMessage,
    loading,
  } = detailHook
  return (
    <DetailDataContext.Provider value={detailHook}>
      <Form
        form={form}
        style={{
          zoom: 0.95
        }}
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
          containers: [newConatainer()],
          cars: [newCar()]
        }}>
        <Management
          className="col-span-3 bg-white flex items-center"
        />
        <Customer className="bg-white py-2" />
        <Goods className="row-span-2 bg-white flex flex-col overflow-hidden" />
        <ProcessStatus className="row-span-4 bg-white" />
        <Ship className="row-span-2 bg-white" />
        <Chat
          className="row-span-2 bg-white flex flex-col"
          messages={messages}
          onSend={sendMessage}
        />
        <Files className="bg-white" />
      </Form>
      <Spin spinning={loading}  fullscreen />
    </DetailDataContext.Provider>
  )
}

export default OrderDetail
