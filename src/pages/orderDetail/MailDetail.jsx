import { request } from "@/apis/requestBuilder"
import { useAsyncCallback } from "@/hooks"
import { LoadingOutlined } from "@ant-design/icons"
import { Modal } from "antd"
import { useEffect, useState } from "react"

const MailRecord = ({ record }) => {
  return (
    record.content
  )
}

const MailDetail = ({
  modal
}) => {
  const [nodeId, setNodeId] = useState(null)
  const [open, setOpen] = useState(false)
  const [contents, setContents] = useState([])
  const [getList, loading] = useAsyncCallback((id) => (
    request('/admin/order/email_log')
      .get({ id })
      .send()
      .then(setContents)
  ))
  if(modal) {
    modal.current = {
      open(id) {
        setOpen(true)
        setNodeId(id)
      }
    }
  }
  useEffect(() => {
    if(nodeId) {
      getList(nodeId)
    }
  }, [nodeId])
  return (
    <Modal
      open={open}
      title="メール詳細"
      footer={null}
      onCancel={() => setOpen(false)}
    >
      <div className="flex flex-col gap-4">
        {loading ? <LoadingOutlined /> : contents.map(rec => (
           <MailRecord key={rec.id} record={rec} />
        ))}
      </div>
    </Modal>
  )
}

export default MailDetail
