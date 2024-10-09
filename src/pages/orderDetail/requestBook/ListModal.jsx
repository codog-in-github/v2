import { Button, Modal, Table } from "antd";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DetailDataContext } from "../dataProvider";
import dayjs from "dayjs";
import { REQUEST_TYPE_ADVANCE, REQUEST_TYPE_NORMAL } from "@/constant";
import { request } from "@/apis/requestBuilder";
import { useAsyncCallback } from "@/hooks";

const ListModal = ({ instance }) => {
  const { requestBooks, form, delRequestBook, deletingRequestBook } = useContext(DetailDataContext)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  if(instance) {
    instance.current = {
      open () {
        setOpen(true)
      }
    }
  }
  const [doExport, exporting] = useAsyncCallback(async (id) => {
    await request('/admin/request_book/export').data({ id }).download().send()
  })
  return (
    <Modal
      title="請求書"
      width={800}
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      maskClosable={false}
    >
      <div className="p-2">
        <Table
          dataSource={requestBooks}
          loading={deletingRequestBook || exporting}
          pagination={false}
          columns={[
            { dataIndex: 'name', title: '履歴請求書' },
            { dataIndex: 'created_at', title: '時間' , render: value => dayjs(value).format('YYYY-MM-DD HH:mm:ss')  },
            { title: '処理',  dataIndex:'id', render: (id, row) =>  (
              <div className="btn-link-group">
                {row['is_send'] ? (
                  <>
                    <span className="btn-link" onClick={() => navigate(`/rb/edit/${id}/order/${row['order_id']}/type/${row['type']}`)}>预览</span>
                    <span className="btn-link" onClick={() => doExport(id)}>导出</span>
                  </>
                ): (
                  <>
                    <span className="btn-link" onClick={() => navigate(`/rb/edit/${id}/order/${row['order_id']}/type/${row['type']}`)}>編集</span>
                    <span className="btn-link">预览</span>
                    <span className="btn-link" onClick={() => {delRequestBook(id)}}>删除</span>
                  </>
                )}

              </div>
            ) },
          ]}
        />
      </div>
      <div className="flex justify-center gap-2">
        <Button className="w-32" type="primary" onClick={() => navigate(`/rb/add/${form.getFieldValue('id')}/type/${REQUEST_TYPE_NORMAL}`)}>請求書新規作成</Button>
        <Button className="w-32" type="primary" onClick={() => navigate(`/rb/add/${form.getFieldValue('id')}/type/${REQUEST_TYPE_ADVANCE}`)}>立替金請求書作成</Button>
        <Button className="w-32" onClick={() => setOpen(false)}>取消</Button>
      </div>
    </Modal>
  )
}

export default ListModal
