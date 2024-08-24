import { Button, Modal } from "antd"
import { useRef, useState } from "react";
import BookingNotice from "./BookNotice";
import Handling from "./Handling";

const BookSelectModal = ({ instance }) => {
  const [open, setOpen] = useState(false);
  const bookingNoticeInstance = useRef(null);
  const handingInstance = useRef(null);

  if(instance) {
    instance.current = {
      open: () => { setOpen(true) },
    }
  }
  const openForm = (formRef) => {
    formRef.current.open()
    setOpen(false)
  }

  return (
    <Modal title="COHISE BOOK" open={open} footer={null} onCancel={() => setOpen(false)}>
      <div className="my-4">
        <Button onClick={() => openForm(bookingNoticeInstance)}>BOOKEING NOTICE</Button>
        <Button className="ml-2" onClick={() => openForm(handingInstance)}>荷捌表</Button>
      </div>
      <BookingNotice instance={bookingNoticeInstance}></BookingNotice>
      <Handling instance={handingInstance} />
    </Modal>
  )
}

export default BookSelectModal
