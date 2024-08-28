import { Button, Table, Tag, Modal, Tabs } from "antd";
import { useState } from "react";
import pqs from "@/assets/images/pqs.png";
import pdf from "@/assets/images/pdf.png";

const PdfContent = ({ type }) => {
  const arr = [
    { pdfId: 1, name: "test1" },
    { pdfId: 2, name: "test2" },
    { pdfId: 3, name: "test3" },
  ];
  return (
    <div className="pdf-content clear">
      {arr.map((item) => (
        <div className="item" key={item.pdfId}>
          <img src={pdf} />
          <p className="line-clamp-2 overflow-hidden">{item.name}</p>
        </div>
      ))}
    </div>
  );
};
const StaffPetModal = ({ modalCancel }) => {
  const pageNum = 3;
  const [curNum, setCurNum] = useState(1);
  const items = [
    {
      key: "1",
      label: "通関",
      children: <PdfContent type="1" />,
    },
    {
      key: "2",
      label: "業務",
      children: <PdfContent type="2" />,
    },
    {
      key: "3",
      label: "請求",
      children: <PdfContent type="3" />,
    },
    {
      key: "4",
      label: "仕れ",
      children: <PdfContent type="4" />,
    },
  ];
  const items2 = [
    {
      key: "5",
      label: "請求書1",
      children: <PdfContent type="5" />,
    },
    {
      key: "6",
      label: "請求書2",
      children: <PdfContent type="6" />,
    },
    {
      key: "7",
      label: "合計請求書",
      children: <PdfContent type="7" />,
    },
  ];
  const prev = () => {
    setCurNum((prev) => prev - 1);
  };
  const next = () => {
    setCurNum((prev) => prev + 1);
  };
  const save = () => {};
  const send = () => {
    modalCancel();
  };
  return (
    <div className="modal-content">
      <div className="btn">
        {curNum < pageNum && curNum !== 1 && (
          <Button size="small" onClick={prev}>
            上一页
          </Button>
        )}
        {curNum < pageNum && (
          <Button size="small" onClick={next}>
            下一页
          </Button>
        )}
        {curNum === pageNum && (
          <Button size="small" onClick={save}>
            另存已选
          </Button>
        )}

        {curNum === pageNum && (
          <Button size="small" type="primary" onClick={send}>
            选择并发送
          </Button>
        )}
      </div>
      <div className="left">
        <div className="staff-title">社内管理番号：</div>
        <img src={pqs} />
      </div>
      <div className="right">
        {curNum !== pageNum ? (
          <>
            <div className="staff-title">資料状況</div>
            <Tabs defaultActiveKey="1" items={items} />

            <div className="staff-title mt-7 mb-3" type="2">
              添付ファイル
            </div>

            <PdfContent type="1" />
          </>
        ) : (
          <Tabs defaultActiveKey="1" items={items2} />
        )}
      </div>
    </div>
  );
};

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
      id: 4,
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const total = () => {
    console.log(selectedRowKeys);
    setIsModalOpen(true);
  };

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

      <Modal
        title="合計請求書プレビュー"
        open={isModalOpen}
        onCancel={handleCancel}
        className="staff-modal"
        maskClosable={false}
        footer={null}
        width="80%"
      >
        <StaffPetModal modalCancel={handleCancel} />
      </Modal>
    </div>
  );
};
export default StaffPet;
