import { request } from "@/apis/requestBuilder.js";
import FileInput from "@/components/FileInput.jsx";
import { useAsyncCallback } from "@/hooks/index.js";
import { Modal, Form } from "antd";
import { useState } from "react";

const CompModal = ({
  instance,
  onSuccess = () => {}
}) => {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  if (instance) {
    instance.current = {
      open: (id) => {
        form.resetFields()
        form.setFieldValue('id', id)
        setOpen(true)
      }
    }
  }
  const [done, loading] = useAsyncCallback(async () => {
    const formData = await form.validateFields()
    await request('admin/acc/done').form(formData).send()
    setOpen(false)
    onSuccess()
  })
  return (
    <Modal title="上传凭证" open={open} onOk={done} onCancel={() => setOpen(false)} okButtonProps={{ loading }} maskClosable={false}>
      <Form form={form} className="mt-8">
        <Form.Item noStyle name='id' ></Form.Item>
        <Form.Item name='files' label="凭证" rules={[{ required: true, message: '请上传凭证' }]}>
          <FileInput multiple></FileInput>
        </Form.Item>
      </Form>
    </Modal>
  )
};

export default CompModal;
