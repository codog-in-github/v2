import Label from "@/components/Label"
import {Form, Space, Select, Button, Input, Popconfirm, Modal} from "antd"
import classNames from "classnames"
import {forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState} from "react"
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
  FILE_TYPE_COST,
  GATE_SELF,
  MAIL_TO_CUSTOMS_DECLARANT,
} from "@/constant"
import Mail from "./Mail"
import * as Icon from '@/components/Icon'
import { LoadingOutlined } from "@ant-design/icons"
import MailDetail from "./MailDetail"
import { useAsyncCallback } from "@/hooks"
import { request } from "@/apis/requestBuilder"
import pubSub from "@/helpers/pubSub"
const Light = ({ children, loading, active, className, onToggle = () => {} }) => {
  const activeClassNames = ['!bg-[#ffe3dd]', '!text-[#fd7556]', '!border-[#fd7556]']
  return (
    <Popconfirm
      title={'このお仕事は不要ですね？'}
      onConfirm={() => onToggle(!active)}
      okText={'はい'}
      cancelText={'いいえ'}
    >
      <div
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
          {loading ? <LoadingOutlined className="text-white"/> : <Icon.Light className="h-8 w-8"/>}
        </div>
        <div className="w-6 text-right mr-2">
          {children}
        </div>
      </div>
    </Popconfirm>
  )
}

