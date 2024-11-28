import {forwardRef, useImperativeHandle, useState} from "react";
import {Form, Modal} from "antd";
import FileInput from "@/components/FileInput.jsx";
import {useAsyncCallback} from "@/hooks/index.js";
import {request} from "@/apis/requestBuilder.js";
import pubSub from "@/helpers/pubSub.js";

const UploadModal = forwardRef(function UploadModal ({ onSuccess }, ref) {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()

  const [upload, loading] = useAsyncCallback(async () => {
    const data = await form.validateFields()
    await request('admin/acc/entry').form({
      id: data.id,
      voucher: data.files[0]
    }).send()

    pubSub.publish('Info.Toast', '成功', 'success')
    setOpen(false)
    onSuccess()
  })

  useImperativeHandle(ref, () => ({
    open(id) {
      setOpen(true)
      form.setFieldValue('id', id)
    }
  }), [])

  return (
    <Modal
      title={'上传凭证'}
      open={open}
      onOk={upload}
      onCancel={() => setOpen(false)}
      okButtonProps={{ loading }}
    >
      <Form form={form}>
        <Form.Item noStyle name={'id'}></Form.Item>
        <Form.Item
          label={'凭证'}
          name={'files'}
          rules={[{ required: true, message: '请上传凭证' }]}
        >
          <FileInput />
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default UploadModal
