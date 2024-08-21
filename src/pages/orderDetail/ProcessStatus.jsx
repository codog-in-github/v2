import Label from "@/components/Label"
import { Form, Space, Select, Button, Input } from "antd"
import classNames from "classnames"
import { useContext } from "react"
import { DetailDataContext } from "./dataProvider"
import { 
  EXPORT_NODE_NAMES, MAIL_TO_CUSTOMER, MAIL_TO_CUSTOMS_COMPANY, MAIL_TO_SHIP, SUR_STEP_PAYED,
  ORDER_NODE_TYPE_ACL, ORDER_NODE_TYPE_BL_COPY, ORDER_NODE_TYPE_CUSTOMER_DOCUMENTS, ORDER_NODE_TYPE_SUR,
  SUR_STEP_WAIT_PAY, MAIL_TO_ACC, SUR_STEP_WAIT_CUSTOMER_CONFIRMED,
  SUR_STEP_SENDED,
  FILE_TYPE_OPERATIONS,
  FILE_TYPE_CUSTOMS,
  ORDER_NODE_TYPE_PO,
  MAIL_TO_CAR,
  MAIL_TYPE_REDO,
  MAIL_TYPE_NORMAL,
  ORDER_NODE_TYPE_FM,
  ORDER_NODE_TYPE_REQUEST,
  FILE_TYPE_REQUEST,
} from "@/constant"
import Mail from "./Mail"
import { useRef } from "react"
import * as Icon from '@/components/Icon'
import { LoadingOutlined } from "@ant-design/icons"
import MailDetail from "./MailDetail"
import { useAsyncCallback } from "@/hooks"
import { request } from "@/apis/requestBuilder"
import pubSub from "@/helpers/pubSub"
const Light = ({ children, loading, active, className, onToggle = () => {} }) => {
  const activeClassNames = ['!bg-[#ffe3dd]', '!text-[#fd7556]', '!border-[#fd7556]']
  return (
    <div
      onClick={() => onToggle(!active)}
      className={classNames(
        'flex items-center bg-gray-300 w-fit relative left-3 rounded border-gray-300 border cursor-pointer',
        className,
        active && activeClassNames
      )}
    >
      <div className={classNames(
        'bg-gray-700 w-6 h-6 rounded-full relative right-3 flex items-center justify-center overflow-hidden',
        active && '!bg-[#fd7556]'
      )}>
       { loading ? <LoadingOutlined className="text-white" /> : <Icon.Light className="h-8 w-8" />}
      </div>
      <div className="w-6 text-right mr-2">{children}</div>
    </div>
  )
}


