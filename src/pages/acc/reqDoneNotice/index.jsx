import List from "@/components/List.jsx";
import {useMemo} from "react";
import {Form} from "antd";

const PageContent = () => {
  const columns = useMemo(() => [{
    title: '社内番号',
    dataIndex: ['order', 'no'],
  }, {
    title: '',
    dataIndex: ['order', 'company_name'],
  }
  ], [])
  const [filters] = Form.useForm()
  return (
    <List
      filters={filters}
      columns={columns}
      url={'/admin/acc/req_check_list'}
    ></List>
  )
}

export default PageContent
