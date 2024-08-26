import { Form } from "antd"
import Management from "./Management"
import Customer from "./Customer"
import Goods from "./Goods"
import ProcessStatus from "./ProcessStatus"
import Ship from "./Ship"
import Chat from "./Chat"
import Files from "./Files"
import { DetailDataContext, useDetailData } from "./dataProvider"
import { Spin } from "antd/lib"
import { useBlocker } from "react-router-dom"
import { Modal } from "antd"
const OrderDetail = () => {
  const detailHook = useDetailData()
  const blocker = useBlocker(() => !detailHook.navigateForce.current)
  const {
    form,
    loading,
  } = detailHook
  return (
    <>
      <div ref={detailHook.rootRef} className="flex-1"  style={{ zoom: 0.95 }}>
        <DetailDataContext.Provider value={detailHook}>
          <Modal
            title="提示"
            open={blocker.state === 'blocked'}
            onOk={() => blocker.proceed()}
            onCancel={() => blocker.reset()}
          >
            <div>この画面から離れますか</div>
          </Modal>
          <Form
            form={form}
            layout="vertical"
            className="
                [&_.ant-form-item-label]:!pb-0
                [&_.ant-form-item-explain]:hidden
                [&_.ant-form-item]:mb-0
                h-full
                grid grid-cols-3 gap-[2px] m-2 grid-rows-[100px_200px_160px_220px_1fr]
                rounded bg-gray-400
              ">
            <Management
              className="col-span-3 bg-white flex items-center"
            />
            <Customer className="bg-white py-2" />
            <Goods className="row-span-2 bg-white flex flex-col overflow-hidden" />
            <ProcessStatus className="row-span-4 bg-white" />
            <Ship className="row-span-2 bg-white" />
            <Chat className="row-span-2 bg-white flex flex-col" />
            <Files className="bg-white" />
          </Form>
        </DetailDataContext.Provider>
      </div>
      <Spin spinning={loading} fullscreen />
    </>
  )
}

export default OrderDetail
