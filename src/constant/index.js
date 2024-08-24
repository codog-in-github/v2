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
 *  财务打钱给船公司并且邮件付款凭证给船公司，后取得回执(电放单)→
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

export const EXPORT_NODE_NAMES = {
  [ORDER_NODE_TYPE_BK]: 'BK',
  [ORDER_NODE_TYPE_TRANSPORT_COMPANY]: '運',
  [ORDER_NODE_TYPE_PO]: 'PO',
  [ORDER_NODE_TYPE_DRIVER_NOTIFICATION]: 'ド',
  [ORDER_NODE_TYPE_CUSTOMER_DOCUMENTS]: '通',
  [ORDER_NODE_TYPE_ACL]: 'ACL',
  [ORDER_NODE_TYPE_CUSTOMS_CLEARANCE]: '許',
  [ORDER_NODE_TYPE_BL_COPY]: 'B/C',
  [ORDER_NODE_TYPE_SUR]: 'SUR',
  [ORDER_NODE_TYPE_FM]: 'FM',
  [ORDER_NODE_TYPE_REQUEST]: '請',
}

export const BKG_TYPES = {
  1: '通',
  2: '通+BK+運',
  3: 'BK',
  4: '通+BK',
  5: '通+運',
  6: 'BK+運',
  7: '運',
}

export const BKG_TYPE_CUSTOM = 8

export const COST_PART_CUSTOMS = 0
export const COST_PART_SEA = 1
export const COST_PART_LAND = 2
export const COST_PART_OTHER = 3

export const COST_PARTS = [COST_PART_CUSTOMS, COST_PART_SEA, COST_PART_LAND, COST_PART_OTHER]

export const SELECT_ID_SHIP_CONPANY = 5
export const SELECT_ID_CONTAINER_TYPE = 3
export const SELECT_ID_RB_EXTRA_ITEM = 11
export const SELECT_ID_RB_DETAIL_ITEM = 12
export const SELECT_ID_RB_DETAIL_UNIT = 13

export const FILE_TYPE_CUSTOMS = 1
export const FILE_TYPE_OPERATIONS = 2
export const FILE_TYPE_REQUEST = 3
export const FILE_TYPE_COST = 4

export const MAIL_TYPE_NORMAL = 1;
export const MAIL_TYPE_REDO = 2;

export const MAIL_TO_CUSTOMER = 1;
export const MAIL_TO_CAR = 2;
export const MAIL_TO_SHIP = 3;
export const MAIL_TO_CUSTOMS_COMPANY = 4;
export const MAIL_TO_ACC = 5;
export const MAIL_TO_CUSTOMS_DECLARANT = 6;

/**
 *  业务员准备向财务申请付款给船公司（附账单
 */
export const SUR_STEP_WAIT_CUSTOMER_CONFIRMED = 0
/**
 *  财务准备打钱给船公司并且邮件付款凭证给船公司
 */
export const SUR_STEP_WAIT_PAY = 1
/**
 *  财务付款完成，业务员等待船公司电放单
 */
export const SUR_STEP_PAYED = 2
/**
 *  收到船公司的电放单后，业务员邮件给客户电放单
 */
export const SUR_STEP_SENDED = 3

export const ORDER_TAB_STATUS_TOP = 1
export const ORDER_TAB_STATUS_PO = 2
export const ORDER_TAB_STATUS_DRIVE = 3
export const ORDER_TAB_STATUS_CUSTOMS = 4
export const ORDER_TAB_STATUS_ACL = 5
export const ORDER_TAB_STATUS_CUSTOMER_DOCUMENTS = 6
export const ORDER_TAB_STATUS_BL_COPY = 7
export const ORDER_TAB_STATUS_SUR = 8
export const ORDER_TAB_STATUS_REQUEST = 9

export const TOP_TAG_NAME = {
  [ORDER_TAB_STATUS_DRIVE]: 'DRIVE',
  [ORDER_TAB_STATUS_CUSTOMS]: '通',
  [ORDER_TAB_STATUS_ACL]: 'ACL',
  [ORDER_TAB_STATUS_CUSTOMER_DOCUMENTS]: '許可',
  [ORDER_TAB_STATUS_BL_COPY]: 'BL COPY',
  [ORDER_TAB_STATUS_SUR]: 'SUR',
  [ORDER_TAB_STATUS_REQUEST]: '請求書',
}

export const USER_ROLE_ADMIN = -1; // 系统管理
export const USER_ROLE_BOOS = 1; // 总
export const USER_ROLE_MASTER = 2; // 所長
export const USER_ROLE_NORMAL = 3; // 业务
export const USER_ROLE_CUSTOMS = 4; // 报关员
export const USER_ROLE_ACC = 5; // 总务

export const REQUEST_TYPE_NORMAL = 1;
export const REQUEST_TYPE_ADVANCE = 2;