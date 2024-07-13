import Label from "@/components/Label";
import { Button, Tabs } from "antd"
const items = [
  {
    key: '1',
    label: '通関',
    children: 'Content of Tab Pane 1',
  },
  {
    key: '2',
    label: '業務',
    children: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    label: '請求',
    children: 'Content of Tab Pane 3',
  },
  {
    key: '4',
    label: '仕れ',
    children: 'Content of Tab Pane 3',
  },
];
export const Files = ({ className }) => {
  return (
    <div className={className}>
      <div className="flex">
        <Label className="mr-auto">資料状況</Label>
        <div className="flex gap-2 pt-1 pr-2">
          <Button>削除</Button>
          <Button>DOW</Button>
          <Button type="primary">UP</Button>
        </div>
      </div>
      <Tabs items={items}></Tabs>
    </div>
  )
}

export default Files
