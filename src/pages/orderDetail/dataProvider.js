import { Form } from "antd"
import dayjs from "dayjs"
import { pipe, touch } from "@/helpers/utils"
import { request } from "@/apis/requestBuilder"
import { useAsyncCallback } from "@/hooks"
import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import pubSub from "@/helpers/pubSub"
import { createContext } from "react"

export const DetailDataContext = createContext()

export const newConatainer = () => {
  return {
    commodity: '',
    containerType: '',
    quantity: '',
  }
}
export const newCar = () => {
  return {}
}

const orderNodesGenerator = ({ nodes = []}) => {
  const data = []
  for(const item of nodes) {
    data.push({
      nodeId: item['id'],
      nodeType: item['node_id'],
      canDo: item['is_enable'] === 1,
      sended: item['mail_status'] === 1,
      isEnd:  item['is_confirm'] === 1,
      sendTime: item['mail_at'],
      sender: item['sender']
    })
  }
  return data
}


const formDataGenerator = (rep) => {
  const result = {}
  const setIfExist = (localKey, remoteKey, transform = (v) => v) => {
    if(rep[remoteKey]) {
      result[localKey] = transform(rep[remoteKey])
    }
  }
  /**
   * * Management 管理情報
   * $table->string('old_id')->default('')->comment('老系统订单id');
   * $table->tinyInteger('order_type')->default(1)->comment('订单类型 1出口 2进口');
   * $table->date('bkg_date')->comment('下单日期');
   * $table->string('bkg_no', 100)->default('')->comment('订单号');
   * $table->string('bl_no')->default('')->comment('bl_no');
   * $table->tinyInteger('bkg_type')->default(0)->comment('类型1-7为固定 8自定义');
   * $table->string('month')->default('')->comment('下单月');
   * $table->integer('month_no')->default(0)->comment('本月第几个订单');
   * $table->string('tag')->default('')->comment('标签');
   * $table->string('order_no')->default('')->comment('社内管理番号年月+本月第几单+标签');
   * $table->string('custom_com_id')->default('')->comment('报关公司id');
   */
  setIfExist('id', 'id')
  setIfExist('orderDate', 'bkg_date', dayjs)
  setIfExist('bkgNo', 'bkg_no')
  setIfExist('blNo', 'bl_no')
  if(rep['bkg_type']) {
    result.type = {
      key: rep['bkg_type'],
      text:  rep['bkg_type_text'] ?? ''
    }
  }
  setIfExist('orderNo', 'order_no')
  setIfExist('gateCompany', 'custom_com_id')

  /**
   * * customer お客様情報
   * $table->integer('customer_id')->default(0)->comment('客户id');
   * $table->string('company_name')->default('')->comment('名称');
   * $table->string('short_name')->default('')->comment('简称');
   * $table->string('zip_code')->default('')->comment('邮编');
   * $table->string('email')->default('')->comment('邮编');
   * $table->string('address')->default('')->comment('地址');
   * $table->string('header')->default('')->comment('负责人');
   * $table->string('mobile')->default('')->comment('联系方式');
   * $table->string('legal_number')->default('')->comment('法人番号');
   */
  setIfExist('customerName', 'company_name')
  setIfExist('customerAbbr', 'short_name')
  setIfExist('customerPostalCode', 'zip_code')
  setIfExist('customerAddr', 'address')
  setIfExist('customerResponsiblePersion', 'header')
  setIfExist('customerContact', 'mobile')
  setIfExist('companyCode', 'legal_number')

  /**
   * * ship 船社信息
   * $table->string('carrier')->default('')->comment('船社');
   * $table->string('c_staff')->default('')->comment('c_staff');
   * $table->string('service')->default('')->comment('service');
   * $table->string('vessel_name')->default('')->comment('船名');
   * $table->string('voyage')->default('')->comment('航线');
   */
  setIfExist('carrier', 'carrier')
  setIfExist('vesselName', 'vessel_name')
  setIfExist('voyage', 'voyage')
   /**
   * * loading 装船信息
   * $table->integer('loading_country_id')->default(0)->comment('装船国家id');
   * $table->string('loading_country_name')->default('')->comment('装船国家名');
   * $table->integer('loading_port_id')->default(0)->comment('装船港口id');
   * $table->string('loading_port_name')->default('')->comment('装船港口名');
   * $table->date('etd')->nullable()->comment('预计交货时间');
   * $table->date('cy_open')->nullable()->comment('开港日');
   * $table->date('cy_cut')->nullable()->comment('截港日');
   * $table->date('doc_cut')->nullable()->comment('文件结关时间');
   */
  setIfExist('loadingCountry', 'loading_country_id')
  setIfExist('loadingCountryName', 'loading_country_name')
  setIfExist('loadingPort', 'loading_port_id')
  setIfExist('loadingPortName', 'loading_port_name')
  setIfExist('etd', 'etd', dayjs)
  setIfExist('cyOpen', 'cy_open', dayjs)
  setIfExist('cyCut', 'cy_cut', dayjs)
  setIfExist('docCut', 'doc_cut', dayjs)

  /** 
   * * delivery
   * $table->integer('delivery_country_id')->default(0)->comment('抵达国家id');
   * $table->string('delivery_country_name')->default('')->comment('抵达国家名');
   * $table->integer('delivery_port_id')->default(0)->comment('抵达港口id');
   * $table->string('delivery_port_name')->default('')->comment('抵达港口名');
   * $table->date('eta')->nullable()->comment('预计到港时间');
   * $table->string('free_time_dem')->default('')->comment('free_time_dem');
   * $table->string('free_time_det')->default('')->comment('free_time_det');
   * $table->string('discharge_country')->default('')->comment('卸货国家');
   * $table->string('discharge_port')->default('')->comment('卸货港口');
   */
  setIfExist('deliveryCountry', 'delivery_country_id')
  setIfExist('deliveryCountryName', 'delivery_country_name')
  setIfExist('deliveryPort', 'delivery_port_id')
  setIfExist('deliveryPortName', 'delivery_port_name')
  setIfExist('eta', 'eta', dayjs)
  setIfExist('freeTimeDem', 'free_time_dem')
  setIfExist('freeTimeDet', 'free_time_det')
  setIfExist('dischargeCountry', 'discharge_country_id')
  setIfExist('dischargeCountryName', 'discharge_country_name')
  setIfExist('dischargePort', 'discharge_port_id')
  setIfExist('dischargePortName', 'discharge_port_name')

  /**
   * * containers 集装箱信息
   * $table->string('common')->default('')->comment('common');
   * $table->string('container_type')->comment('集装箱类型');
   * $table->integer('quantity')->default(1)->comment('数量');
  */
 result.containers = []
 if(rep.containers && rep.containers.length) {
   for(const item of rep.containers) {
    const container = {
      id: item['id'],
      commodity: item['common'],
      containerType: item['container_type'],
      quantity: item['quantity'],
    }
    result.containers.push(container)
   }
  } else {
    result.containers.push(newConatainer())
  }

    /**
     * * car
     * $table->integer('order_id')->comment('订单id');
     * $table->integer('container_id')->comment('集装箱id');
     * $table->string('van_place')->default('')->comment('van_place');
     * $table->tinyInteger('van_type')->default(1)->comment('van类型');
     * $table->tinyInteger('bearing_type')->comment(1)->comment('轴承类型1 二轴 2三轴');
     * $table->dateTime('deliver_time')->nullable()->comment('交付日期');
     * $table->string('trans_com')->default('')->comment('运输公司');
     * $table->string('driver')->default('')->comment('司机');
     * $table->string('tel')->default('')->comment('联络方式');
     * $table->string('car')->default('')->comment('车号');
     * $table->string('container')->default('')->comment('集装箱');
     * $table->string('seal')->default('')->comment('封装');
     * $table->string('tare')->default('')->comment('重量');
     * $table->tinyInteger('tare_type')->default(1)->comment('重量类型1 吨 2 kg');
     */
    result.cars = []
    if(rep['details'] && rep['details'].length) {
      for(const item of rep['details']) {
        const car = {
          id: item['id'],
          containerId: item['container_id'],
          vanPlace: item['van_place'],
          vanType: item['van_type'],
          carType: item['bearing_type'],
          date: item['deliver_time'] ? dayjs(item['deliver_time']) : null,
          time: item['deliver_time'] ? dayjs(item['deliver_time']) : null,
          transCom: item['trans_com'],
          driver: item['driver'],
          tel: item['tel'],
          carCode: item['car'],
          container: item['container'],
          seal: item['seal'],
          tare: item['tare'],
          tareType: item['tare_type'],
        }
        result.cars.push(car)
      }
    } else {
      result.cars.push(newCar())
    }
  /**
   * $table->string('remark')->default('')->comment('备注');
   */
  setIfExist('remark', 'remark')
  return result
}

