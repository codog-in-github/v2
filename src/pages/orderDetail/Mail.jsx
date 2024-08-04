import { Button, Modal, Input, Form, Select } from "antd"
import { useState, useContext } from "react"
import { DetailDataContext } from "./dataProvider"
import { FILE_TYPE_CUSTOMS } from "@/constant"
import { Checkbox } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import { useAsyncCallback } from "@/hooks"
import { request } from "@/apis/requestBuilder"
import { useParams } from "react-router-dom"
import { useEffect } from "react"

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
  // const [options, setOptions]= useState([])
  // const { callback: getOptions, loading} = useAsyncCallback(async () => {
  //   await request('/admin/order/get_email_options').data({
  //     'node_id': type
  //   }).send()
  // })
  // useEffect(() => {
  //   getOptions()
  // }, [type])
  return (
    <Input onChange={onChange} value={value}></Input>
  )
}


const Mail = ({ mail, onSuccess }) => {
  const [open, setOpen] = useState(false)
  const orderId = useParams().id
  const { files } = useContext(DetailDataContext)
  const [form] = Form.useForm()
  const [mailInfo, setMailInfo] = useState({ title: '送信' })
  const [send, loading] = useAsyncCallback(async () => {
    const mailData = await form.validateFields()
    const data = {
      ...mailData,
      'node_id': mailInfo.nodeId,
      'order_id': orderId
    }
    await request('/admin/order/send_email').data(data).send()
    setOpen(false)
    onSuccess()
  })
  if(mail) {
    mail.current = {
      open(mailInfo) {
        setOpen(true)
        setMailInfo(mailInfo)
        form.setFieldsValue({

        })
      }
    }
  }
  return <Modal
    width={800}
    open={open}
    title={mailInfo.title}
    onCancel={() => setOpen(false)}
    footer={null}
  >
    <Form form={form} layout="vertical" className="p-4">
      <Form.Item label="受信者" name="to">
        <ToSelect></ToSelect>
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