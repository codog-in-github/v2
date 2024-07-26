import Label from "@/components/Label"
import { Button, Input, Select, Space } from "antd"
import { useState } from "react"
import { useAtUserOptions } from "./dataProvider"
import classNames from "classnames"

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
const MessageBoard = ({ messages }) => {
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
  return (
    <div id="message-board" className="bg-gray-200 p-2 flex-1 overflow-auto">
      {msgEle}
    </div>
  )
}
const MessageInput = ({ onSend, inSending = false }) => {
  const [at, setAt] = useState('')
  const [msg, setMsg] = useState('')
  const {
    options: users,
    loading
  } = useAtUserOptions()
  const sendBtnClickHandle = () => {
    if(!msg) {
      return
    }
    onSend({ msg, at })
    setAt('')
    setMsg('')
  }
  return (
    <Space.Compact className="flex h-16 my-4 mt-2">
      <Select
        className="h-full w-32"
        value={at}
        options={users}
        onChange={setAt}
        loading={loading}
      />
      <Input value={msg} onChange={e => setMsg(e.target.value)}></Input>
      <Button loading={inSending} className="h-full" onClick={sendBtnClickHandle}>发送</Button>
    </Space.Compact>
  )
}
const Chat = ({ className, messages, sending, onSend }) => {
  return (
    <div className={classNames(
      className, 'h-full overflow-hidden'
    )}>
      <Label className="flex-shrink-0">社内伝達</Label>
      <div className="p-2 flex-1 flex flex-col h-full">
        <MessageBoard messages={messages} />
        <MessageInput onSend={onSend}  inSending={sending} />
      </div>
    </div>
  )
}

export default Chat
