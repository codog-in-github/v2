import { request } from "@/apis/requestBuilder"
import {EXPORT_NODE_NAMES, IMPORT_NODE_NAMES, ORDER_TYPE_EXPORT} from "@/constant"
import { useAsyncCallback } from "@/hooks"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import {useSelector} from "react-redux";

const getOrders = (params) => {
  return request('admin/order/top_list')
    .get(params).send()
}

const ordersSort = (orders) => {
  const newOrders = []
  for(const item of orders['top']) {
    const nodeNames = item['order']['order_type'] === ORDER_TYPE_EXPORT ? EXPORT_NODE_NAMES : IMPORT_NODE_NAMES
    newOrders.push({
      top: true,
      renderKey: `top-${item['id']}`,
      orderId: item['order']['id'],
      nodeId: item['id'],
      topName: nodeNames[item['node_id']],
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
  const orderType = useSelector(state => state.order.type)

  const [refresh, loading] = useAsyncCallback(async () => {
    const rep = await getOrders(
      Object.assign({ 'order_type': orderType }, form.getFieldsValue())
    )
    setOrders(ordersSort(rep))
  }, [])

  useEffect(() => {
    form.setFieldsValue({
      'filter_key': 'bkg_no',
      'filter_value': '',
    })
    refresh()
  }, [orderType])

  return {
    orders,
    loading,
    refresh
  }
}
