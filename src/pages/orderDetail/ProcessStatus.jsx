import Label from "@/components/Label"
import { Button, Input } from "antd"
import { Form } from "antd"
import classNames from "classnames"
const Light = ({ children, active, className }) => {
  return (
    <div className={classNames(
      'flex items-center bg-gray-300 w-fit relative left-3 rounded border-gray-300 border',
      className,
      {
        '!bg-[#ffe3dd]': active,
        '!border-[#fd7556]': active,
        '!text-[#fd7556]': active
      }
    )}>
      <div className={classNames(
        'bg-gray-700 w-6 h-6 rounded-full relative right-3',
        {
          'bg-[#fd7556]': active
        }
      )}></div>
      <div className="w-6 text-right mr-2">{children}</div>
    </div>
  )
}

const ProcessBar = ({ active }) => {
  return (
    <div className="flex gap-4 items-center">
      <Light active={active}>BK</Light>
      <div className="flex-1 border-dashed border-t border-gray-500"></div>
      <div>2024-07-01 08:40:21  施双</div>
      <Button>詳細</Button>
    </div>
  )
}

const ProcessStatus = ({className}) => {
  return (
    <div className={className}>
      <Label>進捗状況</Label>
      <div lang="p-2" className="flex flex-col gap-2 p-2">
        <ProcessBar></ProcessBar>
        <ProcessBar active></ProcessBar>
      </div>
      <Label>REMARK</Label>
      <Form.Item name="remark" className="m-2">
        <Input.TextArea disabled />
      </Form.Item>
    </div>
  )
}

export default ProcessStatus