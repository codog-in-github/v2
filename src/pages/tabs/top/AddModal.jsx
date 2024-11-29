import { request } from "@/apis/requestBuilder"
import LoadingButton from "@/components/LoadingButton"
import { Form, Modal, Input, Select, Button } from "antd"
import { useCallback } from "react"
import { useState } from "react"
import { useEffect } from "react"

const getCustomers = async () => {
  const rep = await request('admin/customer/list').get().send()
  return rep.map(item => ({
    value: item['id'],
    label: item['name']
  }))
}

const useCustomerSelect = () => {
  const [customer, setCustomers] = useState()
  useEffect(() => {
    getCustomers().then(setCustomers)
  }, [])
  return customer
}

const AddModal = ({
  open = false,
  onCancel = () => {},
  onOk = () => {},
  onOkEdit = () => {},
  onOkRequest = () => {},
}) => {
  const [form] = Form.useForm()
  const customers = useCustomerSelect()

  const cancelHandle = useCallback(() => {
    onCancel()
  }, [onCancel])

  const validate = useCallback((next) => {
    return form.validateFields().then(next)
  }, [form])

  useEffect(() => {
    if(open) {
      form.resetFields()
    }
  }, [open, form])

  return (
    <Modal
      open={open}
      title="新規案件"
      maskClosable={false}
      footer={(
        <div className="flex items-center justify-center gap-2">
          <LoadingButton type="primary" onClick={() => validate(onOk)}>保存して閉じる</LoadingButton>
          <LoadingButton type="primary" onClick={() => validate(onOkEdit)}>保存し編集</LoadingButton>
          <LoadingButton
            type="primary"
            onClick={() => validate(onOkRequest)}
            className={'bg-success hover:!bg-success-400 active:!bg-success-700'}
          >值引案件</LoadingButton>
          <Button color="red" onClick={cancelHandle}>取消</Button>
        </div>
      )}
      onOk={() => validate(onOk)}
      onCancel={cancelHandle}>
      <div className="p-4">
        <Form form={form} layout="vertical" initialValues={{ customer: null, remark: '' }}>
          <Form.Item name="customer" label="お客様名" rules={[{ required: true, message: 'お客様名を入力してください' }]}>
            <Select options={customers} showSearch optionFilterProp="label" />
          </Form.Item>
          <Form.Item name="remark" label="REMARK" rules={[{ required: true, message: 'REMARKを入力してください' }]}>
            <Input.TextArea style={{ height: 120 }} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default AddModal
