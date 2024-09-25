import { Form } from "antd"
import dayjs from "dayjs"
import { pipe, touch } from "@/helpers/utils"
import { request } from "@/apis/requestBuilder"
import { useAsyncCallback } from "@/hooks"
import { useState, useEffect, useCallback, createContext, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import pubSub from "@/helpers/pubSub"


export const DetailDataContext = createContext()

const formDataGenerator =  (rep) => {
  const result = {}
  const setIfExist = (localKey, remoteKey, transform = (v) => v) => {
    if(rep[remoteKey]) {
      result[localKey] = transform(rep[remoteKey])
    }
  }

  setIfExist('customerName', 'company_name')
  setIfExist('bkgNo', 'bkg_no')
  setIfExist('companyCode', 'legal_number')
  setIfExist('vesselName', 'vessel_name')
  setIfExist('docCut', 'doc_cut', dayjs)

  const formatPort = (rawCountry, rawPort) => {
    const [,country = ''] = rawCountry?.split('/') ?? []
    const [, port = ''] = rawPort?.split('/') ?? []
    return `${country}${port}`
  }
  result.pol = formatPort(rep['loading_country_name'], rep['loading_port_name'])
  result.pod = formatPort(rep['delivery_country_name'], rep['delivery_port_name'])
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
  const keys = [1, 2, 3, 4]
  const files = {}
  for(const key of keys) {
    files[key] = rep['files'][key] ?? []
  }
  return files
}

export const useDetailData = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form] = Form.useForm()
  const [messages, setMessages] = useState([])
  const [files, setFiles] = useState({})
  const modified = useRef(false)


  const modifyChangeGenerator = useCallback((onChange) => {
    modified.current = true
    return (...args) => {
      return onChange(...args)
    }
  }, [])

  const onModifyChange = useCallback(() => {
    modified.current = true
  }, [])

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
      .data({
        'id': form.getFieldValue('id')
      })
      .send()
    pubSub.publish('Info.Toast', '删除成功', 'success')
    modified.current = false
    navigate(-1)
  })

  const [fetchOrder, loading] = useAsyncCallback((id) => {
    form.resetFields()
    return request('/admin/order/detail')
    .get({ id })
    .send()
    .then(touch(pipe(
      formDataGenerator,
      form.setFieldsValue.bind(form)
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
  })

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
    fetchOrder(id)
  }, [form, id])


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

  return {
    loading,
    form,
    messages,
    sendMessage,
    sending,
    files,
    saveOrderFile,
    onDeleteFiles,
    onDownloadFiles,
    downloading,
    delOrder,
    deletingOrder,
    modified,
    onModifyChange,
    modifyChangeGenerator
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
