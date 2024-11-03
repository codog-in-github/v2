import {forwardRef, useCallback, useImperativeHandle, useState} from "react";
import {Button, Input, Modal, Table} from "antd";
import {COST_PART_CUSTOMS, COST_PART_LAND, COST_PART_OTHER, COST_PART_SEA} from "@/constant/index.js";
import dayjs from "dayjs";
import {chooseFile} from "@/helpers/file.js";
import {CloseOutlined, FileOutlined} from "@ant-design/icons";
import pubSub from "@/helpers/pubSub.js";
import {useAsyncCallback} from "@/hooks/index.js";
import {request} from "@/apis/requestBuilder.js";

const costTypeMap = {
  [COST_PART_CUSTOMS]: '通関',
  [COST_PART_SEA]: '海運',
  [COST_PART_LAND]: '運送',
  [COST_PART_OTHER]: 'その他'
}
const columns = [
  {
    title: 'お客様名',
    dataIndex: 'company_name',
  },
  {
    title: '社内番号',
    dataIndex: 'order_no',
  },
  {
    title: '請求書番号',
    dataIndex: 'no',
  },
  {
    title: 'BKG NO.',
    dataIndex: 'bkg_no',
  },
  {
    title: '制作日期',
    dataIndex: 'date',
    render: (value) => dayjs(value).format('YYYY-MM-DD')
  },
  {
    title: '請求金额',
    dataIndex: 'amount',
    render: (value) => <div className={'text-right'}>¥{value}</div>
  },
]


const CheckModal = forwardRef(function CheckModal(props, ref) {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState([])
  const [purchase, setPurchase] = useState('')
  const [costPartName, setCostPartName] = useState('')
  const [files, setFiles] = useState([])
  const { onSuccess = () => {} } = props

  useImperativeHandle(ref, () => ({
    open(data) {
      setOpen(true)
      setData(data)
      setPurchase(data[0]?.purchase ?? '')
      setCostPartName(costTypeMap[data[0]?.cost_type] ?? '')
      setFiles([])
    }
  }), [])

  const onChooseFile = useCallback(() => {
    chooseFile({
      onChoose(file) {
        if(files.some(f => f.name === file.name)){
          pubSub.publish('Info.Toast', 'ファイル名が重複しています', 'error')
          return
        }
        setFiles([...files, file])
      }
    })
  }, [files]);

  const [submit, loading] = useAsyncCallback(async () => {
    if(!files.length) {
      pubSub.publish('Info.Toast', '請求証憑ファイルを選択してください', 'error')
      return
    }
    const formData = new FormData()
    for(const item of data) {
      formData.append(
        'check_items[]',
        [item.book_id, item.type, item.purchase].join('|')
      )
    }
    for (const file of files) {
      formData.append('files[]', file)
    }
    await request('/admin/acc/check_costs_done').form(formData).send()
    pubSub.publish('Info.Toast', '校对金额成功', 'success')
    setOpen(false)
    onSuccess()
  })

  return (
    <Modal
      title={'校对金额'}
      width={1200}
      open={open}
      maskClosable={false}
      onCancel={() => setOpen(false)}
      footer={(
        <div className={'flex items-center justify-center gap-4'}>
          <Button className={'w-32'} type={'primary'} onClick={submit} loading={loading}>確認</Button>
          <Button className={'w-32'} onClick={() => setOpen(false)}>CANCEL</Button>
        </div>
      )}
    >
      <div className={'p-4'}>
        <div className={'flex gap-4'}>
          <div className={'flex-1'}>
            <div>支払先お客様名</div>
            <div>
              <Input readOnly value={purchase}></Input>
            </div>
          </div>
          <div className={'flex-1'}>
            <div>請求部分</div>
            <div>
              <Input readOnly value={costPartName}></Input>
            </div>
          </div>
        </div>
        <Table
          className={'mt-2'}
          pagination={false}
          dataSource={data}
          columns={columns}
          summary={(data) => {
            const summary = data.reduce((acc, cur) => {
              return acc + Number(cur.amount)
            }, 0)
            return (
              <Table.Summary.Row className={'font-bold'}>
                <Table.Summary.Cell index={0}>合計</Table.Summary.Cell>
                <Table.Summary.Cell className={'text-right'} colSpan={5} index={1}>[¥{summary}]</Table.Summary.Cell>
              </Table.Summary.Row>
            )
          }}
        ></Table>
        <div className={'mt-2'}>
          <Button type={'primary'} onClick={onChooseFile}>UP支払証憑</Button>
        </div>
        <div className={'mt-2'}>
          { files.map(item => {
            return (
              <span key={item.lastModified} className={'mr-2'}>
              <FileOutlined />
                {item.name}
                <CloseOutlined
                  className={'ml-5'}
                  onClick={() => setFiles(files.filter(f => f !== item))}
                />
            </span>
            )
          }) }
        </div>
      </div>
    </Modal>
  )
})

export default CheckModal
