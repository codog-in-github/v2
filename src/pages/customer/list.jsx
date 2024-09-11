import { Button, Input, Row, Col, Avatar, Progress } from "antd";
import { MinusOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useAsyncCallback } from "@/hooks";
import { useEffect } from "react";
import { request } from "@/apis/requestBuilder";
import { Modal } from "antd";
import { useRef } from "react";
import { Form } from "antd";
import SkeletonList from "@/components/SkeletonList";
import { useCallback } from "react";
import pubSub from "@/helpers/pubSub";
import TagInput from "@/components/TagInput";
import * as Icon from '@/components/Icon'
import { themeColor } from "@/helpers/color";

const CustomerAddModal = ({ modal, onSuccess }) => {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const [isEdit, setIsEdit] = useState(false)
  const [modalInstance, modalEl] = Modal.useModal()

  if(modal) {
    modal.current = {
      open(id) {
        setIsEdit(!!id)
        form.resetFields()
        form.setFieldValue(['contacts', 0], {})
        setOpen(true)
        if(id) {
          load(id)
        }
      }
    }
  }
  
  const [load, loading] = useAsyncCallback(async (id) => {
    const rep = await request('/admin/customer/detail').get({ id }).send()
    if(rep.cc) {
      rep.cc = rep.cc.split('|')
    }
    form.setFieldsValue(rep)
  })
  
  const [submit, inSubmit] = useAsyncCallback(async () => {
    const data = await form.validateFields()
    if(data.cc) {
      data.cc = data.cc.join('|')
    }
    await request('/admin/customer/save').data(data).send()
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
      content: '确认删除该客户？',
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
    >
      {modalEl}
      <Form layout="vertical" className="mt-8 px-8" form={form}>
        <Form.Item name="id" noStyle></Form.Item>
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

const avatarColors = ['#f37053', '#3e66e8', '#d46de0']
const CustomerCard = ({ item, ...props }) => {
  return (
    <div
      className="border-2 p-5 pb-3 mb-2 relative rounded-lg cursor-pointer hover:border-primary duration-150 overflow-hidden"
      {...props}
    >
      <Icon.CustomerBadge className="absolute top-0 -right-[1px] text-[150px] text-primary"></Icon.CustomerBadge>
      <div className="font-bold truncate">{item.title}</div>
      <div className="flex items-center justify-between">
        <div className="flex-1 flex items-center  border-r border-dashed border-gray-400 ">
          <Avatar
            shape="square"
            size={50}
            style={{
              backgroundColor: avatarColors[item.avatar.charCodeAt(0) % avatarColors.length],
            }}
          >
            <span className="text-[28px]">{item.avatar}</span>
          </Avatar>

          <div className="flex flex-col  pl-2 pr-2">
            <div>{item.person} <span className="text-[#E9A502] text-xs bg-[#FFECC8] p-1 rounded">担当者</span></div>
            <div className="text-[12px] mt-2 text-gray-500">{item.mobile || '電話'}</div>
          </div>
        </div>

        <div className="w-[120px] pl-5 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-[12px] text-gray-500">全部案件</div>
            <div className="text-[12px] text-gray-500">進行中</div>
          </div>

          <div className="flex items-center justify-between leading-none mt-3">
            <div className="text-[22px] text-gray-700 font-bold ">
              {item.all}
            </div>
            <div className="text-[22px] text-gray-700 font-bold">{item.do}</div>
          </div>

          <Progress
            size="small"
            strokeColor={themeColor('primary')}
            percent={item.all ? (item.do / item.all) * 100 : 0}
            showInfo={false}
          />
        </div>
      </div>
    </div>
  );
};

const useCustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [getCustomerList, loading] = useAsyncCallback(async (name) => {
    const list = await request('/admin/customer/list').get({ with_count: 1, name }).send()
    const customers = list.map(item => ({
      id: item['id'],
      title: item['name'],
      avatar: item['abbr'],
      person: item['default_contact']['name'],
      mobile: item['default_contact']['tel'],
      all: item['total'],
      do: item['indo'],
    }))
    setCustomers(customers)
  })
  useEffect(() => {
    getCustomerList()
  }, [])
  return { list: customers, reload: getCustomerList, loading };
};
const CustomerList = () => {
  const { list, reload, loading } = useCustomerList()
  const modal = useRef(null)
  const [filterForm] = Form.useForm()
  const add = () => {
    modal.current.open()
  };

  return (
    <div className="main-content overflow-x-auto">
      <div className="flex items-center justify-between">
        <div>
          <Button type="primary" icon={<PlusOutlined />} onClick={add}>
            お客様新規登録
          </Button>
        </div>
        <Form form={filterForm}>
          <Form.Item name="name" noStyle>
            <Input.Search
              placeholder="お客様"
              onSearch={() => reload(filterForm.getFieldValue('name'))}
              enterButton
            />
          </Form.Item>
        </Form>
      </div>

      <div className="mt-5">
        <div className="grid 2xl:grid-cols-4 sm:grid-cols-3 gap-4">
          <SkeletonList
            skeletonClassName="h-full w-full"
            skeletonCount={8}
            loading={loading}
            list={list}
          >
            {(item) => (
              <CustomerCard onClick={() => modal.current.open(item.id)} item={item} key={item.id} />
            )}
          </SkeletonList>
        </div>
      </div>

      <CustomerAddModal modal={modal} onSuccess={reload}></CustomerAddModal>
    </div>
  );
};

export default CustomerList;
