import { Space, Input, Select, Button, Table, Tag, Dropdown } from "antd";
import { DashOutlined } from "@ant-design/icons";
import { useState } from "react";
const ColorTag = ({ color }) => {
  const colorObj = {
    red: "#FD7556",
    yellow: "#FBBB21",
    gray: "#D3D6DD",
    green: "#429638",
  };
  return color.map((item, index) => (
    <div
      className="w-[8px] h-[18px] inline-block rounded mr-[3px]"
      style={{ backgroundColor: colorObj[item] }}
      key={index}
    ></div>
  ));
};
const OrderList = () => {
  const selectArr = [
    { value: "test1", label: "测试1" },
    { value: "test2", label: "测试2" },
  ];
  const dataSource = [
    {
      id: 1,
      name: "三祥贸易株式会社",
      desi: "2024041081K",
      bk: "GQF413SK202",
      cut: "2024-06-06",
      pol: "KOBE , 06/03",
      pod: "BANGKOK , 07/09",
      quantity: "40HQ , 6 ; 20HQ , 6",
      status: 1,
      color: [
        "red",
        "red",
        "red",
        "yellow",
        "yellow",
        "gray",
        "gray",
        "gray",
        "green",
        "green",
        "green",
      ],
    },
    {
      id: 2,
      name: "鹤丸海运株式会社",
      desi: "2024041081K",
      bk: "GQF413SK202",
      cut: "2024-06-06",
      pol: "KOBE , 06/03",
      pod: "BANGKOK , 07/09",
      quantity: "20HQ , 2",
      status: 2,
      color: [],
    },
    {
      id: 3,
      name: "鹤丸海运株式会社",
      desi: "2024041081K",
      bk: "GQF413SK202",
      cut: "2024-06-06",
      pol: "KOBE , 06/03",
      pod: "BANGKOK , 07/09",
      quantity: "20HQ , 2",
      status: 3,
      color: [],
    },
  ];

  const items = [
    {
      label: <span>上传资料</span>,
      key: "upload",
    },
    {
      label: <span>下载资料</span>,
      key: "download",
    },
  ];

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
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "BK号",
      dataIndex: "bk",
      key: "bk",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "CUT",
      dataIndex: "cut",
      key: "cut",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "POL , ETD",
      dataIndex: "pol",
      key: "pol",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "POD , ETA",
      dataIndex: "pod",
      key: "pod",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "数量",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "状態",
      dataIndex: "status",
      key: "status",
      render: (status, row) => (
        <div>
          {status === 1 && <ColorTag color={row.color} />}
          {status === 2 && <Tag color="red">未入账</Tag>}
          {status === 3 && <Tag color="blue">已入账</Tag>}
        </div>
      ),
    },
    {
      title: "操作",
      key: "option",
      fixed: "right",
      width: 160,
      render: () => (
        <div>
          <span className="text-blue-500 border-r border-gray-400 mr-3 pr-3">
            <a>編集</a>
          </span>
          <span className="text-blue-500 border-r border-gray-400 mr-3 pr-3">
            <a>复制</a>
          </span>

          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
          >
            <DashOutlined className="text-blue-500 cursor-pointer" />
          </Dropdown>
        </div>
      ),
    },
  ];
  const [form, setForm] = useState({
    name: "",
    desi: "",
    bk: "",
    pol: null,
    pod: null,
  });
  const [page, setPage] = useState({
    current: 1,
    pageSize: 20,
    total: 50,
  });

  const updateForm = (newData) => {
    setForm({ ...form, ...newData });
  };

  const search = () => {
    console.log(form);
  };
  const reset = () => {
    const resetForm = {
      name: "",
      desi: "",
      bk: "",
      pol: null,
      pod: null,
    };
    setForm(resetForm);
  };

  const pageChange = ({ current, pageSize, total }) => {
    setPage({ ...page, current, pageSize, total });
  };

  const showTotal = (total) => `共有 ${total} 条`;

  return (
    <div className="main-content">
      <Space size={[10, 16]} wrap>
        <Input
          placeholder="お客様"
          style={{ width: 200 }}
          value={form.name}
          onChange={(e) => updateForm({ name: e.target.value })}
        />
        <Input
          placeholder="番号"
          style={{ width: 160 }}
          value={form.desi}
          onChange={(e) => updateForm({ desi: e.target.value })}
        />
        <Input
          placeholder="BK号"
          style={{ width: 160 }}
          value={form.bk}
          onChange={(e) => updateForm({ bk: e.target.value })}
        />

        <Select
          options={selectArr}
          placeholder="POL"
          style={{ width: 160 }}
          value={form.pol}
          onChange={(val) => updateForm({ pol: val })}
        />
        <DashOutlined className="text-gray-500" />
        <Select
          options={selectArr}
          placeholder="POD"
          style={{ width: 160 }}
          value={form.pod}
          onChange={(val) => updateForm({ pod: val })}
        />

        <Button type="primary" onClick={search}>
          搜索
        </Button>
        <Button onClick={reset}>重置</Button>
      </Space>
      <Table
        rowKey="id"
        className="mt-5"
        dataSource={dataSource}
        columns={columns}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          total: page.total,
          pageSize: page.pageSize,
          showTotal: showTotal,
        }}
        onChange={(page) => {
          pageChange(page);
        }}
      />
    </div>
  );
};
export default OrderList;
