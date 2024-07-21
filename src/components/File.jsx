import { FileExcelFilled, FileFilled, FileImageFilled, FilePdfFilled, FileTextFilled, FileWordFilled } from "@ant-design/icons";
import { useMemo } from "react";

const ext = (filename = '') => {
  if(filename.includes('.')) {
    return filename.split('.').pop()
  }
  return ext
}

const filename = (filePath = '') => {
  if(filePath.includes('/'))
    return filePath.split('/').pop()
  return filePath
}


const File = ({ filePath, selectable, selected, onSelect }) => {
  const fileName = useMemo(() => {
    return filename(filePath)
  }, [filePath])
  const fileIco = useMemo(() => {
    switch (ext(fileName)) {
      case 'xls':
      case 'xlsx':
        return <FileExcelFilled className="text-[#107c41]" />;
      case 'doc':
      case 'docx':
        return <FileWordFilled className="text-[#185abd]" />;
      case 'jpg':
      case 'png':
      case 'jpeg':
        return <FileImageFilled />;
      case 'pdf':
        return <FilePdfFilled className="text-[#ff5555]" />;
      case 'txt':
        return <FileTextFilled className="text-gray-500" />;
      default:
        return <FileFilled className="text-gray-400" />;
    }
  }, [fileName])
  return(
    <div className="flex flex-col items-center">
      <div className="text-2xl">{fileIco}</div>
      <div className="w-16 line-clamp-3 text-center">{fileName}</div>
    </div>
  )
}

export default File;
