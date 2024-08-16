import { Button, Modal, Table } from "antd";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DetailDataContext } from "../dataProvider";
import dayjs from "dayjs";
import { REQUEST_TYPE_ADVANCE, REQUEST_TYPE_NORMAL } from "@/constant";

const ListModal = ({ instance }) => {
  const { requestBooks, form } = useContext(DetailDataContext)
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
          dataSource={requestBooks}
          pagination={false}
          columns={[
            { dataIndex: 'name', title: '履歴請求書' },
            { dataIndex: 'created_at', title: '时间' , render: value => dayjs(value).format('YYYY-MM-DD HH:mm:ss')  },
            { title: '操作',  dataIndex:'id', render: (id, row) =>  (
              <div className="btn-link-group">
                <span className="btn-link" onClick={() => navigate(`/rb/edit/${id}/order/${row['order_id']}/type/${row['type']}`)}>編集</span>
                <span className="btn-link">预览</span>          
                <span className="btn-link">删除</span>
              </div>
            ) },
          ]}
        />
      </div>
      <div className="flex justify-center gap-2">
        <Button className="w-32" type="primary" onClick={() => navigate(`/rb/add/${form.getFieldValue('id')}/type/${REQUEST_TYPE_NORMAL}`)}>新增请求书</Button>
        <Button className="w-32" type="primary" onClick={() => navigate(`/rb/add/${form.getFieldValue('id')}/type/${REQUEST_TYPE_ADVANCE}`)}>新增立替请求书</Button>
        <Button className="w-32" onClick={() => setOpen(false)}>取消</Button>
      </div>
    </Modal>
  )
}

export default ListModal