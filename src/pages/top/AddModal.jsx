import { Form, Modal, Input, Select, Button } from "antd"
import { useEffect } from "react"

const AddModal = ({
  open = false,
  onCancel = () => {},
  onOk = () => {},
  onOkEdit = () => {}
}) => {
  const [form] = Form.useForm()
  const handleCancel = () => {
    onCancel()
  }
  const validate = (next) => {
    form.validateFields()
      .then(next)
  }

  useEffect(() => {
    if(open) {
      form.resetFields()
    }
  }, [open, form])

  return (
    <Modal
      open={open}
      title="新規案件"
      footer={(
        <div className="flex items-center justify-center gap-2">
          <Button autoInsertSpace={false} type="primary" onClick={() => validate(onOk)}>保存并关闭</Button>
          <Button autoInsertSpace={false} type="primary" onClick={() => validate(onOkEdit)}>保存并编辑</Button>
          <Button autoInsertSpace={false} color="red" onClick={handleCancel}>取消</Button>
        </div>
      )}
      onOk={() => validate(onOk)}
      onCancel={handleCancel}>
      <div className="p-4">
        <Form form={form} layout="vertical" initialValues={{ customer: null, remark: '' }}>
          <Form.Item name="customer" label="お客様名" rules={[{ required: true, message: 'お客様名を入力してください' }]}>
            <Select>
              <Select.Option value="1">1</Select.Option>
            </Select>
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