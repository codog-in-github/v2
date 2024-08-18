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
} from "@/constant"
import Mail from "./Mail"
import { useRef } from "react"
import * as Icon from '@/components/Icon'
import { LoadingOutlined } from "@ant-design/icons"
import MailDetail from "./MailDetail"
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
  mail,
  onClickDetail
}) => {
  const mailData = {
    nodeType,
    nodeId,
    title: `${EXPORT_NODE_NAMES[nodeType]} - 改单申请`,
    to: MAIL_TO_SHIP
  }
  const { changeNodeStatus, changingNodeStatus } = useContext(DetailDataContext)
  let context = children
  if(!canDo) {
    context = null
  } else if(isEnd) {
    context = (
      <>
        <div>{sendTime}  {sender}</div>
        { [ORDER_NODE_TYPE_SUR, ORDER_NODE_TYPE_BL_COPY].includes(nodeType) && (
          <Button  type="primary" onClick={() => mail.current.open(mailData)}>改单申请</Button>
        ) }
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
      if(step === SUR_STEP_PAYED) 
        return MAIL_TO_SHIP
      return MAIL_TO_CUSTOMER
    default:
      return MAIL_TO_CUSTOMER
  }
}
const ProcessBarButtons = ({ nodeId, nodeType, step, mail, sended }) => {
  const mailData = {
    nodeType,
    nodeId,
    to: getMailTo(nodeType, step),
    title: `${EXPORT_NODE_NAMES[nodeType]} - 送信`
  }
  switch (nodeType) {
    case ORDER_NODE_TYPE_ACL:
      return (
        <>
          <Button type="primary" onClick={() => mail.current.open(mailData)}>{ sended && '再' }送信</Button>
          { sended && <Button type="primary">確認</Button> }
        </>
      )
    case ORDER_NODE_TYPE_SUR:
      return (
        <>
          { step === SUR_STEP_WAIT_CUSTOMER_CONFIRMED && <Button type="primary" onClick={() => mail.current.open(mailData)}>支払依頼</Button>}
          { step === SUR_STEP_WAIT_PAY && <Button>SUR依頼</Button>}
          { step === SUR_STEP_PAYED && <Button type="primary" onClick={() => mail.current.open(mailData)}>SUR依頼</Button>}
          { step === SUR_STEP_SENDED && <Button type="primary" onClick={() => mail.current.open(mailData)}>送信</Button>}
        </>
      )
    default:
      return (
        <>
          <Button type="primary" onClick={() => mail.current.open(mailData)}>送信</Button>
        </>
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