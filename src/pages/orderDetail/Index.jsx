import { Form } from "antd"
import Management from "./Management"
import Customer from "./Customer"
import ExportGoods from "./ExportGoods.jsx"
import ExportProcessStatus from "./ExportProcessStatus.jsx"
import ExportShip from "./ExportShip.jsx"
import ImportShip from "./ImportShip.jsx"
import Chat from "./Chat"
import Files from "./Files"
import { DetailDataContext, useDetailData } from "./dataProvider"
import { Spin } from "antd/lib"
import { useBlocker } from "react-router-dom"
import { Modal } from "antd"
import {useEffect} from "react";
import pubSub from "@/helpers/pubSub.js";
import {ORDER_TYPE_EXPORT} from "@/constant/index.js";
import ImportGoods from "@/pages/orderDetail/ImportGoods.jsx";
import ImportProcessStatus from "@/pages/orderDetail/ImportProcessStatus.jsx";

const ExportLayout = () => {
  return (
    <div
      className="
        [&_.ant-form-item-label]:!pb-0
        [&_.ant-form-item-explain]:hidden
        [&_.ant-form-item]:mb-0
        h-full
        grid grid-cols-3 gap-[2px] m-2 grid-rows-[100px_200px_160px_220px_1fr]
        rounded bg-gray-400
      "
    >
      <Management
        className="col-span-3 bg-white flex items-center"
      />
      <Customer className="bg-white py-2" />
      <ExportGoods className="row-span-2 bg-white flex flex-col overflow-hidden" />
      <ExportProcessStatus className="row-span-4 bg-white" />
      <ExportShip className="row-span-2 bg-white" />
      <Chat className="row-span-2 bg-white flex flex-col" />
      <Files className="bg-white" />
    </div>
  )
}

export const ImportLayout = () => {
  return (
    <div
      className="
        [&_.ant-form-item-label]:!pb-0
        [&_.ant-form-item-explain]:hidden
        [&_.ant-form-item]:mb-0
        h-full
        grid grid-cols-3 gap-[2px] m-2 grid-rows-[100px_200px_90px_60px_200px_1fr]
        rounded bg-gray-400
      "
    >
      <Management className="col-span-3 bg-white flex items-center" />
      <Customer className="bg-white py-2"/>
      <ImportGoods className="row-span-2 bg-white flex flex-col overflow-hidden"/>
      <ImportProcessStatus className="row-span-5 bg-white"/>
      <ImportShip className="row-span-4 bg-white"/>
      <Chat className="row-span-2 bg-white flex flex-col"/>
      <Files className="bg-white"/>
    </div>
  )
}


const OrderDetail = () => {
  const detailContext = useDetailData()
  const blocker = useBlocker(() => detailContext.modified.current)
  const {form, loading, orderTypeScope} = detailContext

  useEffect(() => {
    pubSub.publish('Info.UI.ScrollPage.Change', true)
    return () => pubSub.publish('Info.UI.ScrollPage.Change', false)
  }, []);

  return (
    <>
      <div ref={detailContext.rootRef} className="flex-1" style={{zoom: 0.95}}>
        <DetailDataContext.Provider value={detailContext}>
          <Modal
            title="提示"
            open={blocker.state === 'blocked'}
            onOk={() => blocker.proceed()}
            onCancel={() => blocker.reset()}
            maskClosable={false}
          >
            <div>この画面から離れますか</div>
          </Modal>
          <Form
            form={form}
            className={'h-full'}
            layout="vertical">
            { orderTypeScope === ORDER_TYPE_EXPORT
              ? <ExportLayout />
              : <ImportLayout />
            }
          </Form>
        </DetailDataContext.Provider>
      </div>
      <Spin spinning={loading} fullscreen />
    </>
  )
}

export default OrderDetail
