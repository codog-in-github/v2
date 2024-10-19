import {useCallback, useRef, useState} from "react";
import {Form, Modal} from "antd";
import {useAsyncCallback} from "@/hooks/index.js";

export const useConfirm = (title, content, formProps) => {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const callbacks = useRef({
    resolve: () => {},
    reject: () => {}
  })
  const [onOk] = useAsyncCallback( async () => {
    const formData = await form.validateFields()
    setOpen(false)
    callbacks.current.resolve(formData)
  })
  const onCancel = () => {
    setOpen(false)
    callbacks.current.reject()
  }

  const show = useCallback(() => {
    setOpen(true)
    form.resetFields()
    return new Promise((resolve, reject) => {
      callbacks.current.resolve = resolve
      callbacks.current.reject = reject
    })
  }, [form])

  const ele = (
    <Modal
      title={title}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form form={form} {...formProps}>
        {content}
      </Form>
    </Modal>
  )
  return [ele, show]
}