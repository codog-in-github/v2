import { request } from "@/apis/requestBuilder.js";
import FileInput from "@/components/FileInput.jsx";
import { useAsyncCallback } from "@/hooks/index.js";
import { Modal, Form } from "antd";
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import File from "@/components/File.jsx";
import {DEPARTMENTS} from "@/constant/index.js";

const CompModal = forwardRef(function CompModal ({ onSuccess }, ref) {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const [detail, setDetail] = useState(null)

  const [getDetail, loading] = useAsyncCallback(async (id) => {
     const res = await request('admin/acc/todo_detail')
       .get().query({ id }).send()
    setDetail(res)
  })

  useImperativeHandle(ref, () => {
    return {
      open: (id) => {
        form.resetFields()
        getDetail(id)
        form.setFieldValue('id', id)
        setOpen(true)
      }
    }
  }, [form])


  const [done, submitting] = useAsyncCallback(async () => {
    const formData = await form.validateFields()
    await request('admin/acc/done').form(formData).send()
    setOpen(false)
    onSuccess()
  })

  return (
    <Modal
      title="付款"
      open={open}
      onOk={done}
      loading={loading}
      onCancel={() => setOpen(false)}
      okButtonProps={{ loading: submitting }}
      maskClosable={false}
    >
      <Form form={form} className="mt-8" labelCol={{ span: 4 }}>
        <Form.Item noStyle name='id' ></Form.Item>
        <Form.Item label={'创建人'}>{detail?.created_by_name}</Form.Item>
        <Form.Item label={'所属部门'}>{
          detail?.order.department ? DEPARTMENTS[detail.order.department] : ''
        }</Form.Item>
        <Form.Item label={'文件'}>
          <div className="flex flex-col gap-2">
            {detail?.check_files.map(file => (
              <File
                className={'w-fit'}
                filePath={file}
                key={file}
                onNativeClick={() => {request(file).download().send()}}
              />
            ))}
          </div>
        </Form.Item>
        <Form.Item name='files' label="凭证" rules={[{ required: true, message: '请上传凭证' }]}>
          <FileInput multiple></FileInput>
        </Form.Item>
      </Form>
    </Modal>
  )
});

export default CompModal;
