import { Button, Modal, Input, Form, Select } from "antd"
import { useState, useContext, useEffect } from "react"
import { DetailDataContext } from "./dataProvider"
import { FILE_TYPE_CUSTOMS, MAIL_TO_CUSTOMER } from "@/constant"
import { Checkbox } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import { useAsyncCallback } from "@/hooks"
import { request } from "@/apis/requestBuilder"
import { useMemo } from "react"
import pubSub from "@/helpers/pubSub"
import { basename } from "@/helpers"

const FileSelect = ({ files: originFiles, fileType, value, onChange }) => {
  if(!value){
    value = []
  }
  const files = useMemo(() => {
    if(!fileType || !originFiles) {
      return []
    }
    return fileType.map(key => originFiles[key]).flat()
  }, [originFiles, fileType])
  const removeFile = (file) => {
    onChange(value.filter(item => item !== file))
  }
  return (
    <div className="grid grid-cols-2 gap-8 mb-4">
      <div>
        <div className="mb-2">選択</div>
        <div className="h-32 bg-gray-100 overflow-auto px-4">
          <Checkbox.Group value={value} onChange={onChange} className="block">
            {files?.map(item => (
              <label key={item} className="flex gap-2 cursor-pointer my-2">
                <Checkbox value={item} />
                <div className="truncate">{basename(item)}</div>
              </label>
            ))}
          </Checkbox.Group>
        </div>
      </div>
      <div>
        <div className="mb-2">添付ファイル</div>
        <div className="h-32 bg-gray-100 overflow-auto px-4">
          {value.map(item => (
            <div key={item} className="flex gap-2 items-center my-2">
              <div className="truncate">{basename(item)}</div>
              <CloseOutlined className="ml-auto" onClick={() => removeFile(item)}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
const ToSelect = ({ type, value, onChange }) => {
  const [options, setOptions] = useState([])
  const [load, loading] = useAsyncCallback(async (type) => {
    const rep = await request('/admin/order/get_mail_companies').get({ type }).send()
    if(type === MAIL_TO_CUSTOMER) {
      setOptions(rep.map(item => ({ value: item.email, label: `${item.company_name}-${item.header}-${item.email}` })))
    } else {
      const options = []
      for(let i = 0; i < rep.length; i++) {
        const item = rep[i];
        (item.email ?? '').split(',').filter(item => item).forEach(email => {
          options.push({ value: email, label: `${item.name}-${item.header}-${email}` })
        })
      }
      setOptions(options)
    }
  })
  useEffect(() => {
    load(type)
  }, [type])
  return (
    <Select
      mode="tags"
      loading={loading}
      onChange={onChange}
      value={value}
      options={options}
    />
  )
}


const Mail = ({ mail, onSuccess }) => {
  const [open, setOpen] = useState(false)
  const { files, form: orderForm } = useContext(DetailDataContext)
  const [mailToType, setMailToType] = useState(MAIL_TO_CUSTOMER)
  const [form] = Form.useForm()
  const [title, setTitle] = useState('送信')
  const [fileType, setFileType] = useState(null)
  const setDefaultValue = (mailInfo) => {
    setTitle(mailInfo.title)
    form.resetFields()
    form.setFieldsValue({
      'node_id': mailInfo.nodeId,
      'order_id': orderForm.getFieldValue('id')
    })
    setMailToType(mailInfo.to)
    setFileType(mailInfo.file)
    // const rep = await request('/admin/order/mail_template')
    //   .get({ 'type': 1, 'order_id': orderForm.getFieldValue('id') }).send()
    // console.log(rep)
  }
  const [send, loading] = useAsyncCallback(async () => {
    const mailData = await form.validateFields()
    const data = { ...mailData }
    await request('/admin/order/send_email').data(data).send()
    setOpen(false)
    pubSub.publish('Info.Toast', 'メール送信完了', 'success')
    onSuccess()
  })
  if(mail) {
    mail.current = {
      open(mailInfo) {
        setDefaultValue(mailInfo)
        setOpen(true)
      }
    }
  }
  return <Modal
    width={800}
    open={open}
    title={title}
    onCancel={() => setOpen(false)}
    footer={null}
    forceRender
  >
    <Form form={form} layout="vertical" className="p-4">
      <Form.Item noStyle name="order_id"></Form.Item>
      <Form.Item noStyle name="node_id"></Form.Item>
      <Form.Item label="受信者" name="to" rules={[{ required: true, message: '必須項目です' }]}>
        <ToSelect type={mailToType}></ToSelect>
      </Form.Item>
      <Form.Item label="件名" name="subject" rules={[{ required: true, message: '必須項目です' }]}>
        <Input></Input>
      </Form.Item>
      {fileType && <Form.Item noStyle name='files'>
        <FileSelect files={files} fileType={fileType}></FileSelect>
      </Form.Item>}
      <Form.Item label="本文" name="content">
        <Input.TextArea></Input.TextArea>
      </Form.Item>
      <div className="flex gap-2 justify-center">
        <Button loading={loading} className="w-32" type="primary" onClick={send}>確認</Button>
        <Button className="w-32" onClick={() => setOpen(false)}>CANCEL</Button>
      </div>
    </Form>
  </Modal>
}

export default Mail