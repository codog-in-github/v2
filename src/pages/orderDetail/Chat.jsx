import { request } from "@/apis/requestBuilder"
import Label from "@/components/Label"
import { useAsyncCallback } from "@/hooks"
import { Button, Input, Select, Space } from "antd"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const useAtUserOptions = () => {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    request('/admin/user/user_list').get().send()
      .then(data => {
        setOptions(data.map(item => ({
          value: item.id,
          label: item.name
        })))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])
  return {
    options,
    loading
  }
}

const useMessages = () => {
  const [messages, setMessages] = useState([])
  const orderId = useParams().id
  const {
    callback: reload,
    loading
  } = useAsyncCallback(async () => {
    /**
     *  {
            id: 1,
            from: '吉田',
            at: '范扬',
            content: '今天内完成报关资料。',
            time: '2024-06-02  10:21:14'
          }
     */
    const rep = await request('/admin/order/message_list')
      .get({ 'order_id': orderId  }).send()
    console.log(rep)
  }, [setMessages, orderId])

  const {
    callback: sendMessage,
    loading: sending
  } = useAsyncCallback(async (msg, at) => {
    const data = { 'order_id': orderId, 'content': msg }
    if(at) {
      data['receive_id'] = at
    }
    await request('/admin/order/send_message').data(data).send() 
  }, [setMessages])

  useEffect(() => {
    reload()
  }, [reload])
  return {
    messages,
    reload,
    sendMessage,
    loading,
    sending
  }
}
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
const MessageBoard = ({ messages, loading }) => {
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
    <div className="bg-gray-200 p-2 flex-1">
      {loading ? 'loading...' : null}
      {msgEle}
    </div>
  )
}
const MessageInput = ({ onSend, inSending = false }) => {
  const [at, setAt] = useState('')
  const [msg, setMsg] = useState('')
  const { id: orderId } = useParams()
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
    <Space.Compact className="flex h-16 mt-2">
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
const Chat = ({ className }) => {
  const { messages, loading, sending, sendMessage } = useMessages()
  return (
    <div className={className}>
      <Label>社内伝達</Label>
      <div className="p-2 flex-1 flex flex-col">
        <MessageBoard loading={loading} messages={messages} />
        <MessageInput onSend={() => {}}  inSending={sending} />
      </div>
    </div>
  )
}

export default Chat
