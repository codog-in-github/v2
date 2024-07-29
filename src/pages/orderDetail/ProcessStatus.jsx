import Label from "@/components/Label"
import { Form, Space, Select, Button, Input } from "antd"
import classNames from "classnames"
import { useContext } from "react"
import { DetailDataContext } from "./dataProvider"
import { EXPORT_NODE_NAMES, ORDER_NODE_TYPE_ACL, ORDER_NODE_TYPE_BL_COPY, ORDER_NODE_TYPE_SUR } from "@/constant"
import Mail from "./Mail"
import { useRef } from "react"
import * as Icon from '@/components/Icon'
import { LoadingOutlined } from "@ant-design/icons"
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
}) => {
  const { changeNodeStatus, changingNodeStatus } = useContext(DetailDataContext)
  let context = children
  if(!canDo) {
    context = null
  } else if(isEnd) {
    context = (
      <>
        <div>2024-07-01 08:40:21  施双</div>
        { [ORDER_NODE_TYPE_SUR, ORDER_NODE_TYPE_BL_COPY].includes(nodeType) && (
          <Button  type="primary" danger>改单申请</Button>
        ) }
        <Button>詳細</Button>
      </>
    )
  }
  return (
    <div className="flex gap-4 items-center h-8">
      <Light onToggle={(status) => { changingNodeStatus || changeNodeStatus(nodeId, status) }} active={canDo && !isEnd}>{EXPORT_NODE_NAMES[nodeType]}</Light>
      <div className="flex-1 border-dashed border-t border-gray-500"></div>
      {context}
    </div>
  )
}
 
const ProcessBarButtons = ({ nodeId, nodeType, step, isEnd, mail }) => {
  const nodeData = { nodeType, nodeId }
  switch (nodeType) {
    case ORDER_NODE_TYPE_ACL:
      return (
        <>
          <Button type="primary" onClick={() => mail.current.open(nodeData)}>送信</Button>
          <Button type="primary">確認</Button>
        </>
      )
    case ORDER_NODE_TYPE_SUR:
      return (
        <>
          <Button type="primary">支払依頼</Button>
          <Button>SUR依頼</Button>
          <Button onClick={() => mail.current.open(nodeData)}>送信</Button>
        </>
      )
    default:
      return (
        <Button type="primary" onClick={() => mail.current.open(nodeData)}>送信</Button>
      )
  }
}


const ProcessStatus = ({className}) => {
  const { nodes } = useContext(DetailDataContext)
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
        {nodes.map((item, index) => (
          <ProcessBar {...item} key={index}>
            <ProcessBarButtons {...item} mail={mail} />
          </ProcessBar>
        ))}
      </div>
      <Label>REMARK</Label>
      <Form.Item name="remark" className="m-2">
        <Input.TextArea readOnly />
      </Form.Item>
      <Mail mail={mail}></Mail>
    </div>
  )
}

export default ProcessStatus