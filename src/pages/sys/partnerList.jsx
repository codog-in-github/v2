import { Space, Input, Select, Button, Table } from "antd";
import { useState } from "react";
import { useRef } from "react";
import { useAsyncCallback } from "@/hooks";
import { useEffect } from "react";
import { request } from "@/apis/requestBuilder";
import { Link } from "react-router-dom";
import { Form } from "antd";
import { PARTNER_TYPE_CAR, PARTNER_TYPE_CUSTOMS, PARTNER_TYPE_SHIP } from "@/constant";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import TagInput from "@/components/TagInput";
import { Modal } from "antd";
import pubSub from "@/helpers/pubSub";
import { useCallback } from "react";
import { useMemo } from "react";

const AddModal = ({ modal, onSuccess }) => {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const [isEdit, setIsEdit] = useState(false)
  const [modalInstance, modalEl] = Modal.useModal()

  if(modal) {
    modal.current = {
      open(id, type) {
        setIsEdit(!!id)
        form.resetFields()
        form.setFieldValue(['contacts', 0], {})
        setOpen(true)
        if(id) {
          load(id)
        } else {
          form.setFieldValue('type', type)
        }
      }
    }
  }
  
  const [load, loading] = useAsyncCallback(async (id) => {
    const rep = await request('/admin/partner/detail').get({ id }).send()
    if(rep.cc) {
      rep.cc = rep.cc.split('|')
    }
    if(!rep.contacts || !rep.contacts.length) {
      rep.contacts = [{}];
    }
    form.setFieldsValue(rep)
  })
  
  const [submit, inSubmit] = useAsyncCallback(async () => {
    const data = await form.validateFields()
    if(data.cc) {
      data.cc = data.cc.join('|')
    }
    await request('/admin/partner/save').data(data).send()
    onSuccess()
    setOpen(false)
  })

  const del = useCallback((index) => {
    form.setFieldValue(['contacts'], form.getFieldValue(['contacts']).filter((_, i) => i !== index))
  }, [])

  const add = useCallback(() => {
    form.setFieldValue(['contacts'], [...form.getFieldValue(['contacts']), {}])
  }, [])

  const [delCustomer] = useAsyncCallback(async () => {
    const confirm = await modalInstance.confirm({
      title: '确认删除',
      content: '确认删除？',
    })
    if(!confirm) return
    await request('/admin/customer/delete').data({ id: form.getFieldValue('id')  }).send()
    pubSub.publish('Info.Toast', '削除完了', 'success')
    setOpen(false)
    onSuccess()
  })

  return (
    <Modal
      open={open}
      title="お客様新規登録"
      footer={null}
      onCancel={() => setOpen(false)}
      width={800}
      maskClosable={false}
      loading={loading}
    >
      {modalEl}
      <Form layout="vertical" className="mt-8 px-8" form={form}>
        <Form.Item name="id" noStyle></Form.Item>
        <Form.Item name="type" noStyle></Form.Item>
        <div className="grid grid-cols-3 gap-x-4">
          <Form.Item label="お客様名" name="name" rules={[{ required: true, message: 'お客様名' }]} className="col-span-2">
            <Input />
          </Form.Item>
          <Form.Item label="略称" name="abbr" rules={[{ required: true, message: '略称' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="住所" name="addr" className="col-span-3">
            <Input />
          </Form.Item>
          <Form.Item label="法人番号" name="code">
            <Input />
          </Form.Item>
          <Form.Item label="電話" name="tel">
            <Input />
          </Form.Item>
          <Form.Item label="FAX" name="fax">
            <Input />
          </Form.Item>
          <Form.Item label="〒" name="zipcode">
            <Input />
          </Form.Item>
          <Form.Item label="メールアドレス" name="email" className="col-span-2">
            <Input />
          </Form.Item>
          <Form.Item label="CC" name="cc" className="col-span-3">
            <TagInput />
          </Form.Item>
        </div>
        <Form.Item label="担当者信息">
          <Form.List name="contacts">{list => (
            <div className="bg-gray-100 p-4">{
              list.map((props) => (
                <div className="flex gap-4 items-center [&:nth-child(n+2)]:mt-4" key={props.name}>
                  <div className="w-12">担当者</div>
                  <Form.Item noStyle name={[props.name, 'name']} rules={[{ required: true, message: '请输入担当者' }]}>
                    <Input className="flex-1"></Input>
                  </Form.Item>
                  <div className="w-12">携帯</div>
                  <Form.Item noStyle name={[props.name, 'tel']}>
                    <Input className="flex-1"></Input>
                  </Form.Item>
                  <div className="w-24 flex">
                    <Button type="primary" icon={<PlusOutlined />} onClick={add}></Button>
                    {props.name > 0 &&  <Button type="primary" className="ml-2" onClick={() => del(props.name)} danger icon={<MinusOutlined />}></Button>}
                  </div>
                </div>
              ))
            }</div>
          )}</Form.List>
        </Form.Item>
      </Form>
      <div className="flex gap-2 items-center justify-center">
        <Button className="w-32" type="primary" loading={inSubmit || loading} onClick={submit}>确认</Button>
        {isEdit && <Button className="w-32" type="primary" onClick={delCustomer} danger>删除</Button>}
        <Button className="w-32" onClick={() => setOpen(false)}>取消</Button>
      </div>
    </Modal>
  )
};


const usePaginationRef = () => {
  const pagination = useRef({
    showSizeChanger: true,
    showQuickJumper: true,
    total: 0,
    pageSize: 10,
    showTotal: (total) => `共有 ${total} 条`,
  })
  const set = (value) => {
    pagination.current = Object.assign(pagination.current, value)
  }
  const get = () => {
    return {
      'page_size': pagination.current.pageSize,
      'page': pagination.current.current,
    }
  }
  return { pagination, set , get }
}
const usePartnerList = (pagination, filterForm) => {
  const [list, setList] = useState([])
  const [getList, loading] = useAsyncCallback(async () => {
    const rep = await request('/admin/partner/list')
      .get({
        ...pagination.get(),
        ...filterForm.getFieldsValue(),
      }).paginate().send()
    pagination.set({ total: rep.total })
    setList(rep.data)
  })
  return {
    list, getList, loading
  }
};


const PartnerList = () => {
  const modal = useRef(null)
  const [filters] = Form.useForm()
  useEffect(() => {
    filters.setFieldValue('type', PARTNER_TYPE_CAR)
    getList()
  }, [])
  const columns = useMemo(() => [
    {
      title: "お客様",
      dataIndex: "name",
      key: "name",
    },
    {
      title: '略称',
      dataIndex: 'abbr'
    },
    {
      title: '担当者',
      dataIndex: ['default_contact', 'name']
    },
    {
      title: "操作",
      dataIndex: "id",
      key: "option",
      fixed: "right",
      width: 160,
      render: (id) => (
        <div className="btn-link-group">
          <span className="btn-link" onClick={() => modal.current.open(id)}>編集</span>
        </div>
      ),
    },
  ], []);
  const page =  usePaginationRef()
  const {
    list: dataSource, getList, loading
  } = usePartnerList(page, filters)

  return (
    <div className="main-content">
      <Form form={filters}>
        <Space size={[10, 16]} wrap>
          <Form.Item name="name" noStyle>
            <Input placeholder="お客様" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="type" noStyle>
            <Select
              placeholder="类型"
              style={{ width: 200 }}
              options={[
                {label: '陸送会社', value: PARTNER_TYPE_CAR},
                {label: '海運会社', value: PARTNER_TYPE_SHIP},
                {label: '通関会社', value: PARTNER_TYPE_CUSTOMS},
              ]}
              onChange={() => {
                page.set({
                  current: 1
                })
                getList()
              }}
            />
          </Form.Item>
          <Button type="primary" onClick={() => modal.current.open(null, filters.getFieldValue('type'))}>ADD</Button>
          <Button type="primary" onClick={() => {
            page.set({
              current: 1
            })
            getList()
          }}>搜索</Button>
        </Space>
      </Form>
      <Table
        loading={loading}
        rowKey="id"
        className="mt-5"
        dataSource={dataSource}
        columns={columns}
        pagination={page.pagination.current}
        onChange={(e) => {
          page.set(e)
          getList()
        }}
      />
      <AddModal modal={modal} onSuccess={getList} />
    </div>
  );
};
export default PartnerList;
