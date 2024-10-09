import {
  Space,
  Input,
  Select,
  Button,
  Table,
  Avatar,
  Tag,
  DatePicker,
} from "antd";
import { DashOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import { cloneDeep } from "lodash";

const ShipList = () => {
  const selectArr = [
    { value: "test1", label: "测试1" },
    { value: "test2", label: "测试2" },
  ];
  const [dataSource, setDataSource] = useState([
    {
      id: 1,
      orgin: "地",
      name: "MARGRETHE MAERSK",
      code: "9V857215",
      bkg: "GQF413SK202",
      bl: "GQF413SK202",
      pol: "KOBE , 06/03",
      pod: "BANGKOK , 07/09",
      etd: "06/08",
      eta: "06/08",
      saveStatus: 1,
      sendStatus: 0,
    },
    {
      id: 2,
      orgin: "",
      name: "CNC SULAWESI",
      code: "416W858",
      bkg: "GQF413SK202",
      bl: "GQF413SK202",
      pol: "TYG,06/10",
      pod: "BGK,06/20",
      etd: "06/22",
      eta: "06/22",
      saveStatus: 0,
      sendStatus: 1,
    },
    {
      id: 3,
      orgin: "山",
      name: "MARGRETHE MAERSK",
      code: "416W858",
      bkg: "GQF413SK202",
      bl: "GQF413SK202",
      pol: "KOBE , 06/03",
      pod: "BANGKOK , 07/09",
      etd: "06/08",
      eta: "06/08",
      saveStatus: 0,
      sendStatus: 0,
    },
  ]);

  const columns = [
    {
      title: "船社",
      dataIndex: "orgin",
      key: "orgin",
      render: (val) =>
        val !== "" && (
          <Avatar size={30} style={{ backgroundColor: "#484848" }}>
            {val}
          </Avatar>
        ),
    },
    {
      title: "船名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "航海号",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "BKG NO.",
      dataIndex: "bkg",
      key: "bkg",
    },
    {
      title: "BL NO.",
      dataIndex: "bl",
      key: "bl",
    },
    {
      title: "POL , ETD",
      dataIndex: "pol",
      key: "pol",
    },
    {
      title: "ETD(新)",
      dataIndex: "etd",
      key: "etd",
      render: (val, row) => (
        <DatePicker
          format="MM/DD"
          value={dayjs(val, "MM/DD", true)}
          suffixIcon=""
          onChange={(_, value) => dateChange(value, "etd", row)}
        />
      ),
    },
    {
      title: "POD , ETA",
      dataIndex: "pod",
      key: "pod",
    },
    {
      title: "ETA(新)",
      dataIndex: "eta",
      key: "eta",
      render: (val, row) => (
        <DatePicker
          format="MM/DD"
          value={dayjs(val, "MM/DD", true)}
          suffixIcon=""
          onChange={(_, value) => dateChange(value, "eta", row)}
        />
      ),
    },
    {
      title: "処理",
      key: "option",
      fixed: "right",
      width: 200,
      render: (_, row) => (
        <div className="flex justify-around">
          {row.saveStatus === 1 ? (
            <Button
              size="small"
              type="primary"
              style={{ backgroundColor: "#429638", fontSize: "12px" }}
              onClick={() => saveRow(row)}
            >
              保存
            </Button>
          ) : (
            <Tag color="green" className="mr-0">
              已存
            </Tag>
          )}

          {row.sendStatus === 1 ? (
            <Button
              size="small"
              type="primary"
              style={{ backgroundColor: "#426CF6", fontSize: "12px" }}
              onClick={() => sendRow(row)}
            >
              发送
            </Button>
          ) : (
            <Tag color="blue" className="mr-0">
              已送
            </Tag>
          )}

          <Button
            size="small"
            type="primary"
            ghost
            style={{ fontSize: "12px" }}
          >
            详情
          </Button>
        </div>
      ),
    },
  ];
  const [form, setForm] = useState({
    orgin: "",
    name: "",
    code: "",
    bkg: "",
    bl: "",
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

  const sendRow = (row) => {
    console.log(row);
  };
  const saveRow = (row) => {
    console.log(row);
  };

  const dateChange = (val, field, row) => {
    row[field] = val;
    const data = cloneDeep(dataSource);
    setDataSource(data);
  };

  return (
    <div className="main-content">
      <Space size={[10, 16]} wrap>
        <Input
          placeholder="船社"
          style={{ width: 160 }}
          value={form.orgin}
          onChange={(e) => updateForm({ orgin: e.target.value })}
        />
        <Input
          placeholder="船名"
          style={{ width: 160 }}
          value={form.name}
          onChange={(e) => updateForm({ name: e.target.value })}
        />
        <Input
          placeholder="航海号"
          style={{ width: 140 }}
          value={form.code}
          onChange={(e) => updateForm({ code: e.target.value })}
        />
        <Input
          placeholder="BKG NO."
          style={{ width: 160 }}
          value={form.bkg}
          onChange={(e) => updateForm({ bkg: e.target.value })}
        />
        <Input
          placeholder="BL NO."
          style={{ width: 160 }}
          value={form.bl}
          onChange={(e) => updateForm({ bl: e.target.value })}
        />
        <Select
          options={selectArr}
          placeholder="POL"
          style={{ width: 120 }}
          value={form.pol}
          onChange={(val) => updateForm({ pol: val })}
        />
        <DashOutlined className="text-gray-500" />
        <Select
          options={selectArr}
          placeholder="POD"
          style={{ width: 120 }}
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
export default ShipList;
