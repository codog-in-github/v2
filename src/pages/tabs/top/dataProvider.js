import { request } from "@/apis/requestBuilder"
import {EXPORT_NODE_NAMES, MESSAGE_DO_TYPE_ORDER} from "@/constant"
import { useAsyncCallback } from "@/hooks"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import QueryString from "qs";

const getOrders = (params) => {
  return request('admin/order/top_list')
    .get(params).send()
}

const ordersSort = (orders) => {
  const newOrders = []
  for(const item of orders['top']) {
    newOrders.push({
      top: true,
      renderKey: `top-${item['id']}`,
      orderId: item['order']['id'],
      nodeId: item['id'],
      topName: EXPORT_NODE_NAMES[item['node_id']],
      id: item['order']['id'],
      expiredAt: dayjs(item['top_finish_time']),
      remark: item['remark'],
      contactPerson: item['order']['header'],
      bkgNo: item['order']['bkg_no'],
      contactPhone: item['order']['mobile'],
      avatarText: item['order']['short_name'][0],
      companyName: item['order']['company_name'],
    })
  }
  for(const item of orders['tmp']) {
    newOrders.push({
      isTempOrder: true,
      id: item['id'],
      orderId: item['id'],
      renderKey: `tmp-${item['id']}`,
      expiredAt: dayjs(item['created_at']).add(1, 'hour'),
      remark: item['remark'],
      companyName: item['company_name'],
    })
  }
  for(const item of orders['no_send']) {
    newOrders.push({
      id: item['order']['id'],
      orderId: item['order']['id'],
      renderKey: `no_send-${item['order']['id']}`,
      expiredAt: dayjs(item['created_at']).add(1, 'hour'),
      remark: item['remark'],
      contactPerson: item['order']['header'],
      contactPhone: item['order']['mobile'],
      avatarText: item['order']['short_name'][0],
      bkgNo: item['order']['bkg_no'],
      companyName: item['order']['company_name'],
    })
  }
  // todo 订单
  return newOrders
}

export const useTopOrderList = (form) => {
  const [orders, setOrders] = useState([])

  const [refresh, loading] = useAsyncCallback(async () => {
    const rep = await getOrders(form.getFieldsValue())
    setOrders(ordersSort(rep))
  }, [])

  useEffect(() => {
    form.setFieldsValue({
      'filter_key': 'bkg_no',
      'filter_value': '',
    })
    refresh()
  }, [])

  return {
    orders,
    loading,
    refresh
  }
}

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
    isReaded: item['is_read'] === 1,
    content: item['content'],
    datetime: dayjs(item['created_at']).format('YYYY-MM-DD HH:mm:ss'),
    doText: item['do_type'] === MESSAGE_DO_TYPE_ORDER ? '案件処理' : '請求書処理',
    to,
    at: item['receiver'],
    from: item['sender']
  }
}

export const useMessages = () => {
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

export const useReadMessage =  (id) => {
  const [isReaded, setIsReaded] = useState(false)
  const [read, loading] = useAsyncCallback(async () => {
    await request('/admin/order/read_message').post({ id }).send()
    setIsReaded(true)
  })
  return {
    read, loading, isReaded
  }
}
