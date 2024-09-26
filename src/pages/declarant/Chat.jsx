import Label from "@/components/Label"
import { Button, Input, Select, Space } from "antd"
import { useState } from "react"
import { DetailDataContext, useAtUserOptions } from "./dataProvider"
import classNames from "classnames"
import { useContext } from "react"
import MessageParse from "@/components/MessageParse"

const At = ({ children }) => {
  return (
    <span
      className="ml-1 py-1 px-2 rounded-full bg-primary-100 text-primary text-nowrap text-xs inline-block align-baseline"
    >@{children}</span>
  )
}

const Message = ({ from, at, content, time }) => {
  return (
    <div className="flex gap-2 items-start leading-6" >
      <div className="leading-6 w-12 text-right text-xs text-gray-400">{from}</div>
      <div className="h-6 flex items-center">
        <div className="w-1 h-1 bg-primary rounded-full" />
      </div>
      <div className="flex-1 [&_.file-node]:text-xs">
        <MessageParse message={content}></MessageParse>
        {at && <At>{at}</At>}
      </div>
      <div className={'text-xs text-gray-400'}>{time}</div>
    </div>
  )
}
const MessageBoard = ({ messages, disabled }) => {
  const msgEle = []
  if(!disabled) {
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
  }
  return (
    <div id="message-board" className="bg-[#EFF2F4] p-2 flex-1 overflow-auto text-sm">
      {msgEle}
    </div>
  )
}
const MessageInput = ({ onSend, disabled, inSending = false }) => {
  const [at, setAt] = useState('')
  const [msg, setMsg] = useState('')
  const {
    options: users,
    loading,
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
    <Space.Compact className="flex h-11 mb-4 mt-2 text-sm">
      <Select
        className="h-full w-44"
        value={at}
        options={users}
        onChange={setAt}
        loading={loading}
        labelRender={(option) => <span>@{option.label}</span>}
        optionRender={(option) => <span className="text-base">{option.label}</span>}
        popupMatchSelectWidth={200}
        allowClear
      />
      <Input
        value={msg}
        onChange={e => setMsg(e.target.value)}
        className={'text-xs'}
      ></Input>
      <Button disabled={disabled} loading={inSending} className="h-full" onClick={sendBtnClickHandle}>送信</Button>
    </Space.Compact>
  )
}
const Chat = ({ className, sending }) => {
  const {
    isCopy,
    messages,
    sendMessage,
  } = useContext(DetailDataContext)
  return (
    <div
      className={classNames(
        className, 'overflow-hidden'
      )}
    >
      <Label className="flex-shrink-0">社内伝達</Label>
      <div className="p-2 flex-1 flex flex-col h-full">
        <MessageBoard disabled={isCopy} messages={messages} />
        <MessageInput  onSend={sendMessage}  inSending={sending} />
      </div>
    </div>
  )
}

export default Chat
