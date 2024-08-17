import File from "@/components/File";
import Label from "@/components/Label";
import { chooseFile } from "@/helpers/file";
import { useAsyncCallback, useFileUpload } from "@/hooks";
import { Button, Progress, Tabs } from "antd"
import { useMemo, useEffect, useState } from "react";
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
export const FileTabs = ({ tabs: enabelTabs = tabs.map(item => ~~ item.key), className, files, onDeleteFiles, onDownloadFiles, saveOrderFile, downloading }) => {
  const [activeTabKey, setActiveTabKey] = useState(enabelTabs[0].toString())
  const orderId = useParams().id
  const { upload, uploading, total, loaded } = useFileUpload(orderId)
  const {
    files: selectedFiles, isSelected, clear, select, inSelected
  } = useSelectedFiles(files)

  useEffect(() => {
    setActiveTabKey(enabelTabs[0].toString())
  }, [enabelTabs])
  const upClickHandle = () => {
    chooseFile({
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
      if(!enabelTabs.includes(~~tabItem.key)){
        continue
      }
      const key = tabItem.key
      const _files = files?.[key] ?? []
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
  }, [files, inSelected, isSelected, select, enabelTabs])
  return (
    <div className={className}>
      <Tabs items={tabItems} onChange={setActiveTabKey}></Tabs>
    </div>
  )
}

export default FileTabs
