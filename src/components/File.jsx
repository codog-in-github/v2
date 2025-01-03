import { FileExcelFilled, FileFilled, FileImageFilled, FilePdfFilled, FileTextFilled, FileWordFilled } from "@ant-design/icons";
import { Checkbox } from "antd";
import { useMemo } from "react";
import classNames from "classnames";

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


const File = ({
  filePath, selectable, selected, inSelected, onNativeClick, onSelect, className
}) => {
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
    <div
      className={classNames('flex flex-col items-center cursor-pointer relative', className)}
      onClick={onNativeClick || selectable && onSelect}
    >
      <div className="text-2xl">{fileIco}</div>
      <div className="w-16 line-clamp-2 text-center break-words">
        {inSelected && <Checkbox checked={selected} className="absolute top-0 left-6" />}
        {fileName}
      </div>
    </div>
  )
}

export default File;
