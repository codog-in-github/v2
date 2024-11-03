import {Space, Button, Table} from "antd";
import {forwardRef, useEffect, useImperativeHandle, useMemo, useState} from "react";
import { useRef } from "react";
import { useAsyncCallback } from "@/hooks";
import { request } from "@/apis/requestBuilder";
import { Form } from "antd";
import classNames from "classnames";
import {cloneDeep} from "lodash";


const usePaginationRef = () => {
  const pagination = useRef({
    showSizeChanger: true,
    showQuickJumper: true,
    total: 0,
    pageSize: 10,
    showTotal: (total) => `共有 ${total} 条`,
  })
  const set = (value) => {
    pagination.current = Object.assign(pagination.current, value)
  }
  const get = () => {
    return {
      'page_size': pagination.current.pageSize,
      'page': pagination.current.current,
    }
  }
  return { pagination, set , get }
}
const useList = (url, pagination, filterForm, beforeSearch) => {
  const [list, setList] = useState([])
  const [getList, loading] = useAsyncCallback(async () => {
    const rep = await request(url)
      .get(
        beforeSearch({
          ...pagination.get(),
          ...filterForm.getFieldsValue(),
        })
      )
      .paginate()
      .send()
    pagination.set({ total: rep.total })
    setList(rep.data)
  })
  return {
    list, getList, loading
  }
};


const List = forwardRef(function List({
  /**
   * @type {import('antd').FormInstance}
   */
  filters,
  /**
   * @type {import('antd').TableColumnsType<any>}
   */
  columns,
  /**
   * @type {string}
   */
  url = '',
  rowKey = 'id',
  filtersSpaceSize = [10, 16],
  filterItems,
  filterActions,
  /**
   * @type {boolean}
   */
  showClear = true,
  /**
   * @type {(filters: import('antd').FormInstance) => any}
   */
  onClear = (filters) => filters.resetFields(),
  /**
   * @type {string}
   */
  className,
  beforeSearch = (filters) => filters,
  onDataSource,
  tableProps
}, ref) {
  const page =  usePaginationRef()

  const {
    list, getList, loading
  } = useList(url, page, filters, beforeSearch)

  const onDataSourceMemo = useMemo(() => {
    if(!onDataSource) {
      return dataSource => dataSource
    }
    return onDataSource
  }, [onDataSource]);

  const dataSource = useMemo(() => onDataSourceMemo(list), [list, onDataSourceMemo]);

  useEffect(() => { getList() }, [url]);

  useImperativeHandle(ref, () => {
    return {
      getList,
    }
  }, [])

  return (
    <div className={classNames('main-content', className)}>
      <Form form={filters}>
        <Space size={filtersSpaceSize} wrap>
          {filterItems}
          <Button type="primary" onClick={() => {
            page.set({
              current: 1
            })
            getList()
          }}>搜索</Button>
          {showClear && <Button onClick={() => {
            onClear(filters);
            getList()
          }}>
            重置
          </Button>}
          {filterActions}
        </Space>
      </Form>
      <Table
        loading={loading}
        rowKey={rowKey}
        className="mt-5"
        dataSource={dataSource}
        columns={columns}
        {...tableProps}
        pagination={page.pagination.current}
        onChange={(e) => {
          page.set(e)
          getList()
        }}
      />
    </div>
  );
});
export default List;
