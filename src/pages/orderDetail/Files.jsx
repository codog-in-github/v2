import File from "@/components/File";
import Label from "@/components/Label";
import { chooseFile } from "@/helpers/file";
import { useFileUpload } from "@/hooks";
import { Button, Tabs } from "antd"
import { useMemo } from "react";
import { useState } from "react";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
const tabs = [
  {
    key: '1',
    label: '通関',
  },
  {
    key: '2',
    label: '業務',
  },
  {
    key: '3',
    label: '請求',
  },
  {
    key: '4',
    label: '仕れ',
  },
];
export const Files = ({ files, className, onUpload = () => {} }) => {
  const [activeTabKey, setActiveTabKey] = useState('1')
  const orderId = useParams().id
  const { upload, uploading } = useFileUpload(orderId)

  const upClickHandle = () => {
    chooseFile({
      onChoose: async (file) => {
        const fileUrl = await upload({
          file,
          fileType: ~~activeTabKey
        })
        onUpload({
          fileUrl, type: activeTabKey
        })
      },
    })
  }
  
  const tabItems = useMemo(() => {
    const tabItems = []
    for(const tabItem of tabs) {
      const key = tabItem.key
      const _files = files[key] ?? []
      tabItems.push({
        ...tabItem,
        children: (
          <div className="grid grid-cols-6">{
            _files.map(file => (
              <File key={file} filePath={file}></File>
            ))
          }</div>
        )
      }) 
      
    }
    return tabItems
  }, [files])
  return (
    <div className={className}>
      <div className="flex">
        <Label className="mr-auto">資料状況</Label>
        <div className="flex gap-2 pt-1 pr-2">
          <Button>削除</Button>
          <Button>DOW</Button>
          <Button type="primary" onClick={upClickHandle} loading={uploading}>UP</Button>
        </div>
      </div>
      <Tabs items={tabItems} onChange={setActiveTabKey}></Tabs>
    </div>
  )
}

export default Files
