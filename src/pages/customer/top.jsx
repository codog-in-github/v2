import { Space, Input, Select, Button, Table } from "antd";
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

const StaffTop = () => {
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
    },
  ];

  const columns = [
    {
      title: "番号",
      dataIndex: "desi",
      key: "desi",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "BKG NO.",
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
      title: "POL,ETD,ETD(新）",
      dataIndex: "pol",
      key: "pol",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "POD,ETA,ETA(新）",
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
          <ColorTag color={row.color} />
        </div>
      ),
    },
    {
      title: "処理",
      key: "option",
      fixed: "right",
      width: 180,
      render: () => (
        <div>
          <span className="text-blue-500 ">
            <a>新規</a>
          </span>
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
    <div className="staff-content">
      <div className="flex justify-between items-center">
        <div className="text-[24px] text-gray-700">ORDER</div>
        <Space size={[10, 16]} wrap>
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

export default StaffTop;
