const useExport = (ref, exportData) => {
  if(ref) {
    exportData(ref)
  }
}

const Mail = ({
  ref
}) => {
  useExport(ref)
  return <></>
}

export default Mail