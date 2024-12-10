import { Button, Modal, Input, Form, Select } from "antd"
import { useState, useContext, useEffect } from "react"
import { DetailDataContext } from "./dataProvider"
import { MAIL_TO_ACC, MAIL_TO_CUSTOMER, MAIL_TO_CUSTOMS_DECLARANT, MAIL_TYPE_NORMAL } from "@/constant"
import { Checkbox } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import { useAsyncCallback } from "@/hooks"
import { request } from "@/apis/requestBuilder"
import { useMemo } from "react"
import pubSub from "@/helpers/pubSub"
import { basename } from "@/helpers"
import { useRef } from "react"
import classNames from "classnames"
import { Divider } from "antd"
import {isArray} from "lodash";

const FileSelect = ({ files: originFiles, fileType, value, onChange, vertical }) => {
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
    <div className={classNames('grid gap-8 mb-4', vertical ? 'grid-cols-1' : 'grid-cols-2')}>
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


const Mail = ({ mail, onSuccess = () => {} }) => {
  const [open, setOpen] = useState(false)
  const { files, form: orderForm } = useContext(DetailDataContext)
  const [mailToType, setMailToType] = useState(null)
  const mailType = useRef(MAIL_TYPE_NORMAL)
  const [toOptions, setToOptions] = useState([]);
  const [ccOptions, setCcOptions] = useState([]);
  const simpleMode = useMemo(() => [MAIL_TO_ACC, MAIL_TO_CUSTOMS_DECLARANT].includes(mailToType), [mailToType])
  const [form] = Form.useForm()
  const [title, setTitle] = useState('送信')
  const [fileType, setFileType] = useState(null)

  const [setDefaultValue, loading] = useAsyncCallback(async (mailInfo) => {
    setToOptions([])
    setCcOptions([])
    setTitle(mailInfo.title)
    form.resetFields()
    const simple = [MAIL_TO_ACC, MAIL_TO_CUSTOMS_DECLARANT].includes(mailInfo.to) ? 1 : 0
    form.setFieldsValue({
      'node_id': mailInfo.nodeId,
      'order_id': orderForm.getFieldValue('id'),
      'simple': simple
    })
    setMailToType(mailInfo.to)
    setFileType(mailInfo.file)
    mailType.current = mailInfo.type
    const rep = await request('/admin/order/get_mail_default').get({
      'order_id': orderForm.getFieldValue('id'),
      'node_id': mailInfo.nodeId,
    }).send()
    const mails = []
    const cc = []
    const to = []
    for(const item of rep) {
      mails.push({
        subject: item.subject,
        content: item.content,
      })
      if(!item.contact) {
        cc.push([])
        to.push([])
        continue
      }
      if(simple) {
        to.push(
          item.contact.map(item => ({
            value: item.id,
            label: item.name
          }))
        )
      } else {
        let contacts = item.contact
        if(!isArray(contacts)) {
          contacts = [contacts]
        }
        for(const contact of contacts) {
          to.push([{
            value: contact.email
          }])
          if(contact.cc) {
            cc.push(item.contact.cc.split(',').map(item => ({ value: item })))
          }
        }
      }
    }
    setCcOptions(cc)
    setToOptions(to)
    form.setFieldValue('mails', mails)
  })

  const [send, sending] = useAsyncCallback(async () => {
    const mailData = await form.validateFields()
    const data = { ...mailData }
    const url = mailType.current === MAIL_TYPE_NORMAL ? '/admin/order/send_email' : '/admin/order/change_order_request'
    await request(url).data(data).send()
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
    width={simpleMode ? 500 : 800}
    open={open}
    title={title}
    onCancel={() => setOpen(false)}
    footer={null}
    forceRender
    maskClosable={false}
    loading={loading}
  >
    <Form form={form} layout="vertical" className="p-4">
      <Form.Item noStyle name="order_id"></Form.Item>
      <Form.Item noStyle name="node_id"></Form.Item>
      <Form.Item noStyle name="simple"></Form.Item>
      <Form.List name="mails">{list => list.map((props) => (
        <div key={props.key}>
          {props.name > 0 && <Divider className="my-4" />}
          <Form.Item label="受信者" name={[props.name, 'to']} rules={[{ required: true, message: '必須項目です' }]}>
            { simpleMode ? (
              <Checkbox.Group options={toOptions[props.name]}></Checkbox.Group>
            ) : (
              <Select mode="tags" options={toOptions[props.name]} />
            )}
          </Form.Item>
          {!simpleMode && (<Form.Item label="CC" name={[props.name, 'cc']}>
            <Select mode="tags" options={ccOptions[props.name]} />
          </Form.Item>)}
          {!simpleMode && (
            <Form.Item label="件名" name={[props.name, 'subject']} rules={[{ required: true, message: '必須項目です' }]}>
              <Input></Input>
            </Form.Item>
          )}
          {mailToType === MAIL_TO_ACC && (
            <Form.Item label="金额" name={[props.name, 'amount']} rules={[{ required: true, message: '必須項目です' }]}>
              <Input></Input>
            </Form.Item>
          )}
          {fileType && (
            <Form.Item noStyle name={[props.name, 'files']}>
              <FileSelect files={files} fileType={fileType} vertical={simpleMode}></FileSelect>
            </Form.Item>
          )}
          {!simpleMode && (
            <Form.Item label="本文" name={[props.name, 'content']}>
              <Input.TextArea rows={7}></Input.TextArea>
            </Form.Item>
          )}
        </div>
      ))}</Form.List>
      <div className="flex gap-2 justify-center">
        <Button loading={sending} className="w-32" type="primary" onClick={send}>確認</Button>
        <Button className="w-32" onClick={() => setOpen(false)}>CANCEL</Button>
      </div>
    </Form>
  </Modal>
}

export default Mail
