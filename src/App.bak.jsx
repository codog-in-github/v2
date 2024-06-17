import { HotTable } from '@handsontable/react';
import axios from 'axios';
import Handsontable from 'handsontable';
import { useEffect } from 'react';
import { useState } from 'react';
import { Routes, BrowserRouter, Route } from 'react-router-dom';
import propsType from 'prop-types';

const getData = async () => {
  const rep = await axios.get('/api/getExcel')
  return rep.data
}
function SheetButton(props) {
  return (
    <button
      className="bg-blue-300 hover:bg-blue-200 cursor-pointer mr-2 pl-1 pr-1"
      style={props.active === props.value ? { backgroundColor: 'red', color: 'white' } : {}}
      onClick={() => props.onClick(props.value)}
    >{props.label}</button>
  )
}
SheetButton.propTypes = {
  label: propsType.string.isRequired,
  value: propsType.number.isRequired,
  active: propsType.number.isRequired,
  onClick: propsType.func.isRequired
}
function Dashboard () {
  const [allData, setData] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [styleMap, setStyleMap] = useState({});
  const [activeSheet, setActiveSheet] = useState(-1);
  useEffect(() => {
    getData().then(([data, style]) => {
      const styleObj = JSON.parse(style)
      console.log(styleObj);
      setStyleMap(styleObj)
      setData(data)
      setSheets(
        data.map((sheet, index) => {
          return {
            label: sheet.name,
            value: index
          }
        })
      )
      setActiveSheet(0)
    })
  }, [])
  function save () {
    console.log(allData);
  }
  return (
    <div>
      <div className="p-2">
      {sheets.map((sheet) => {
        return (
          <SheetButton
            {...sheet}
            key={sheet.value}
            active={activeSheet}
            onClick={(value) => {
              setActiveSheet(value)
            }}
          ></SheetButton>
        )
      })}
        <button onClick={save}>保存</button>
      </div>
      {allData.length && <HotTable
        data={allData[activeSheet].data}
        cells={() => {
          var cellProperties = {};
          cellProperties.renderer = function (_, td, row, col) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            const { color, align } = styleMap[activeSheet]?.cell?.[row][col] ?? {};
            if(color) {
              td.style.backgroundColor = '#' + color;
            }
            if(align) {
              td.style.textAlign = align;
            }
          };
  
          return cellProperties;
        }}
        colWidths={(col) => {
          const { width = 30 } = styleMap[activeSheet]?.column?.[col] ?? {};
          return width
        }}
        mergeCells={styleMap[activeSheet]?.merge ?? []}
        rowHeaders={true}
        colHeaders={true}
        height="auto"
        autoWrapRow={true}
        autoWrapCol={false}
        licenseKey="non-commercial-and-evaluation" // for non-commercial use only
      />}
    </div>
  )
}



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard></Dashboard>}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}