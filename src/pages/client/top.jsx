import { Space, Input, Select, Button, Table, Tag } from "antd";
import { DashOutlined } from "@ant-design/icons";
import { useState } from "react";

const ClientTop = () => {
  const selectArr = [
    { value: "test1", label: "测试1" },
    { value: "test2", label: "测试2" },
  ];

  const statusArr = [
    { value: 0, label: "全部状态" },
    { value: 1, label: "待报关" },
    { value: 2, label: "运输中" },
    { value: 3, label: "已完成" },
  ];
  const dataSource = [
    {
      id: 1,
      name: "三祥贸易株式会社",
      desi: "2024041081K",
      status: 1,
      cut: "2024-06-06",
      pol: "KOBE , 06/03",
      pod: "BANGKOK , 07/09",
      quantity: "40HQ , 6 ; 20HQ , 6",
    },
    {
      id: 2,
      name: "鹤丸海运株式会社",
      desi: "2024041081K",
      status: 2,
      cut: "2024-06-06",
      pol: "KOBE , 06/03",
      pod: "BANGKOK , 07/09",
      quantity: "20HQ , 2",
    },
    {
      id: 3,
      name: "鹤丸海运株式会社",
      desi: "2024041081K",
      status: 3,
      cut: "2024-06-06",
      pol: "KOBE , 06/03",
      pod: "BANGKOK , 07/09",
      quantity: "20HQ , 2",
    },
  ];

  const columns = [
    {
      title: "番号",
      dataIndex: "desi",
      key: "desi",
    },
    {
      title: "状態",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <div>
          {status === 1 && <Tag color="red">待报关</Tag>}
          {status === 2 && <Tag color="blue">运输中</Tag>}
          {status === 3 && <Tag color="green">已完成</Tag>}
        </div>
      ),
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

    {
      title: "処理",
      key: "option",
      fixed: "right",
      width: 180,
      render: () => (
        <div>
          <span className="text-blue-500 ">
            <a>类似新案件</a>
          </span>
        </div>
      ),
    },
  ];
  const [form, setForm] = useState({
    name: "",
    desi: "",
    status: 0,
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
    <div className="staff-content">
      <div className="flex justify-between items-center">
        <div className="text-[24px] text-gray-700">全部订单</div>
        <Space size={[10, 16]} wrap>
          <Input
            placeholder="番号"
            style={{ width: 160 }}
            value={form.desi}
            onChange={(e) => updateForm({ desi: e.target.value })}
          />
          <Select
            options={statusArr}
            placeholder="全部状态"
            style={{ width: 160 }}
            value={form.status}
            onChange={(val) => updateForm({ status: val })}
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
      </div>
      <Table
        rowKey="id"
        className="mt-5"
        dataSource={dataSource}
        columns={columns}
        pagination={{
          position: ["bottomLeft"],
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

export default ClientTop;
