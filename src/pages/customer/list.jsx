import { Button, Input, Avatar, Progress } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useAsyncCallback } from "@/hooks";
import { useEffect } from "react";
import { request } from "@/apis/requestBuilder";
import { useRef } from "react";
import { Form } from "antd";
import SkeletonList from "@/components/SkeletonList";
import * as Icon from '@/components/Icon'
import { themeColor } from "@/helpers/color";
import CustomerAddModal from '@/components/CustomerAddModal'

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
      mobile: item['tel'],
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
    <div className="no-padding m-[20px] p-[20px] bg-white rounded">
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

      <CustomerAddModal ref={modal} onSuccess={reload}></CustomerAddModal>
    </div>
  );
};

export default CustomerList;