const ConfirmModal = forwardRef(function ConfirmModal(_, ref) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const callbacks = useRef({
    resolve: () => {},
    reject: () => {}
  });

  useImperativeHandle(ref, () => ({
    confirm() {
      setOpen(true)
      setReason('')
      return new Promise((resolve, reject) => {
        callbacks.current = { resolve, reject }
      })
    }
  }), [])

  return (
    <Modal
      title={'确认'}
      open={open}
      onOk={() => {
        if(!reason) {
          return
        }
        callbacks.current.resolve(reason)
        setOpen(false)
      }}
      onCancel={() => {
        callbacks.current.reject()
        setOpen(false)
      }}
    >
      <Form.Item label={'理由'}>
        <Input onChange={(e) => setReason(e.target.value)} value={reason} />
      </Form.Item>
    </Modal>
  )
})


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
  mailTimes,
  onClickDetail,
  toggleName,
  toggleAt
}) => {
  const { changeNodeStatus, changingNodeStatus} = useContext(DetailDataContext)
  let context = children
  const confirmModalRef = useRef(null);

  if (!canDo) {
    context = null
  } else if (isEnd) {
    const mailData = {
      nodeType,
      nodeId: [nodeId],
      type: MAIL_TYPE_REDO,
      file: [FILE_TYPE_OPERATIONS],
      title: `${EXPORT_NODE_NAMES[nodeType]} - BL訂正`,
      to: MAIL_TO_SHIP
    }
    context = (
      [ORDER_NODE_TYPE_SUR, ORDER_NODE_TYPE_BL_COPY].includes(nodeType) && (
        <Button  type="primary" onClick={() => mail.current.open(mailData)}>BL訂正</Button>
      )
    )
  } else if(redo) {
    context = children
  }
  return (
    <>
      <div className="flex gap-4 items-center h-8 [&:has(button)>.hidden]:block [&:has(.show-dashed)>.hidden]:block">
        <Light
          onToggle={(status) => {
            if (changingNodeStatus) {
              return
            }
            if(nodeType === ORDER_NODE_TYPE_REQUEST) {
              confirmModalRef.current?.confirm()
                .then(reason => changeNodeStatus(nodeId, status, reason))
                .then(() => pubSub.publish('Info.Toast', '提交成功', 'success'))
            } else {
              changeNodeStatus(nodeId, status)
            }
          }}
          active={canDo && !isEnd}
        >{EXPORT_NODE_NAMES[nodeType]}</Light>
        <div className="hidden flex-1 border-dotted border-t border-[#b2b2b2]"></div>
        {!canDo && toggleName && <div className={'show-dashed'}>{toggleName} {toggleAt}</div>}
        {mailTimes > 0 && <div>{sendTime} {sender}</div>}
        {context}
        {mailTimes > 0 && <Button onClick={() => onClickDetail(nodeId, nodeType)}>詳細</Button>}
      </div>
      { nodeType === ORDER_NODE_TYPE_REQUEST && <ConfirmModal ref={confirmModalRef} /> }
    </>
  )
}
const getMailTo = (nodeType, step) => {
  switch (nodeType) {
    case ORDER_NODE_TYPE_CUSTOMER_DOCUMENTS:
      return MAIL_TO_CUSTOMS_COMPANY
    case ORDER_NODE_TYPE_SUR:
      if (step === SUR_STEP_WAIT_PAY)
        return MAIL_TO_ACC
      return MAIL_TO_CUSTOMER
    case ORDER_NODE_TYPE_PO:
      return MAIL_TO_CAR
    default:
      return MAIL_TO_CUSTOMER
  }
}
const ProcessBarButtons = ({nodeId, nodeType, step, mail, sended, redo}) => {
  const {refreshNodes} = useContext(DetailDataContext)
  const form = Form.useFormInstance()
  const mailData = {
    nodeType,
    nodeId: [nodeId],
    step,
    type: MAIL_TYPE_NORMAL,
    to: getMailTo(nodeType, step),
    file: [FILE_TYPE_OPERATIONS],
    title: `${EXPORT_NODE_NAMES[nodeType]} - 送信`
  }
  const [confirmNode, inConfirm] = useAsyncCallback(async () => {
    await request('/admin/order/node_confirm').get({ id: nodeId, is_confirm: 1 }).send()
    refreshNodes()
    pubSub.publish('Info.Order.Change')
    pubSub.publish('Info.Toast', '确认成功', 'success')
  })
  switch (nodeType) {
    case ORDER_NODE_TYPE_BL_COPY:
      mailData.title = `${EXPORT_NODE_NAMES[nodeType]} - 送信`
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
            mailData.to = MAIL_TO_SHIP
            mailData.title = `${EXPORT_NODE_NAMES[nodeType]} - SUR依赖`
            mailData.file = [FILE_TYPE_COST]
            return (
              <Button type="primary" disabled={step === SUR_STEP_WAIT_PAY} onClick={() => mail.current.open(mailData)}>SUR依赖</Button>
            )
          case SUR_STEP_SENDED:
            mailData.title = `${EXPORT_NODE_NAMES[nodeType]} - 送信`
            return (
              <Button type="primary" disabled={step === SUR_STEP_WAIT_PAY} onClick={() => mail.current.open(mailData)}>送信</Button>
            )
          default:
            return null
      }
    case ORDER_NODE_TYPE_CUSTOMER_DOCUMENTS:
      mailData.file = [FILE_TYPE_CUSTOMS]
      if(form.getFieldValue('gateCompany') === GATE_SELF) {
        mailData.to = MAIL_TO_CUSTOMS_DECLARANT
      }
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
  const { nodes, refreshNodes, isCopy, rootRef, onModifyChange, multiMails } = useContext(DetailDataContext)
  const [multiValue, setMultiValue] = useState(null)
  const detailRef = useRef(null)
  const mail = useRef(null)
  useEffect(() => {
    setMultiValue(null)
  }, [multiMails]);
  const openMail = () => {
    console.log('openMail', multiValue)
    if(!multiValue) {
      return
    }
    mail.current.open({
      nodeType: null,
      nodeId: multiValue.ids,
      type: MAIL_TYPE_NORMAL,
      file: [FILE_TYPE_OPERATIONS],
      title: `${multiValue.label} - 送信`,
      to: MAIL_TO_CUSTOMER
    })
  }
  return (
    <div className={className}>
      <Label>進捗状況</Label>
      <div className="p-2 flex items-center gap-2">
        <div>状態</div>
        <Space.Compact className="flex-1">
          <Select
            className="w-full"
            value={multiValue?.value}
            onChange={(_, option) => setMultiValue(option)}
            getPopupContainer={() => rootRef.current}
            dropdownAlign={{
              overflow: { adjustY: false }
            }}
            options={multiMails}
          ></Select>
          <Button type="primary" className="bg-success hover:!bg-success-400" onClick={openMail}>送信</Button>
        </Space.Compact>
      </div>
      <div lang="p-2" className="flex flex-col gap-2 p-2">
        {!isCopy && nodes.map((item, index) => (
          <ProcessBar {...item} mail={mail} key={index} onClickDetail={(id, type) => detailRef.current.open(id, type)}>
            <ProcessBarButtons {...item} mail={mail} />
          </ProcessBar>
        ))}
      </div>
      <Label>REMARK</Label>
      <Form.Item name="remarks" className="m-2">
        <Input.TextArea onChange={onModifyChange} />
      </Form.Item>
      <Label className="mt-4">ORDER INFO</Label>
      <Form.Item name="remark" className="m-2">
        <Input.TextArea readOnly onChange={onModifyChange} />
      </Form.Item>
      <Mail
        mail={mail}
        onSuccess={() => {
          refreshNodes()
          pubSub.publish('Info.Order.Change')
        }}
      ></Mail>
      <MailDetail modal={detailRef} />
    </div>
  )
}

export default ProcessStatus