export const apiSaveDataGenerator = (formData) => {
  const result = {}
  const setValue = (localKey, remoteKey, transform = (v) => v) => {
    result[remoteKey] = transform(formData[localKey])
  }
  /**
   * * Management 管理情報
   */
  setValue('id', 'id')
  setValue('orderDate', 'bkg_date', (dayjs) => dayjs.format('YYYY-MM-DD'))
  setValue('bkgNo', 'bkg_no')
  setValue('blNo', 'bl_no')
  result['bkg_type'] = formData.type.key
  result['bkg_type_text'] = formData.type.text
  setValue('orderNo', 'order_no')
  setValue('gateCompany', 'custom_com_id')

  /**
   * * customer お客様情報
   */
  setValue('customerName', 'company_name')
  setValue('customerAbbr', 'short_name')
  setValue('customerPostalCode', 'zip_code')
  setValue('customerAddr', 'address')
  setValue('customerResponsiblePersion', 'header')
  setValue('customerContact', 'mobile')
  setValue('companyCode', 'legal_number')

  /**
   * * ship 船社信息
   */
  setValue('carrier', 'carrier')
  setValue('vesselName', 'vessel_name')
  setValue('voyage', 'voyage')
   /**
   * * loading 装船信息
   */
  setValue('loadingCountry', 'loading_country_id')
  setValue('loadingCountryName', 'loading_country_name')
  setValue('loadingPort', 'loading_port_id')
  setValue('loadingPortName', 'loading_port_name')
  setValue('etd', 'etd', (dayjs) => dayjs?.format('YYYY-MM-DD HH:mm:ss'))
  setValue('cyOpen', 'cy_open', (dayjs) => dayjs?.format('YYYY-MM-DD HH:mm:ss'))
  setValue('cyCut', 'cy_cut', (dayjs) => dayjs?.format('YYYY-MM-DD HH:mm:ss'))
  setValue('docCut', 'doc_cut', (dayjs) => dayjs?.format('YYYY-MM-DD HH:mm:ss'))

  /** 
   * * delivery
   */
  setValue('deliveryCountry', 'delivery_country_id')
  setValue('deliveryCountryName', 'delivery_country_name')
  setValue('deliveryPort', 'delivery_port_id')
  setValue('deliveryPortName', 'delivery_port_name')
  setValue('eta', 'eta', (dayjs) => dayjs?.format('YYYY-MM-DD HH:mm:ss'))
  setValue('freeTimeDem', 'free_time_dem')
  setValue('freeTimeDet', 'free_time_det')
  setValue('dischargeCountry', 'discharge_country_id')
  setValue('dischargeCountryName', 'discharge_country_name')
  setValue('dischargePort', 'discharge_port_id')
  setValue('dischargePortName', 'discharge_port_name')

  /**
   * * containers 集装箱信息
  */
  result['containers'] = []
  for(const item of formData.containers) {
    const container = {
      'id' : item.id ?? '',
      'common' : item.commodity ?? '',
      'container_type' : item.containerType ?? '',
      'quantity' : item.quantity ?? '',
    }
    result['containers'].push(container)
  }

    /**
    * * car
    */
  const details = []
  result['details'] = details
  for(const item of formData.cars) {
    const date = item.date?.format('YYYY-MM-DD') ?? ''
    const time = item.time?.format(' HH:mm:ss') ?? ''
    const detail = {
      'id' : item.id ?? '',
      'container_id' : item.containerId ?? '',
      'van_place': item.vanPlace ?? '',
      'van_type': item.vanType ?? '',
      'bearing_type': item.carType ?? '',
      'deliver_time': date + time,
      'trans_com': item.transCom ?? '',
      'driver': item.driver ?? '',
      'tel': item.tel ?? '',
      'car': item.carCode ?? '',
      'container': item.container ?? '',
      'seal': item.seal ?? '',
      'tare': item.tare ?? '',
      'tare_type': item.tareType ?? '',
    }
    details.push(detail)
  }
  return result
}

