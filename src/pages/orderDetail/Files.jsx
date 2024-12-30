import File from "@/components/File";
import Label from "@/components/Label";
import { chooseFile } from "@/helpers/file";
import { useAsyncCallback, useFileUpload } from "@/hooks";
import { Button, Progress, Tabs } from "antd"
import { useMemo } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { DetailDataContext } from "./dataProvider";

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

const useSelectedFiles = (allFiles) => {
  const [files, setFiles] = useState({})
  const {id} = useParams()
  const clear = () => {
    setFiles({})
  }
  useEffect(() => {
    clear()
  }, [id])
  const isSelected = (type, filePath) => {
    return files[type]?.includes(filePath)
  }
  const inSelected = useMemo(() => {
    return Object.keys(files).some(key => files[key]?.length > 0)
  }, [files])

  const select = (type, filePath) => {
    if(!files[type]) {
      setFiles(prev => {
        return ({ ...prev, [type]: [filePath] })
      })
    } else if(files[type].includes(filePath)) {
      setFiles(prev => ({ ...prev, [type]: prev[type].filter(file => file !== filePath) }))
    } else {
      setFiles(prev => ({ ...prev, [type]: [...prev[type], filePath] }))
    }
  }
  return { files, isSelected, clear, select, inSelected }
}
export const Files = ({ className }) => {
  const { isCopy, files, onDeleteFiles, onDownloadFiles, saveOrderFile, downloading } = useContext(DetailDataContext)
  const [activeTabKey, setActiveTabKey] = useState('1')
  const orderId = useParams().id
  const { upload, uploading, total, loaded } = useFileUpload(orderId)
  const {
    files: selectedFiles, isSelected, clear, select, inSelected
  } = useSelectedFiles(files)
  const upClickHandle = () => {
    chooseFile({
      multiple: true,
      onChoose: async (file) => {
        const fileUrl = await upload({
          file,
          fileType: ~~activeTabKey
        })
        saveOrderFile({
          fileUrl, type: activeTabKey
        })
      },
    })
  }
  const createEventHandle = (eventHandle) => useAsyncCallback(() => new Promise((resolve, reject) => {
    if(!inSelected) {
      return reject()
    }
    const next  = () => {
      clear()
      resolve()
    }
    eventHandle(selectedFiles, next, reject)
  }))

  const [deleteHandler, deleteding] = createEventHandle(onDeleteFiles)
  const [downloadHandler] = createEventHandle(onDownloadFiles)

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
              <File
                key={file}
                selectable
                inSelected={inSelected}
                selected={isSelected(key, file)}
                filePath={file}
                onSelect={() => select(key, file)}
              />
            ))
          }</div>
        )
      })
    }
    return tabItems
  }, [files, inSelected, isSelected, select])
  return (
    <div className={className}>
      <div className="flex">
        <Label className="mr-auto">資料状況</Label>
        <div className="flex gap-2 pt-1 pr-2">
          <Button className="w-20" disabled={isCopy} onClick={deleteHandler} loading={deleteding}>削除</Button>
          <Button className="w-20" disabled={isCopy} onClick={downloadHandler} loading={downloading}>DOW</Button>
          <Button className="w-20" disabled={isCopy || uploading} type="primary" onClick={upClickHandle}>
            { uploading && (
              <Progress className="mr-2" type="circle" percent={(loaded / total) * 100} size={20}></Progress>
            ) }
            UP
          </Button>
        </div>
      </div>
      {!isCopy && <Tabs items={tabItems} onChange={setActiveTabKey}></Tabs>}
    </div>
  )
}

export default Files
