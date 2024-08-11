import { Button, Input, Row, Col, Avatar, Progress } from "antd";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAsyncCallback } from "@/hooks";
import { useEffect } from "react";
import { request } from "@/apis/requestBuilder";
import { Modal } from "antd";
import { useRef } from "react";
import { Form } from "antd";
import SkeletonList from "@/components/SkeletonList";

const CustomerAddModal = ({ modal, onSuccess }) => {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  if(modal) {
    modal.current = {
      open() {
        setOpen(true)
      }
    }
  }
  const [submit, loading] = useAsyncCallback(async () => {
    const data = await form.validateFields()
    await request('/admin/customer/save').data(data).send()
    onSuccess()
    setOpen(false)
  })
  return (
    <Modal
      open={open}
      title="お客様新規登録"
      footer={null}
      onCancel={() => setOpen(false)}
      width={800}
    >
      <Form className="mt-8 pr-8" form={form} labelCol={{ span: 4 }}>
        <Form.Item label="お客様名" name="company_name" rules={[{ required: true }]}>
          <Input placeholder="お客様名" />          
        </Form.Item>
        <Form.Item label="略称" name="short_name" rules={[{ required: true }]}>
          <Input placeholder="略称" />          
        </Form.Item>
        <Form.Item label="担当者" name="header" rules={[{ required: true }]}>
          <Input placeholder="担当者" />          
        </Form.Item>
        <Form.Item label="法人番号" name="legal_number" rules={[{ required: true }]}>
          <Input placeholder="法人番号" />          
        </Form.Item>
        <Form.Item label="電話番号" name="mobile" rules={[{ required: true }]}>
          <Input placeholder="電話番号" />          
        </Form.Item>
        <Form.Item label="E-MAIL" name="mail" rules={[{ required: true }]}>
          <Input placeholder="email" />          
        </Form.Item>
        <Form.Item label="メールアドレス" name="email">
          <Input placeholder="メールアドレス" />          
        </Form.Item>
        <Form.Item label="住所" name="address">
          <Input placeholder="住所" />          
        </Form.Item>
        <Form.Item label="FAX" name="fax">
          <Input placeholder="FAX" />          
        </Form.Item>
        <Form.Item label="郵便番号" name="zip_code">
          <Input placeholder="郵便番号" />          
        </Form.Item>
      </Form>
      <div className="flex gap-2 items-center justify-center">
        <Button className="w-32" type="primary" loading={loading} onClick={submit}>确认</Button>
        <Button className="w-32" onClick={() => setOpen(false)}>取消</Button>
      </div>
    </Modal>
  )
};

const CustomerCard = ({ item }) => {
  const navigate = useNavigate()
  const handleClick = (id) => {
    navigate(`/customer/${id}/top`)
  };

  return (
    <div
      className="border-2  px-2 py-2 relative rounded-lg cursor-pointer hover:border-primary duration-150"
      onClick={() => handleClick(item.id)}
    >
      <div className="absolute top-0 right-0 text-[12px] bg-primary text-white px-[10px] py-[4px] rounded leading-none">
        情報編集
        <RightOutlined className="ml-1" />
      </div>
      <div className="font-bold">{item.title}</div>
      <div className="flex items-center justify-between">
        <div className="flex-1 flex items-center  border-r border-dashed border-gray-400 ">
          <Avatar
            shape="square"
            size={50}
            style={{
              backgroundColor: "#426CF6",
            }}
          >
            <span className="text-[28px]">{item.avatar}</span>
          </Avatar>

          <div className="flex flex-col  pl-2 pr-2">
            <div>{item.person}</div>
            <div className="text-[12px] text-gray-500">{item.mobile}</div>
          </div>
        </div>

        <div className="w-[120px] pl-2 flex flex-col">
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
            percent={(item.do / item.all) * 100}
            showInfo={false}
          />
        </div>
      </div>
    </div>
  );
};

const useCustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [getCustomerList, loading] = useAsyncCallback(async () => {
    const list = await request('/admin/customer/list').get().send()
    const customers = list.map(item => ({
      id: item['id'],
      title: item['company_name'],
      avatar: item['short_name'],
      person: item['header'],
      mobile: item['mobile'],
      all: 123,
      do: 4,
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

  const [keyword, setKeyword] = useState("");

  const onSearch = (value) => {
    setKeyword(value);
  };

  const add = () => {
    modal.current.open()
  };

  return (
    <div className="main-content">
      <div className="flex items-center justify-between">
        <div>
          <Button type="primary" icon={<PlusOutlined />} onClick={add}>
            お客様新規登録
          </Button>
        </div>
        <div>
          <Input.Search
            placeholder="お客様"
            onSearch={onSearch}
            enterButton
            value={keyword}
          />
        </div>
      </div>

      <div className="mt-5">
        <div className="grid grid-cols-5 gap-4">
          <SkeletonList
            skeletonClassName="h-full w-full"
            skeletonCount={8}
            loading={loading}
            list={list}
          >
            {(item) => (
              <CustomerCard item={item} key={item.id} />
            )}
          </SkeletonList>
        </div>
      </div>

      <CustomerAddModal modal={modal} onSuccess={reload}></CustomerAddModal>
    </div>
  );
};

export default CustomerList;