const toMessageProps = (item) => {
  return {
    id: item['id'],
    from: item['sender'],
    at: item['receiver'],
    content: item['content'],
    time: dayjs(item['created_at']).format('YYYY-MM-DD HH:mm:ss')
  }
}
const messagesGenerator = (rep) => {
  if(rep['messages'] && rep['messages'].length) {
    return rep['messages'].map(toMessageProps)
  }
  return []
}

const filesGenerator = (rep) => {
  const keys = [0, 1, 2, 3]
  const files = {}
  for(const key of keys) {
    files[key] = rep['files'][key] ?? []
  }
  return files
}
export const useDetailData = () => {
  const { id } = useParams()
  const [form] = Form.useForm()
  const [nodes, setNodes] = useState([])
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const [files, setFiles] = useState({})

  const isTempOrder = nodes.length === 0

  const onDeleteFiles = useCallback((deleteFiles, success, fail) => {
    request('/admin/delete_files')
      .data({ 'files': Object.values(deleteFiles).flat() })
      .send()
      .then(() => {
        setFiles(prev => {
          const _files = {
            ...prev
          }
          for(const key in deleteFiles) {
            _files[key] = prev[key].filter(file => !deleteFiles[key].includes(file))
          }
          return _files
        })
        success()
      })
      .catch(fail)
  }, [])
  
  const [onDownloadFiles, downloading] = useAsyncCallback((downloadFiles, success, fail) => {
    return Promise.all(Object.values(downloadFiles).flat().map(file => {
      return request(file).get().download(file.split('/').pop()).send()
        .then(success)
        .catch(fail)
    }))
  })

  const [delOrder, deletingOrder] = useAsyncCallback(async () => {
    await request('/admin/order/delete')
      .post()
      .send({
        'id': form.getFieldValue('id')
      })
    pubSub.publish('Info.Toast', '删除成功', 'success')
    window.history.back()
  })

  const [saveOrder, savingOrder] = useAsyncCallback(async () => {
    let formData
    try {
      formData = await form.validateFields()
    } catch ({ errorFields }) {
      for(const field of errorFields) {
        for(const error of field.errors) {
          pubSub.publish('Info.Toast.Error', new Error(error))
        }
      }
      return
    }
    await request('/admin/order/edit_order')
      .data(apiSaveDataGenerator(formData))
      .send()
    pubSub.publish('Info.Toast', '保存成功', 'success')
  }, [form, id])
  const saveOrderFile = ({ fileUrl, type }) => {
    const _files = {
      ...files
    }
    if(!_files[type]) {
      _files[type] = []
    }
    _files[type].push(fileUrl)
    setFiles(_files)
  }
  const scrollBottom = () => {
    const messageBoardDOM = document.getElementById('message-board')
    messageBoardDOM.scrollTo({
      top: messageBoardDOM.scrollHeight,
      behavior: 'smooth'
    })
  }
  useEffect(() => {
    setLoading(true)
    request('/admin/order/detail')
      .get({ id })
      .send()
      .then(touch(pipe(
        formDataGenerator,
        form.setFieldsValue.bind(form)
      )))
      .then(touch(pipe(
        orderNodesGenerator,
        setNodes
      )))
      .then(touch(pipe(
        messagesGenerator,
        setMessages,
        () => setTimeout(scrollBottom, 20)
      )))
      .then(touch(pipe(
        filesGenerator,
        setFiles,
      )))
      .finally(() => setLoading(false))
  }, [form, id])

  const [refreshNodes] = useAsyncCallback(() => 
    request('/admin/order/detail')
      .get({ id })
      .send()
      .then(touch(pipe(
        orderNodesGenerator,
        setNodes
      )))
  )

  const [sendMessage, sending] = useAsyncCallback(async ({msg, at}) => {
    const data = { 'order_id': id, 'content': msg }
    if(at) {
      data['receive_id'] = at
    }
    const res = await request('/admin/order/send_message').data(data).send() 
    setMessages([
      ...messages,
      toMessageProps(res)
    ])
    setTimeout(scrollBottom, 20)
  })

  const [changeNodeStatus, changingNodeStatus] = useAsyncCallback(async (id, enable) => {
    if(isTempOrder)
      return
    await request('/admin/order/change_node_status')
      .data({
        'id': id,
        'is_enable': enable ? 1 : 0
      })
      .send()
    const newNodes = [...nodes]
    nodes.find(item => item.nodeId === id).canDo = enable
    console.log(newNodes)
    setNodes(newNodes)
  })

  return {
    loading,
    form,
    nodes,
    messages,
    sendMessage,
    sending,
    files,
    saveOrderFile,
    onDeleteFiles,
    onDownloadFiles,
    downloading,
    saveOrder,
    savingOrder,
    isTempOrder,
    changeNodeStatus,
    changingNodeStatus,
    refreshNodes,
    delOrder,
    deletingOrder
  }
}

export const useAtUserOptions = () => {
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
