import { Button, Modal, Input, Form, Select } from "antd"
import { useState, useContext, useEffect } from "react"
import { DetailDataContext } from "./dataProvider"
import { FILE_TYPE_CUSTOMS, MAIL_TO_CUSTOMER, MAIL_TO_SHIP, SELECT_ID_SHIP_CONPANY } from "@/constant"
import { Checkbox } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import { useAsyncCallback, useOptions } from "@/hooks"
import { request } from "@/apis/requestBuilder"
import { useParams } from "react-router-dom"
import { useMemo } from "react"

const fileName = (filePath) => {
  return filePath.split('/').pop()
}

const FileSelect = ({ files, value, onChange }) => {
  if(!value){
    value = []
  }
  const removeFile = (file) => {
    onChange(value.filter(item => item !== file))
  }
  return (
    <div className="grid grid-cols-2 gap-8 mb-4">
      <div>
        <div className="mb-2">選択</div>
        <div className="h-32 bg-gray-100 overflow-auto px-4">
          <Checkbox.Group value={value} onChange={onChange} className="block">
            {files.map(item => (
              <label key={item} className="flex gap-2 cursor-pointer my-2">
                <Checkbox value={item} />
                <div className="truncate">{fileName(item)}</div>
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
              <div className="truncate">{fileName(item)}</div>
              <CloseOutlined className="ml-auto" onClick={() => removeFile(item)}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
const ToSelect = ({ type, value, onChange }) => {
  const [customers, setCustomers] = useState([])
  const [shipOriginList, loadingChipCompany] = useOptions(SELECT_ID_SHIP_CONPANY)
  const shipOptions = useMemo(() => {
    return shipOriginList.map(item => ({
      value: item['id'],
      label: item['name']
    }))
  }, [shipOriginList])
  const [getCustomers, loadingCustomers] = useAsyncCallback(async () => {
    const rep = await request('/admin/customer/list').get().send()
    const options = rep.map(item => ({
      value: item['email'],
      label: `${item['company_name']} - ${item['header']} - ${item['email']}`
    }))
    setCustomers(options)
  })
  useEffect(() => { getCustomers() }, [])
  let options = []
  switch (type) {
    case MAIL_TO_CUSTOMER:
      options = customers
      break
    case MAIL_TO_SHIP:
      options = shipOptions
      break
  }
  return (
    <Select
      mode="tags"
      loading={loadingCustomers || loadingChipCompany}
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
  const [setDefaultValue] = useAsyncCallback(async (mailInfo) => {
    setTitle(mailInfo.title)
    form.setFieldsValue({
      'node_id': mailInfo.nodeId,
      'order_id': orderForm.getFieldValue('id')
    })
    // const rep = await request('/admin/order/mail_template')
    //   .get({ 'type': 1, 'order_id': orderForm.getFieldValue('id') }).send()
    // console.log(rep)
  })
  const [send, loading] = useAsyncCallback(async () => {
    const mailData = await form.validateFields()
    const data = { ...mailData }
    await request('/admin/order/send_email').data(data).send()
    setOpen(false)
    onSuccess()
  })
  if(mail) {
    mail.current = {
      open(mailInfo) {
        setOpen(true)
        setDefaultValue(mailInfo)
      }
    }
  }
  return <Modal
    width={800}
    open={open}
    title={title}
    onCancel={() => setOpen(false)}
    footer={null}
  >
    <Form form={form} layout="vertical" className="p-4">
      <Form.Item noStyle name="order_id"></Form.Item>
      <Form.Item noStyle name="node_id"></Form.Item>
      <Form.Item label="受信者" name="to">
        <ToSelect type={mailToType}></ToSelect>
      </Form.Item>
      <Form.Item label="件名" name="subject">
        <Input></Input>
      </Form.Item>
      <Form.Item noStyle name='files'>
        <FileSelect files={files[FILE_TYPE_CUSTOMS]}></FileSelect>
      </Form.Item>
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