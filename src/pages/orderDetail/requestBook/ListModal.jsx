import { Button, Modal, Table } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ListModal = ({ instance }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  if(instance) {
    instance.current = {
      open () {
        setOpen(true)
      }
    }
  }
  return (
    <Modal
      title="请求书"
      width={800}
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
    >
      <div className="p-2">
        <Table
          dataSource={[{
            name: '請求書1-20241155K-01',
            datetime: '2024-07-01  08:40:21',
            status: 1,
          }]}
          pagination={false}
          columns={[
            { dataIndex: 'name', title: '履歴請求書' },
            { dataIndex: 'datetime', title: '时间' },
            { title: '操作', render: () =>  (
              <div className="btn-link-group">
                <span className="btn-link">編集</span>
                <span className="btn-link">预览</span>
                <span className="btn-link">删除</span>
              </div>
            ) },
          ]}
        />
      </div>
      <div className="text-center">
        <Button className="w-32" type="primary" onClick={() => navigate('/rb')}>新增请求书</Button>
        <Button className="ml-2 w-32">取消</Button>
      </div>
    </Modal>
  )
}

export default ListModal