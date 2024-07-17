import Label from "@/components/Label"
import { Button, Input, Select, Space } from "antd"
import { useState } from "react"

const At = ({ children }) => {
  return (
    <span
      className="py-1 px-2 rounded-full bg-primary-100 text-primary text-nowrap text-xs"
    >@{children}</span>
  )
}

const Message = ({ from, at, content, time }) => {
  return (
    <div className="flex gap-2 items-start leading-6" >
      <div className="leading-6 w-12 text-right text-gray-400 text-xs">{from}</div>
      <div className="h-6 flex items-center">
        <div className="w-1 h-1 bg-primary rounded-full" />
      </div>
      <div className="flex-1">
        {content}
        {at && <At>{at}</At>}
      </div>
      <div>{time}</div>
    </div>
  )
}
const MessageBoard = ({ messages = [] }) => {
  const msgEle = []
  for(let i = 0; i < messages.length; i++){
    if(i > 0) {
      msgEle.push(
        <div
          key={`${messages[i].id}-dash`}
          className="h-4 border-gray-400 border-l border-dashed ml-[57px]"
        />
      )
    }
    msgEle.push(
      <Message key={messages[i].id} {...messages[i]}></Message>
    )
  }
  return <div className="bg-gray-200 p-2 flex-1">{msgEle}</div>
}
const MessageInput = ({ onSend }) => {
  const [at, setAt] = useState('')
  const [msg, setMsg] = useState('')
  const sendBtnClickHandle = () => {
    if(!msg) {
      return
    }
    onSend({
      msg, at
    })
    setAt('')
    setMsg('')
  }
  return (
    <Space.Compact className="flex h-16 mt-2">
      <Select className="h-full w-32" value={at} onChange={setAt}>
        <Select.Option value="苏三">@苏三</Select.Option>
      </Select>
      <Input value={msg} onChange={e => setMsg(e.target.value)}></Input>
      <Button className="h-full" onClick={sendBtnClickHandle}>发送</Button>
    </Space.Compact>
  )
}
const messages = [
  {
    id: 1,
    from: '吉田',
    at: '范扬',
    content: '今天内完成报关资料。',
    time: '2024-06-02  10:21:14'
  },
  {
    id: 2,
    from: '吉田',
    at: '范扬',
    content: '这份产品资料客户重新填写过了，需要尽快更新文件！',
    time: '2024-06-02  10:21:14'
  }
]
const Chat = ({ className }) => {
  return (
    <div className={className}>
      <Label>社内伝達</Label>
      <div className="p-2 flex-1 flex flex-col">
        <MessageBoard messages={messages} />
        <MessageInput onSend={() => {}} />
      </div>
    </div>
  )
}

export default Chat
