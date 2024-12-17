import classNames from "classnames";
import { Switch } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ScrollView from "@/components/ScrollView.jsx";
import MessageParse from "@/components/MessageParse.jsx";
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {useSelector, useStore} from "react-redux";
import {useAsyncCallback} from "@/hooks/index.js";
import {request} from "@/apis/requestBuilder.js";
import {setUnread} from "@/store/slices/user.js";
import {MESSAGE_DO_TYPE_ORDER, USER_ROLE_ACC} from "@/constant/index.js";
import QueryString from "qs";
import dayjs from "dayjs";

const toMessageProps = item => {
  let to
  if(item['do_type'] === MESSAGE_DO_TYPE_ORDER) {
    to = `/orderDetail/${item['order_id']}`
  } else {
    const qs = QueryString.parse(item['query'])
    to = `/rb/edit/${qs.id}/order/${qs.order_id}/type/${qs.type}`
  }
  return {
    id: item['id'],
    orderId: item['order_id'],
    isAtMe: item['at_me'] === 1,
    isRead: item['is_read'] === 1,
    content: item['content'],
    datetime: dayjs(item['created_at']).format('YYYY-MM-DD HH:mm:ss'),
    doText: item['do_type'] === MESSAGE_DO_TYPE_ORDER ? '案件処理' : '請求書処理',
    to,
    at: item['receiver'],
    from: item['sender']
  }
}

const useMessages = () => {
  const [messages, setMessages] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [isAtMe, setIsAtMe] = useState(false)

  const [load, loading] = useAsyncCallback(async (atMe = isAtMe) => {
    let lastMessages = messages
    const clear = atMe !== isAtMe
    const data = {
      'page_size': 10,
      'at_me': atMe ? 1 : 0
    }
    if(clear) {
      lastMessages = []
      setHasMore(true)
      setIsAtMe(atMe)
    } else if(!hasMore) {
      return
    } if(lastMessages.length) {
      data['max_id'] = lastMessages[messages.length - 1].id
    }
    const rep = await request('admin/order/message_list')
      .get(data).send()

    if(!rep || !rep.length || rep.length < 10) {
      setHasMore(false)
    }
    setMessages(lastMessages.concat(rep.map(toMessageProps)))
  })

  const [loadTop] = useAsyncCallback(async () => {
    const data = {
      'page_size': 10,
      'at_me': isAtMe ? 1 : 0,
      'min_id': messages[0]?.id
    }
    const rep = await request('admin/order/message_list')
      .get(data).send()
    setMessages(rep.map(toMessageProps).concat(messages))
  })

  const [toggleAtMe] = useAsyncCallback(() => load(!isAtMe))

  useEffect(() => {
    load()
  }, [])

  return { messages, loading, load, loadTop, isAtMe, toggleAtMe }
}


const useReadMessage =  (id, isReadProp) => {
  const [isReadCache, setIsReadCache] = useState(null)
  const store = useStore()

  useEffect(() => {
    setIsReadCache(null)
  }, [isReadProp]);

  const isReadMemo = isReadCache === null ? isReadProp : isReadCache

  const [read, loading] = useAsyncCallback(async () => {
    const nextStatus = !isReadMemo
    const updateCountType = nextStatus ? 'decrement' : 'increment'
    await request('/admin/order/read_message')
      .post({ id, is_read: Number(nextStatus) }).send()

    setIsReadCache(nextStatus)
    store.dispatch(setUnread({
      type: updateCountType,
      count: 1
    }))
  })

  return [ isReadMemo, read, loading ]
}

function At ({ children }) {
  return (
    <span className="message-at">
      @{children}
    </span>
  );
}

function Message({
  id, from, at, datetime, content, isRead: isReadProp, isAtMe, to, doText, showTodoButton
}) {

  const [isRead, read, loading] = useReadMessage(id, isReadProp)
  const navigate = useNavigate()

  return (
    <div className="bg-gray-100 rounded">
      <div className="p-4">
        <div className="text-sm text-gray-400">
          {datetime}
        </div>
        <div className="mt-2">
          {from}：{at && <At>{at}</At>} <MessageParse message={content} />
        </div>
      </div>
      {
        isAtMe && <div className="flex leading-8 text-white">
          <button
            className={classNames(
              "bg-primary flex-1",
              {'!bg-gray-400': isRead }
            )}
            onClick={read}
          >{loading && <LoadingOutlined className="mr-2" />}既読</button>
          { showTodoButton && (
            <button
              className='bg-primary flex-1 border-l'
              onClick={() => navigate(to)}
            >{doText}</button>
          )}
        </div>
      }
    </div>
  );
}

const MessageList = forwardRef(function MessageList({className}, ref) {
  const {messages, toggleAtMe, isAtMe, loadTop, load, loading} = useMessages();
  const isAcc = useSelector(state => state.user.userInfo.role === USER_ROLE_ACC)

  useImperativeHandle(ref, () => ({ loadTop }), [loadTop])

  return (
    <>
      <div className="flex mb-4">
        <div className='mr-auto'>社内伝達</div>
        <div className='mr-1'>@ME</div>
        <Switch loading={loading} onChange={toggleAtMe} value={isAtMe}></Switch>
      </div>
      <ScrollView
        scrollY
        className={classNames(
          'gap-4 flex flex-col flex-1 pr-2',
          className
        )}
        onScrollBottom={() => load()}
      >
        {messages.map(item => (
          <Message key={item.id} showTodoButton={!isAcc} {...item} />
        ))}
        {loading && (
          <div className="text-center">
            <LoadingOutlined className="text-4xl text-gray-400" />
          </div>
        )}
      </ScrollView>
    </>
  )
})
export default MessageList;
