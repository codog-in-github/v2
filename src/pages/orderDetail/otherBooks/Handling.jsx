import { request } from "@/apis/requestBuilder";
import { useAsyncCallback } from "@/hooks";
import { Radio, DatePicker, Form, Modal, Input, Row, Col } from "antd";
import dayjs from "dayjs";
import { useContext, useState } from "react";
import { DetailDataContext } from "../dataProvider";
import pubSub from "@/helpers/pubSub";
import { Divider } from "antd";
import { Space } from "antd";

/**
 'in_no','invoice_no','croporate','outputer_symbol','shipper',
        'content','doc_cut','vessel_name', 'cy_cut','voyage',
        'etd','booking','eta','carrier','cy_open','forwarder',
        'container_type','sum_queantity','unity','transprotation',
        'expenses','chassis','item_type','consignee',
        'hs_code','sea_insurance','basel_charge',
        'free_day','bkg_no','basel_back_time','pick_order',
        'pick_order_request','send_pick_order',
        'send_pick_order1','contoms_document','request_date',
        'permission_date','van_day','request_no','type','van_place',
        'acl_insert','surrender_arrangement','pick_place',
        'bl_cut','bl_send','extra_money','carry_place',
        'si_check','bl_no','request_book','c_book'
 */
const dateFileds = ['etd', 'eta', 'cy_open', 'cy_cut', 'doc_cut']
const itemTypeLabels = [
  'バーゼル', '貿管令Ⅰ', '貿管令Ⅱ', '植物', '動物', '危険品', 'その他',
]
const formDataGenerator = (rep) => {
  const form = { ...rep }
  if (form.item_type) {
    form.item_type = form.item_type.split('|')
  } else {
    form.item_type = Array(itemTypeLabels.length).fill('')
  }
  if (form.c_book) {
    form.c_book = form.c_book.split('|')
  } else {
    form.c_book = Array(5).fill('')
  }
  return form
}

const apiDataGenerator = (formData) => {
  const data = { ...formData }
  data.item_type = formData.item_type.join('|')
  data.c_book = formData.c_book.join('|')
  return data
}

