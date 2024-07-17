import { Button, Table, Tag } from "antd";
import { useState } from "react";

const StaffPet = () => {
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
      render: (status) => (
        <div>
          {status === 1 && <Tag>作成待</Tag>}
          {status === 2 && <Tag color="red">発送待</Tag>}
          {status === 3 && <Tag color="green">入金済</Tag>}
        </div>
      ),
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [page, setPage] = useState({
    current: 1,
    pageSize: 20,
    total: 50,
  });

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const total = () => {};

  const pageChange = ({ current, pageSize, total }) => {
    setPage({ ...page, current, pageSize, total });
  };

  const showTotal = (total) => `共有 ${total} 条`;

  return (
    <div className="staff-content">
      <div className="flex justify-between items-center">
        <div className="text-[24px] text-gray-700">合計請求書 </div>
        <div className="text-[24px] text-gray-700">
          <Button type="primary" onClick={total}>
            合計請求書
          </Button>
        </div>
      </div>
      <Table
        rowKey="id"
        className="mt-5"
        rowSelection={rowSelection}
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
export default StaffPet;
