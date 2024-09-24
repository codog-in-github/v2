import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import { useEffect, useRef, useState } from 'react';
import { request } from "@/apis/requestBuilder.js";
import { useParams, useNavigate } from "react-router-dom";
import {Button, DatePicker, Form, Input, Radio} from "antd";
import {DetailDataContext, useDetailData} from "./dataProvider.js";
import Label from "@/components/Label.jsx";
import Chat from "./Chat.jsx";
import Files from "./Files.jsx";
import { useAsyncCallback } from "@/hooks/index.js";
import pubSub from "@/helpers/pubSub.js";
function MainContent () {
  const detailData = useDetailData()
  const [allData, setData] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [styleMap, setStyleMap] = useState({});
  const [activeSheet, setActiveSheet] = useState(-1);
  const tableContainer = useRef(null);
  const { id } = useParams()
  const [exportTemplate, setExportTemplate] = useState(null)
  const templates = 'ECR,EDA,VAE'.split(',')
  const navigate = useNavigate()

  useEffect(() => {
    const onFile = async (file) => {
      const data = await request('admin/customs/read').form({ file }).send()
      setData(data)
    }
    pubSub.subscribe('None.Customs.Detail.Upload', onFile)
    return () => {
      pubSub.unsubscribe('None.Customs.Detail.Upload', onFile)
    }
  }, [])

  useEffect(() => {
    request('/admin/customs/detail').get({ id }).send().then(([data, styleObj]) => {
      setStyleMap(styleObj)
      setData(data)
      const sheets = Object.keys(data).map((item) => ({
        label: item,
        value: item
      }))
      setSheets(sheets)
      setActiveSheet(sheets[0]?.value)
    })
  }, [id])

  const [exportTxt, exporting] = useAsyncCallback(async (template) => {
    setExportTemplate(template)
    return request('/admin/customs/export').post({
      order_id: id,
      template,
      data: allData
    }).download().send()
  })

  return (
    <div className="flex-1 flex flex-col">
      <div className="mb-2 flex">
        {templates.map(item => (
          <Button
            loading={exporting && exportTemplate === item}
            key={item}
            className="mr-2"
            onClick={() => exportTxt(item)}>{item}</Button>
        ))}
        <Button className={'ml-auto'} onClick={() => navigate(-1)}>戻る</Button>
      </div>
      <div className="flex-1 h-full flex overflow-hidden">
        <div className="w-[500px] flex-shrink-0 flex flex-col">
          <DetailDataContext.Provider value={detailData}>
            <Form
              className="bg-white p-2 pb-0"
              form={detailData.form}
              disabled
              labelCol={{span: 8}}
            >
              <Label>基本情報</Label>
              <div className="grid grid-cols-2">
                <Form.Item label="お客様名" name="customerName">
                  <Input/>
                </Form.Item>
                <Form.Item label="BKG NO." name="bkgNo">
                  <Input/>
                </Form.Item>
                <Form.Item label="法人番号" name="companyCode">
                  <Input/>
                </Form.Item>
                <Form.Item label="船名" name="voyage">
                  <Input/>
                </Form.Item>
                <Form.Item label="POL" name="pol">
                  <Input/>
                </Form.Item>
                <Form.Item label="POD" name="pod">
                  <Input/>
                </Form.Item>
                <Form.Item label="DOC CUT" name="docCut">
                  <DatePicker className="w-full"/>
                </Form.Item>
              </div>
            </Form>
            <Chat className="flex-1 bg-white mt-2 p-2"/>
            <Files className="flex-1 bg-white mt-2 p-2"/>
          </DetailDataContext.Provider>
        </div>
        <div className="ml-2 p-2 flex-1 flex flex-col overflow-hidde bg-white">
          <div className="flex-shrink-0 mb-2">
            <Radio.Group
              optionType='button'
              value={activeSheet}
              onChange={e => setActiveSheet(e.target.value)}
              options={sheets}
            />
          </div>
          <div className="flex-1" ref={tableContainer}>
            {allData && <HotTable
              data={allData[activeSheet]}
              cells={() => {
                const cellProperties = {};
                cellProperties.renderer = function (_, td, row, col) {
                  Handsontable.renderers.TextRenderer.apply(this, arguments);
                  const {color, align} = styleMap[activeSheet]?.cell?.[row][col] ?? {};
                  if (color) {
                    td.style.backgroundColor = '#' + color;
                  }
                  if (align) {
                    td.style.textAlign = align;
                  }
                };
                return cellProperties;
              }}
              colWidths={(col) => {
                const {width = 80} = styleMap[activeSheet]?.column?.[col] ?? {};
                return width
              }}
              viewportRowRenderingOffset={30}
              mergeCells={styleMap[activeSheet]?.merge ?? []}
              rowHeaders={true}
              colHeaders={true}
              height={() => tableContainer.current.clientHeight}
              autoWrapRow={true}
              autoWrapCol={false}
              licenseKey="non-commercial-and-evaluation" // for non-commercial use only
            />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainContent;