const Handling = ({ instance }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { form: detailForm } = useContext(DetailDataContext)

  const [exportBook, exporting] = useAsyncCallback(async () => {
    const formData = form.getFieldsValue()

    await request('/admin/book/handing/export')
      .data(apiDataGenerator(formData))
      .download().send()

    setOpen(false)
    pubSub.publish('Info.Toast', '导出成功', 'success')
  })

  const [setFormData, loading] = useAsyncCallback(async (id) => {
    form.resetFields()
    const rep = await request('/admin/book/handing/get').get({ order_id: id }).send()
    form.setFieldsValue(formDataGenerator(rep))
  })

  if (instance) {
    instance.current = {
      open: () => {
        setOpen(true)
        setFormData(detailForm.getFieldValue("id"))
      },
    }
  }

  return (
    <Modal
      title="荷捌表"
      width={1200}
      open={open}
      onCancel={() => setOpen(false)}
      okText="EXPORT"
      okButtonProps={{ loading: exporting || loading }}
      onOk={exportBook}
      maskClosable={false}
    >
      <Form className="py-4" form={form} labelCol={{ span: 4 }}>
        <Form.Item name="id" noStyle></Form.Item>
        <Form.Item name="order_id" noStyle></Form.Item>
        <div className="grid gap-8 grid-cols-3">
          <Form.Item label="法人番号" name="croporate">
            <Input />
          </Form.Item>
          <Form.Item label="輸出者符号" name="outputer_symbol" labelCol={{ span: 6 }}>
            <Input />
          </Form.Item>
          <Form.Item label="輸出者(SHIPPER)" name="shipper" labelCol={{ span: 8 }}>
            <Input />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <Form.Item label="DOC CUT" name="doc_cut">
            <Input />
          </Form.Item>
          <Form.Item label="本船名" name="vessel_name">
            <Input />
          </Form.Item>
          <Form.Item label="CY CUT" name="cy_cut">
            <Input />
          </Form.Item>
          <Form.Item label="(VOY.NO)" name="voyage">
            <Input />
          </Form.Item>
          <Form.Item label="ETD" name="etd">
            <Input />
          </Form.Item>
          <Form.Item label="BOOKING先" name="booking">
            <Input />
          </Form.Item>
          <Form.Item label="ETA" name="eta">
            <Input />
          </Form.Item>
          <Form.Item label="船社" name="carrier">
            <Input />
          </Form.Item>
          <Form.Item label="CY OPEN" name="cy_open">
            <Input />
          </Form.Item>
          <Form.Item label="通関業者" name="forwarder">
            <Input />
          </Form.Item>
          <Form.Item label="コンテナ">
            <Space.Compact>
              <Form.Item noStyle name="container_type">
                <Input />
              </Form.Item>
              <Form.Item noStyle name="sum_queantity">
                <Input />
              </Form.Item>
              <Form.Item noStyle name="unity">
                <Input />
              </Form.Item>
            </Space.Compact>
          </Form.Item>
          <Form.Item label="ドレー会社" name="transprotation">
            <Input />
          </Form.Item>
          <Form.Item label="スケール" name="expenses">
            <Input />
          </Form.Item>
          <Form.Item label="3軸指定" name="chassis">
            <Input />
          </Form.Item>
        </div>
        <div className="flex gap-2">
          <Form.List name="item_type">{list => (list.map(props => (
            <div key={props.key}>
              <div>{itemTypeLabels[props.name]}</div>
              <div>
                <Form.Item name={props.name}>
                  <Input />
                </Form.Item>
              </div>
            </div>
          )))}</Form.List>
        </div>
        <Form.Item label="CONSIGNEE/BL品名" name="consignee">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="HS CODE 指定" name="hs_code">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="空コンピック日" name="free_day">
          <Input.TextArea />
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="ピックオーダー依頼" labelCol={{ span: 8 }}>
            <div className="flex gap-2 items-center">
              <Form.Item name="pick_order" noStyle>
                <Radio.Group options={[
                  { label: '有', value: '有' },
                  { label: '無', value: '無' }
                ]}></Radio.Group>
              </Form.Item>
              <Form.Item name="pick_order_request" noStyle>
                <Input className="flex-1" />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item
            label="ピックオーダー送付"
            labelCol={{ span: 8 }}
          >
            <Space.Compact>
              <Form.Item noStyle name="send_pick_order"><Input /></Form.Item>
              <Form.Item noStyle name="send_pick_order1"><Input /></Form.Item>
            </Space.Compact>
          </Form.Item>
        </div>
        <Form.Item label="バン詰め日程">
          <Input v-model="form.van_day" />
        </Form.Item>
        <Form.Item label="バン詰め場所">
          <Input v-model="form.van_place" />
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="PICK場所" name="pick_place">
            <Input />
          </Form.Item>
          <Form.Item label="B/L分割" name="bl_cut">
            <Input />
          </Form.Item>
          <Form.Item label="搬入場所" name="carry_place">
            <Input />
          </Form.Item>
          <Form.Item label="お客様SI確認" name="si_check">
            <Input />
          </Form.Item>
          <Form.Item label="社内番号" name="in_no">
            <Input readonly />
          </Form.Item>
          <Form.Item label="INVOICE NO" name="invoice_no">
            <Input />
          </Form.Item>
        </div>
        <Form.Item label="内容" name="content">
          <Input.TextArea />
        </Form.Item>
        <Divider plain orientation="left">進捗状況</Divider>
        <div className="grid grid-cols-2 gap-4">

          <Form.Item label="海上保険" name="sea_insurance">
            <Radio.Group options={[
              { label: '有', value: '有' },
              { label: '無', value: '無' }
            ]} />
          </Form.Item>
          <Form.Item label="バーゼル担当" name="basel_charge" labelCol={{ span: 6 }}>
            <Input />
          </Form.Item>
          <Form.Item label="ブッキングNo." name="bkg_no">
            <Input />
          </Form.Item>
          <Form.Item label="バーゼル返答日時" name="basel_back_time" labelCol={{ span: 6 }}>
            <Input />
          </Form.Item>
        </div>
        <div className="grid grid-cols-3 gap-4">

          <Form.Item
            label="乙仲通関書類送付"
            name="contoms_document"
            labelCol={{ span: 10 }}
          >
            <Input />
          </Form.Item>
          <Form.Item label="申告日" name="request_date">
            <Input />
          </Form.Item>
          <Form.Item label="許可日" name="permission_date">
            <Input />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="申告番号" name="request_no">
            <Input />
          </Form.Item>
          <Form.Item label="件 欄 (区分)" name="type">
            <Input />
          </Form.Item>
          <Form.Item label="ACL , D/R 差し入れ" name="acl_insert">
            <Input />
          </Form.Item>
          <Form.Item label="サレンダー手配" name="surrender_arrangement">
            <Input />
          </Form.Item>
          <Form.Item label="B/L送付" name="bl_send">
            <Input />
          </Form.Item>
          <Form.Item label="追加費用" name="extra_money">
            <Input />
          </Form.Item>
          <Form.Item label="B/L NO." name="bl_no">
            <Input />
          </Form.Item>
          <Form.Item label="請求書" name="request_book">
            <Input />
          </Form.Item>
        </div>
        <Divider />
        <Form.Item label="お客様書類送付">
          <div className="flex gap-2">
            <Form.List name="c_book">{list => (list.map(props => (
              <Form.Item key={props.key} name={props.name}>
                <Input className="flex-1"></Input>
              </Form.Item>
            )))}</Form.List>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Handling
