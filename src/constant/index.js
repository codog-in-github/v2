export const ORDER_TYPE_IMPORT = 0;
export const ORDER_TYPE_EXPORT = 1;

/**
 * BK：订舱，填写船的相关信息以及客
 * 户提供的 booking 信息
 */
export const ORDER_NODE_TYPE_BK = 1;
/**
 * 運：订车公司，填写相关车公司信息
 */
export const ORDER_NODE_TYPE_TRANSPORT_COMPANY = 2;
/**
 * PO：车公司带着 pick order 去码头提集装箱
 */
export const ORDER_NODE_TYPE_PO = 3;
/**
 * ド(dirve): 通知客户，提供相关车公司信息，司机等等，
 * 告知车公司即将带集装箱前往装箱地址进行装箱
 */
export const ORDER_NODE_TYPE_DRIVER_NOTIFICATION = 4;
/**
 * 通：装完柜后，客户发送相关文件给我们。
 * 第一种情形（自己报关），系统上传相关文件后，
 *   开放权限给报关员进行报关。
 * 第二种情形（其他公司代为报关），将相关文件发
 *   送给其他报关公司，取得报关成功后的放行单
 */
export const ORDER_NODE_TYPE_CUSTOMER_DOCUMENTS = 5;
/**
 * ACL：制作 ACL 发送给客户确认。客户回信确认
 * 后手动完成确认
 */
export const ORDER_NODE_TYPE_ACL = 6;
/**
 * 許：自己报关成功后获得放行单，或者其他报关公
 * 司报关成功后发送过来的放行单→告知客户到哪个
 * 环节了
 */
export const ORDER_NODE_TYPE_CUSTOMS_CLEARANCE = 7;
/**
 * B/C（BL COPY）：收到船公司的提单副本
 * 后，发送给客户
 */
export const ORDER_NODE_TYPE_BL_COPY = 8;
/**
 * SUR：客户来信告知可以付钱→
 *  业务员向财务申请付款给船公司（附账单）→
 *  财务打钱给船公司后取得回执，并且邮件付款凭证给船公司→
 *  收到船公司的电放单后，业务员邮件给客户电放单
 */
export const ORDER_NODE_TYPE_SUR = 9;
/**
 * FM：财务校对附件后付完钱→
 * 展示【船司（缩）、金额、付款时间、付款人】
 */
export const ORDER_NODE_TYPE_FM = 10;
/**
 * 請：填写请求书→发送给客户
 */
export const ORDER_NODE_TYPE_REQUEST = 11;
