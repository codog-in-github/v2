import { request } from "@/apis/requestBuilder"
import { useAsyncCallback } from "@/hooks"
import dayjs from "dayjs"
import { useMemo } from "react"
import { useEffect } from "react"
import { useState } from "react"

const getOrders = () => {
  return request('admin/order/list')
    .get({ 'node_state': 1 }).send()
}

const formatTempOrder = (item) => {
  if(item['bkg_no']) {
    return null
  }
  return {
    isTempOrder: true,
    id: item['id'],
    expiredAt: dayjs(item['created_at']).add(1, 'hour'),
    remark: item['remark'],
    companyName: item['company_name'],
  }
}

const ordersSort = (orders) => {
  const newOrders = []
  // todo 置顶订单
  // 临时订单
  for(const item of orders) {
    const tempOrder = formatTempOrder(item)
    if(tempOrder) {
      newOrders.push(tempOrder)
    }
  }
  // todo 订单
  return newOrders
}

export const useTopOrderList = () => { 
  const [orders, setOrders] = useState([])

  const { loading, callback: refresh } = useAsyncCallback(async () => {
    const rep = await getOrders()
    setOrders(ordersSort(rep))
  }, [])

  useEffect(() => {
    refresh()
  }, [])

  return {
    orders,
    loading,
    refresh
  }
}

const toMessageProps = item => {
  return {
    id: item['id'],
    orderId: item['order_id'],
    isAtMe: item['at_me'] === 1,
    isReaded: item['is_read'] === 1, 
    content: item['content'],
    at: item['receiver'],
    from: item['sender']
  }
}

export const useMessages = () => {
  const [messages, setMessages] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [isAtMe, setIsAtMe] = useState(false)

  const filteredMessages = useMemo(() => {
    if(isAtMe){
      return messages.filter(item => item.isAtMe)
    }
    return messages
  }, [messages, isAtMe])
  
  const { callback: load, loading } = useAsyncCallback(async () => {
    if(!hasMore || loading) {
      return
    }
    const data = {
      'page_size': 10
    }
    if(messages.length) {
      data['max_id'] = messages[messages.length - 1].id
    }
    const rep = await request('admin/order/message_list')
      .get(data).send()

    if(!rep || !rep.length || rep.length < 10) {
      setHasMore(false)
      return
    }
    setMessages(messages.concat(rep.map(toMessageProps)))
  }, [messages, hasMore])

  const  { callback: LoadTop } = useAsyncCallback(async () => {
  })

  useEffect(() => {
    load()
  }, [])

  return { messages, loading, load, LoadTop, filteredMessages, isAtMe, setIsAtMe }
}

export const useReadMessage =  (id) => {
  const [isReaded, setIsReaded] = useState(false)
  const { callback: read, loading } = useAsyncCallback(async () => {
    await request('/admin/order/read_message').post({ id }).send()
    setIsReaded(true)
  })
  return {
    read, loading, isReaded
  }
}