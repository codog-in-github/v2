import Label from "@/components/Label"
import { Form, Space, Select, Button, Input } from "antd"
import classNames from "classnames"
import { useContext } from "react"
import { DetailDataContext } from "./dataProvider"
import { EXPORT_NODE_NAMES, ORDER_NODE_TYPE_ACL, ORDER_NODE_TYPE_BK, ORDER_NODE_TYPE_BL_COPY, ORDER_NODE_TYPE_CUSTOMER_DOCUMENTS, ORDER_NODE_TYPE_FM, ORDER_NODE_TYPE_SUR } from "@/constant"
const Light = ({ children, active, className, onToggle = () => {} }) => {
  const activeClassNames = ['!bg-[#ffe3dd]', '!text-[#fd7556]', '!border-[#fd7556]']
  return (
    <div
      onClick={() => onToggle(!active)}
      className={classNames(
        'flex items-center bg-gray-300 w-fit relative left-3 rounded border-gray-300 border',
        className,
        active && activeClassNames
      )}
    >
      <div className={classNames(
        'bg-gray-700 w-6 h-6 rounded-full relative right-3',
        active && '!bg-[#fd7556]'
      )}></div>
      <div className="w-6 text-right mr-2">{children}</div>
    </div>
  )
}


const ProcessBar = ({
  canDo,
  isEnd,
  nodeType,
  children
}) => {
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
    <div className="flex gap-4 items-center">
      <Light onToggle={console.log} active={canDo && !isEnd}>{EXPORT_NODE_NAMES[nodeType]}</Light>
      <div className="flex-1 border-dashed border-t border-gray-500"></div>
      {context}
    </div>
  )
}
 
const ProcessBarButtons = ({ nodeType, step, isEnd }) => {
  switch (nodeType) {
    case ORDER_NODE_TYPE_ACL:
      return (
        <>
          <Button type="primary">送信</Button>
          <Button type="primary">確認</Button>
        </>
      )
    case ORDER_NODE_TYPE_SUR:
      return (
        <>
          <Button type="primary">支払依頼</Button>
          <Button>SUR依頼</Button>
          <Button>送信</Button>
        </>
      )
    default:
      return (
        <Button type="primary">送信</Button>
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
            <ProcessBarButtons {...item} />
          </ProcessBar>
        ))}
      </div>
      <Label>REMARK</Label>
      <Form.Item name="remark" className="m-2">
        <Input.TextArea readOnly />
      </Form.Item>
    </div>
  )
}

export default ProcessStatus