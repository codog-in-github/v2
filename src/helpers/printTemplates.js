import {getMoneyUppercase} from '@/api/helpers';
import { useUser } from '@/store';
import moment from 'moment';

export function chukudan(data, LODOP){
  const PAGE_WIDTH = 2260;
  const PAGE_HEIGHT = 1400;
  const PAGE_PADDING = 100;
  const MAX_COUNT_PER_PAGE = 8;
  const RATIO = 0.346665;
  const maxPage = Math.ceil(data.details.length / MAX_COUNT_PER_PAGE);
  LODOP.SET_PRINT_PAGESIZE(0, PAGE_WIDTH, PAGE_HEIGHT);
  for(let currentPage = 0; currentPage < maxPage; currentPage++) {
    let html = '<div>';
    html += '<div style="text-align: center;font-size: 22px; font-weight: bold">' + data.title + '</div>';
    html += '<div style="text-align: center;position: relative; margin-top: 0.5em; font-weight: bold; font-size: 16px">物资出库（送货单）' +
            '<div style="position:absolute; right: 0; top: 0;">单号.'+ data.id.toString().padStart(8, '0') +  '</div>' +
            '</div>';
    html += '<div style="position: relative; margin-top: 0.5em">接收单位：' + data.customerName +
            '<div style="position:absolute; right: 0;top: 0">' + data.date + '</div>' +
            '</div>';
    html += '<table style="margin-top: 0.5em" cellpadding="2" cellspacing="0" border="1" width="100%">';
    html += '<tr>';
    html += '<td width="15%" style="text-align: center">品名</td>';
    html += '<td width="20%" style="text-align: center">规格</td>';
    html += '<td width="10%" style="text-align: center">单位</td>';
    html += '<td width="15%" style="text-align: center">数量</td>';
    html += '<td width="15%" style="text-align: center">单价（元）</td>';
    html += '<td width="15%" style="text-align: center">金额（元）</td>';
    html += '<td width="15%" style="text-align: center">备注</td>';
    html += '</tr>';
    let amount = 0;
    for(let i = 0; i < MAX_COUNT_PER_PAGE && currentPage * MAX_COUNT_PER_PAGE + i < data.details.length; i++) {
      const item = data.details[currentPage * MAX_COUNT_PER_PAGE + i];
      html += '<tr>';
      html += `<td style="text-align: center">${item.goodsName}</td>`;
      html += `<td style="text-align: center">${item.spec}</td>`;
      html += `<td style="text-align: center">${item.unit}</td>`;
      html += `<td style="text-align: center">${item.num}</td>`;
      html += `<td style="text-align: center">${item.price ?? ''}</td>`;
      html += `<td style="text-align: center">${item.total ?? ''}</td>`;
      html += '<td></td>';
      html += '</tr>';
      amount += item.total;
    }
    if(currentPage === maxPage - 1) {
      for(let i = data.details.length % MAX_COUNT_PER_PAGE; i < MAX_COUNT_PER_PAGE; i++) {
        html += '<tr>';
        html += '<td>&nbsp;</td>';
        html += '<td></td>';
        html += '<td></td>';
        html += '<td></td>';
        html += '<td></td>';
        html += '<td></td>';
        html += '<td></td>';
        html += '</tr>';
      }
    }
    html += '<tr>';
    html += '<td style="text-align: center">合计金额：</td>';
    html += `<td style="" colspan="6">${amount ? getMoneyUppercase(amount, 1) : ''}`
            + `<span style="float: right; letter-spacing: 0">￥<span style="text-decoration: underline;">&nbsp;&nbsp;${
              amount ? amount.toFixed(1) : '&nbsp;'.repeat(6)
            }&nbsp;&nbsp;</span></span>`
            + '</td>';
    html += '</table>';
    html += '</div>';
    html += '<table style="width: 100%; margin-top: 10px">';
    html += '<tr>';
    html += '<td width="12.5%">发货人：</td>';
    html += '<td width="12.5%"></td>';
    html += '<td width="12.5%">操作员：</td>';
    html += '<td width="12.5%"><td>';
    html += '<td width="12.5%">送货人：</td>';
    html += '<td width="12.5%"></td>';
    html += '<td width="12.5%">签收人：</td>';
    html += '<td width="12.5%"></td>';
    html += '</tr>';
    html += '</table>';
    html += '<div style="text-align: right">到货日期' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
            '年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</div>';
    html += '<div>注：红联请买受人盖章（或签字）后带回给出卖人</div>';
    LODOP.ADD_PRINT_HTM(
      PAGE_PADDING * RATIO,
      PAGE_PADDING * RATIO,
      (PAGE_WIDTH - PAGE_PADDING * 2) * RATIO,
      (PAGE_HEIGHT - PAGE_PADDING * 2) * RATIO,
      html
    );
    LODOP.NEWPAGEA();
  }
}

export function peiliaoShenqing(data, LODOP){
  const user = useUser();
  LODOP.SET_PRINT_STYLE('FontSize', 16);
  LODOP.ADD_PRINT_TEXT(20, 20, 200, 20, '名称');
  LODOP.ADD_PRINT_TEXT(20, 120, 200, 20, data.process.name);
  LODOP.ADD_PRINT_TEXT(60, 20, 200, 20, '材料');
  LODOP.ADD_PRINT_TEXT(60, 120, 200, 20, '名称');
  LODOP.ADD_PRINT_TEXT(100, 120, 200, 20, data.raw.goodsName);
  LODOP.ADD_PRINT_TEXT(60, 220, 200, 20, '规格(MM)');
  LODOP.ADD_PRINT_TEXT(100, 220, 200, 20, data.raw.spec);
  LODOP.ADD_PRINT_TEXT(60, 340, 200, 20, '数量');
  LODOP.ADD_PRINT_TEXT(100, 340, 200, 20, data.raw.num);
  LODOP.ADD_PRINT_TEXT(60, 420, 200, 20, '单位');
  LODOP.ADD_PRINT_TEXT(100, 420, 200, 20, data.raw.unitName);
  LODOP.ADD_PRINT_TEXT(140, 20, 200, 20, '备注');
  LODOP.ADD_PRINT_TEXT(140, 120, 300, 500, data.process.comment);
  LODOP.ADD_PRINT_TEXT(260, 20, 200, 20, '打印人');
  LODOP.ADD_PRINT_TEXT(260, 120, 200, 20, user.name);
  LODOP.ADD_PRINT_TEXT(300, 20, 200, 20, '打印时间');
  LODOP.ADD_PRINT_TEXT(300, 120, 200, 20, moment().format('YYYY-MM-DD HH:mm'));
}
