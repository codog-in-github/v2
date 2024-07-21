import { FileFilled } from "@ant-design/icons";
import { useMemo } from "react";

const ext = (filePath) => {
  return filePath.split('.').pop()
}

const filename = (filePath) => {
  if(filePath.includes('/'))
    return filePath.split('/').pop()
  return filePath
}


const File = ({ filePath, selectable, selected, onSelect }) => {
  const fileIco = useMemo(() => {
    switch (ext(filePath)) {
      default:
        return <FileFilled className="text-gray-500" />;
    }
  }, [filePath])
  const fileName = useMemo(() => {
    return filename(filePath)
  }, [filePath])
  return(
    <div className="flex flex-col items-center">
      <span className="text-2xl">{fileIco}</span>
      <span>{fileName}</span>
    </div>
  )
}

export default File;
