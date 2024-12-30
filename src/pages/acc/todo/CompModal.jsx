import { request } from "@/apis/requestBuilder.js";
import FileInput from "@/components/FileInput.jsx";
import { useAsyncCallback } from "@/hooks/index.js";
import {Modal, Form, Button, Input} from "antd";
import {forwardRef, useImperativeHandle, useState} from "react";
import {DEPARTMENTS} from "@/constant/index.js";
import dayjs from "dayjs";
import {basename} from "@/helpers/index.js";
import DashedTitle from "@/components/DashedTitle.jsx";

const CompModal = forwardRef(function CompModal ({ onSuccess }, ref) {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const [detail, setDetail] = useState(null)

  const [getDetail, loading] = useAsyncCallback(async (id) => {
     const res = await request('admin/acc/todo_detail')
       .get().query({ id }).send()
    form.setFieldValue('real_amount', res.amount)
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

  const [reject, rejecting] = useAsyncCallback(async () => {
    const id = form.getFieldValue('id')
    await request('admin/acc/reject').data({ id }).send()
    setOpen(false)
    onSuccess()
  })

  return (
    <Modal
      title={'支払い依頼の詳細'}
      width={'600px'}
      open={open}
      onOk={done}
      loading={loading}
      onCancel={() => setOpen(false)}
      okButtonProps={{ loading: submitting, disabled: rejecting }}
      maskClosable={false}
      footer={(footer) => {
        return (
          <>
            <Button
              danger
              onClick={reject}
              loading={rejecting}
              disabled={submitting}
              type={'primary'}
            >却下</Button>
            {footer}
          </>
        )
      }}
    >
      <Form form={form} className="mt-8" labelCol={{ span: 8 }}>
        <Form.Item noStyle name='id' />

        <DashedTitle rootClassName={'px-4 mb-2'}>申請情况</DashedTitle>
        <div className={'grid grid-cols-2'}>
          <Form.Item label={'所属部署'}>{
            detail?.order.department ? DEPARTMENTS[detail.order.department] : ''
          }</Form.Item>
          <Form.Item label={'作成者'}>{detail?.created_by_name}</Form.Item>
          <Form.Item label={'社内番号'}>{detail?.order.order_no}</Form.Item>
          <Form.Item label={'BKG NO.'}>{detail?.order.bkg_no}</Form.Item>
          <Form.Item
            labelCol={{ span: 4 }}
            label={'申請証憑'}
            className={'col-span-2'}
          >
            <div className="flex flex-col gap-2">
              {detail?.check_files.map(file => (
                <a
                  type={'link'}
                  className={'text-primary-500'}
                  key={file}
                  href={file}
                  target={'_blank'}
                >{basename(file)}</a>
              ))}
            </div>
          </Form.Item>
          <Form.Item
            labelCol={{ span: 4 }}
            label={'作成時間'}
            className={'col-span-2'}
          >{
            dayjs(detail?.created_at).format('YYYY-MM-DD HH:mm:ss')
          }</Form.Item>
        </div>

        <DashedTitle rootClassName={'px-4 my-2'}>支払对象</DashedTitle>
        <Form.Item
          labelCol={{ span: 4 }}
          label={'支払先'}
        >{detail?.pay_to}</Form.Item>
        <Form.Item
          labelCol={{ span: 4 }}
          label={'支払金額'}
          name={'real_amount'}
          rules={[{ required: true }]}
        >
          <Input addonAfter={'¥'} />
        </Form.Item>

        <DashedTitle rootClassName={'px-4 my-2'}>上传支払</DashedTitle>
        <Form.Item name='files' labelCol={{ span: 4 }} label="支払証憑" rules={[{ required: true, message: '请上传凭证' }]}>
          <FileInput multiple></FileInput>
        </Form.Item>
      </Form>
    </Modal>
  )
});

export default CompModal;