const ProcessBar = ({
  nodeId,
  canDo,
  isEnd,
  nodeType,
  children,
  sendTime,
  sender,
  redo,
  mail,
  onClickDetail
}) => {
  const { changeNodeStatus, changingNodeStatus } = useContext(DetailDataContext)
  let context = children
  if(!canDo) {
    context = null
  } else if(isEnd) {
    const mailData = {
      nodeType,
      nodeId,
      type: MAIL_TYPE_REDO,
      file: [FILE_TYPE_OPERATIONS],
      title: `${EXPORT_NODE_NAMES[nodeType]} - BL訂正`,
      to: MAIL_TO_SHIP
    }
    context = (
      <>
        <div>{sendTime}  {sender}</div>
        { [ORDER_NODE_TYPE_SUR, ORDER_NODE_TYPE_BL_COPY].includes(nodeType) && (
          <Button  type="primary" onClick={() => mail.current.open(mailData)}>BL訂正</Button>
        ) }
        <Button onClick={() => onClickDetail(nodeId)}>詳細</Button>
      </>
    )
  } else if(redo) {
    context = (
      <>
        <div>{sendTime}  {sender}</div>
        { children }
        <Button onClick={() => onClickDetail(nodeId)}>詳細</Button>
      </>
    )
  }
  return (
    <div className="flex gap-4 items-center h-8">
      <Light
        onToggle={(status) => { changingNodeStatus || changeNodeStatus(nodeId, status) }}
        active={canDo && !isEnd}
      >{EXPORT_NODE_NAMES[nodeType]}</Light>
      <div className="flex-1 border-dashed border-t border-gray-500"></div>
      {context}
    </div>
  )
}
const getMailTo = (nodeType, step) => {
  switch (nodeType) {
    case ORDER_NODE_TYPE_CUSTOMER_DOCUMENTS:
      return MAIL_TO_CUSTOMS_COMPANY
    case ORDER_NODE_TYPE_SUR:
      if(step === SUR_STEP_WAIT_PAY)
        return MAIL_TO_ACC
      return MAIL_TO_CUSTOMER
    case ORDER_NODE_TYPE_PO:
      return MAIL_TO_CAR
    default:
      return MAIL_TO_CUSTOMER
  }
}
const ProcessBarButtons = ({ nodeId, nodeType, step, mail, sended, redo }) => {
  const { refreshNodes } = useContext(DetailDataContext)
  const mailData = {
    nodeType,
    nodeId,
    step,
    type: MAIL_TYPE_NORMAL,
    to: getMailTo(nodeType, step),
    file: [FILE_TYPE_OPERATIONS],
    title: `${EXPORT_NODE_NAMES[nodeType]} - 送信`
  }
  const [confirmNode, inConfirm] = useAsyncCallback(async () => {
    await request('/admin/order/node_confirm').get({ id: nodeId, is_confirm: 1 }).send()
    refreshNodes()
    pubSub.publish('Info.Toast', '确认成功', 'success')
  })
  switch (nodeType) {
    case ORDER_NODE_TYPE_BL_COPY:
      mailData.title = `${EXPORT_NODE_NAMES[nodeType]} - 再送`
      return (
        <Button type="primary" onClick={() => mail.current.open(mailData)}>
          <span>{ sended ? '再送': '送信'}</span>
        </Button>
      )
    case ORDER_NODE_TYPE_ACL:
      return (
        <>
          <Button type="primary" onClick={() => mail.current.open(mailData)}>
            <span>{ sended ? '再送': '送信'}</span>
          </Button>
          { sended && <Button type="primary" onClick={confirmNode} loading={inConfirm}>確認</Button> }
        </>
      )
    case ORDER_NODE_TYPE_SUR:
      switch (step) {
        case SUR_STEP_WAIT_CUSTOMER_CONFIRMED:
          mailData.to = MAIL_TO_ACC
          mailData.title = `${EXPORT_NODE_NAMES[nodeType]} - 支払依頼`
          return (
            <Button type="primary" onClick={() => mail.current.open(mailData)}>支払依頼</Button>
          )
          case SUR_STEP_WAIT_PAY:
          case SUR_STEP_PAYED:
            return (
              <Button type="primary" disabled={step === SUR_STEP_WAIT_PAY} onClick={() => mail.current.open(mailData)}>送信</Button>
            )
          default:
            return null
      }
    case ORDER_NODE_TYPE_CUSTOMER_DOCUMENTS:
      mailData.file = [FILE_TYPE_CUSTOMS]
      return (
        <Button type="primary" onClick={() => mail.current.open(mailData)}>送信</Button>
      )
    case ORDER_NODE_TYPE_FM:
      return null
    case ORDER_NODE_TYPE_REQUEST:
      mailData.file = [FILE_TYPE_REQUEST]
      return (
        <Button type="primary" onClick={() => mail.current.open(mailData)}>送信</Button>
      )
    default:
      return (
        <Button type="primary" onClick={() => mail.current.open(mailData)}>送信</Button>
      )
  }
}

const ProcessStatus = ({className}) => {
  const { nodes, refreshNodes, isCopy } = useContext(DetailDataContext)
  const detailRef = useRef(null)
  // const multiSendOptions = nodes
  //   .filter(item => item.canDo && !item.isEnd)
  //   .map(item => ({
  //     value: item.typeId
  //   }))
  const mail = useRef(null)
  return (
    <div className={className}>
      <Label>進捗状況</Label>
      <div className="p-2 flex items-center gap-2">
        <div>状態</div>
        <Space.Compact className="flex-1">
          <Select mode="multiple" className="w-full"></Select>
          <Button type="primary" className="bg-success hover:!bg-success-400">送信</Button>
        </Space.Compact>
      </div>
      <div lang="p-2" className="flex flex-col gap-2 p-2">
        {!isCopy && nodes.map((item, index) => (
          <ProcessBar {...item} mail={mail} key={index} onClickDetail={(id) => detailRef.current.open(id)}>
            <ProcessBarButtons {...item} mail={mail} />
          </ProcessBar>
        ))}
      </div>
      <Label>REMARK</Label>
      <Form.Item name="remark" className="m-2">
        <Input.TextArea readOnly />
      </Form.Item>
      <Mail mail={mail} onSuccess={refreshNodes}></Mail>
      <MailDetail modal={detailRef} />
    </div>
  )
}

export default ProcessStatus