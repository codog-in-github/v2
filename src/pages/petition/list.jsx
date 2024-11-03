import {Input, Avatar, Select, Modal, Button} from "antd";
import { Form } from "antd";
import {forwardRef, useImperativeHandle, useMemo, useRef, useState} from "react";
import dayjs from "dayjs";
import List from "@/components/List.jsx";
import {Link, useNavigate} from "react-router-dom";

const DetailModal = forwardRef(function DetailModal(props, ref) {
  const [open, setOpen] = useState(false)
  const [row, setRow] = useState(null)
  const navigate = useNavigate()

  useImperativeHandle(ref, () => ({
    open(row) {
      setOpen(true)
      setRow(row)
    }
  }), [])

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      title={'変更記录'}
      footer={(
        <div className={'text-center'}>
          <Button
            type={'primary'}
            className={'w-32'}
            onClick={() => {
              navigate(`/rb/edit/${row.replace_book.id}/order/${row.replace_book.order_id}/type/${row.replace_book.type}`)
            }}
          >查看新的請求書</Button>
          <Button onClick={() => setOpen(false)} className={'ml-2 w-32'}>关闭</Button>
        </div>
      )}
    >
      {!! row && (
        <div className={'my-8 text-center'}>請求書{row.no}作废，生成新的請求書{row.replace_book.no}</div>
      )}
    </Modal>
  )
})

const StatusTag = ({ isCompete }) => {
  return (
    <div
      className={'flex-center w-20 h-8 rounded-full'}
      style={{
        backgroundColor: isCompete ? '#d9e2fd' : '#F5D8D4',
        color: isCompete ? '#426CF6' : '#ED5836',
      }}
    >{isCompete ? '已入账' : '未入账'}</div>
  )
};

const PetitionList = () => {
  const [filters] = Form.useForm()
  const detailModalRef = useRef(null);
  const columns = useMemo(() => [
    {
      title: "お客様",
      dataIndex: ['order', 'short_name'],
      key: "name",
      render: (abbr) => (
        <Avatar className={'bg-black'} >{abbr}</Avatar>
      )
    },
    {
      title: '社内管理番号',
      dataIndex: ['order', 'order_no'],
      key: "number",
    },
    {
      title: '請求書番号',
      dataIndex: ['no'],
      key: "number",
      render: (value, row) => {
        return (
            <>
              {value}
              {row['is_void'] === 1 && <span className={'p-1 bg-warning-500 text-white rounded ml-2'}>已作废</span>}
            </>
        )
      }
    },
    {
      title: 'BKG NO.',
      dataIndex: ['order', 'bkg_no'],
      key: "number",
    },
    {
      title: "CY CUT 日",
      dataIndex: ['order', 'cy_cut'],
      key: "cyCut",
    },
    {
      title: "POL , ETD",
      key: "pol",
      render: (row) => {
        const date = row.order.etd ? dayjs(row.order.etd).format('MM/DD') : '00/00'
        const pol = row.order.loading_port_name?.split('/')[1] ?? 'N/A'
        return `${pol}, ${date}`
      }
    },
    {
      title: "POD , ETA",
      key: "pod",
      render: (row) => {
        const date = row.order.eta ? dayjs(row.order.eta).format('MM/DD') : '00/00'
        const pol = row.order.delivery_port_name?.split('/')[1] ?? 'N/A'
        return `${pol}, ${date}`
      }
    },
    {
      title: "数量",
      key: "quantity",
      render: (row) => row.order
        .containers.map(item => `${item.quantity}, ${item.container_type}`)
        .join(';')
    },
    {
      title: "状態",
      dataIndex: 'is_entry',
      key: "status",
      render: (isEntry) => (
        <StatusTag isCompete={isEntry === 1} />
      ),
    },
    {
      title: "処理",
      key: "option",
      fixed: "right",
      width: 160,
      render: (row) => (
        <div className="btn-link-group">
          { row.is_void === 1 && (
            <>
              <Link
                className="btn-link"
                to={`/rb/edit/${row.id}/order/${row.order_id}/type/${row.type}`}
              >詳情</Link>
              <span
                className={'btn-link'}
                onClick={() => detailModalRef.current.open(row)}
              >
                変更记录
              </span>
            </>
          ) }
          { row.is_void !== 1 && (
            <Link className="btn-link"  to={`/rb/void/${row.id}/order/${row.order_id}/type/${row.type}`}>変更申请</Link>
          ) }
        </div>
      ),
    },
  ], []);

  return (
    <>
      <List
        url={'/admin/request_book/list'}
        filters={filters}
        columns={columns}
        filterItems={(
          <>
            <Form.Item name="company_name" noStyle>
              <Input placeholder="お客様" className={'w-40'} />
            </Form.Item>
            <Form.Item name="order_no" noStyle>
              <Input placeholder="番号" className={'w-40'} />
            </Form.Item>
            <Form.Item name="bkg_no" noStyle>
              <Input placeholder="BKG NO." className={'w-40'} />
            </Form.Item>
            <Form.Item name="pol" noStyle>
              <Input placeholder="POL" className={'w-40'} />
            </Form.Item>
            <Form.Item name="pod" noStyle>
              <Input placeholder="POD" className={'w-40'} />
            </Form.Item>
            <Form.Item name="is_void" noStyle>
              <Select
                placeholder={'作废状态'}
                className={'w-40'}
                options={[
                  { value: 0, label: '未作废' },
                  { value: 1, label: '已作废' },
                ]}
              />
            </Form.Item>
          </>
        )}
      />
      <DetailModal ref={detailModalRef}></DetailModal>
    </>
  );
};
export default PetitionList;
