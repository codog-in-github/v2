import { Space, Input, Select, Button, Table, Tag, Dropdown } from "antd";
import { DashOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useRef } from "react";
import { useAsyncCallback } from "@/hooks";
import { useEffect } from "react";
import { request } from "@/apis/requestBuilder";
import { EXPORT_NODE_NAMES } from "@/constant";
import { Popover } from "antd";
import { Link } from "react-router-dom";
import { Form } from "antd";
import {useSelector} from "react-redux";

const nodeNames = Object.values(EXPORT_NODE_NAMES)

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
const useOrderList = (pagination, filterForm) => {
  const orderType = useSelector(state => state.order.type)
  const [list, setList] = useState([])
  const [getList, loading] = useAsyncCallback(async () => {
    const rep = await request('/admin/order/list')
      .get({
        ...pagination.get(),
        ...filterForm.getFieldsValue(),
        'order_type': orderType
      }).paginate().send()
    pagination.set({ total: rep.total, })
    setList(rep.data.map(item => ({
      id: item['id'],
      name: item['company_name'],
      desi: item['order_no'],
      bk: item['bkg_no'],
      cyCut: item['cy_cut'],
      pol: item['loading_port_name'],
      pod: item['delivery_port_name'],
      quantity: item['containers'].map(item => `${item['container_type']}-${item['quantity']}`).join('; '),
      status: 1,
      color: [
        "gray",
        "gray",
        "gray",
        "gray",
        "gray",
        "gray",
        "gray",
        "gray",
        "gray",
        "gray",
        "gray",
      ],
    })))
  })
  return {
    list, getList, loading
  }
};


const ColorTag = ({ color }) => {
  const colorObj = {
    red: "#FD7556",
    yellow: "#FBBB21",
    gray: "#D3D6DD",
    green: "#429638",
  };
  return color.map((item, index) => (
    <Popover key={index} content={nodeNames[index]} trigger="hover">
      <div
        className="w-[8px] h-[18px] inline-block rounded mr-[3px]"
        style={{ backgroundColor: colorObj[item] }}
      ></div>
    </Popover>
  ));
};

const columns = [
  {
    title: "お客様",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "番号",
    dataIndex: "desi",
    key: "desi",
  },
  {
    title: "BKG No.",
    dataIndex: "bk",
    key: "bk",
  },
  {
    title: "CY CUT",
    dataIndex: "cyCut",
    key: "cut",
  },
  {
    title: "POL",
    dataIndex: "pol",
    key: "pol",
  },
  {
    title: "POD",
    dataIndex: "pod",
    key: "pod",
  },
  {
    title: "数量",
    dataIndex: "quantity",
    key: "quantity",
  },
  // {
  //   title: "状態",
  //   dataIndex: "status",
  //   key: "status",
  //   render: (status, row) => (
  //     <div>
  //       {status === 1 && <ColorTag color={row.color} />}
  //       {status === 2 && <Tag color="red">未入账</Tag>}
  //       {status === 3 && <Tag color="blue">已入账</Tag>}
  //     </div>
  //   ),
  // },
  {
    title: "処理",
    dataIndex: "id",
    key: "option",
    fixed: "right",
    width: 160,
    render: (id) => (
      <div className="btn-link-group">
        <Link className="btn-link" to={`/orderDetail/${id}`}>編集</Link>
        {/* <a className="btn-link">复制</a> */}
        {/* <Dropdown
          menu={{
            items: [
              {
                label: <span>上传资料</span>,
                key: "upload",
              },
              {
                label: <span>下载资料</span>,
                key: "download",
              },
            ],
          }}
          trigger="click"
        >
          <DashOutlined className="text-primary cursor-pointer ml-2 btn-link" />
        </Dropdown> */}
      </div>
    ),
  },
];

const OrderList = () => {
  useEffect(() => {
    getList()
  }, [])
  const [filters] = Form.useForm()
  const page =  usePaginationRef()
  const {
    list: dataSource, getList, loading
  } = useOrderList(page, filters)

  return (
    <div className="main-content">
      <Form form={filters}>
        <Space size={[10, 16]} wrap>
          <Form.Item name="company_name" noStyle>
            <Input placeholder="お客様" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="order_no" noStyle>
            <Input placeholder="番号" style={{ width: 160 }} />
          </Form.Item>
          <Form.Item name="bkg_no" style={{ width: 160 }} noStyle>
            <Input placeholder="BK号"></Input>
          </Form.Item>
          {/* <Form.Item name="pol" noStyle>
            <Select placeholder="POL" style={{ width: 160 }} />
          </Form.Item>
          <DashOutlined className="text-gray-500" />
          <Form.Item name="pod" noStyle>
            <Select placeholder="POD" style={{ width: 160 }}/>
          </Form.Item> */}
          <Button type="primary" onClick={getList}>搜索</Button>
          <Button onClick={() => {filters.resetFields();getList()}}>重置</Button>
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
    </div>
  );
};
export default OrderList;
