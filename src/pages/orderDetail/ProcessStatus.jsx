import Label from "@/components/Label"
import { Button, Input } from "antd"
import { Form } from "antd"
import classNames from "classnames"
import { useContext } from "react"
import { DetailDataContext } from "./dataProvider"
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
  canSend,
  sended,
  lightName,
}) => {
  return (
    <div className="flex gap-4 items-center">
      <Light onToggle={console.log} active={canSend && !sended}>{lightName}</Light>
      <div className="flex-1 border-dashed border-t border-gray-500"></div>
      { sended ? (
          [
            <div key="1">2024-07-01 08:40:21  施双</div>,
            <Button key="2">詳細</Button>
          ]
      ) : (
        <Button disabled={!canSend} type="primary" key="2">送信</Button>
      )}
    </div>
  )
}

const ProcessStatus = ({className}) => {
  const { nodes } = useContext(DetailDataContext)
  return (
    <div className={className}>
      <Label>進捗状況</Label>
      <div lang="p-2" className="flex flex-col gap-2 p-2">
        {nodes.map((item, index) => (
          <ProcessBar {...item} key={index} />
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