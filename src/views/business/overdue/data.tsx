import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { Tag } from 'ant-design-vue'
import dayjs from 'dayjs'
import { getSalespersonStoreList } from '/@/api/business/salesperson'
import { spuTypeList } from '../../goods/goodsBase/data'
import { formatNumber, handleCurrentMonthToDays, handleToFixed2 } from '/@/utils/tool'
import { statusList } from '../../order/utils'

const allTime = handleCurrentMonthToDays(4)

export function columns(handleOverdue, keys): BasicColumn[] {
  return [
    {
      title: '省份',
      dataIndex: 'ipProvince',
      width: 150,
      customRender: ({ text }) => text || '-',
    },
    {
      ifShow: keys == 'CityTable',
      title: '城市',
      dataIndex: 'ipCity',
      width: 130,
      customRender: ({ text }) => text || '-',
    },
    {
      title: keys == 'CityTable' ? '订单数(城市)' : '订单数(省)',
      dataIndex: 'orderCount',
      width: 100,
      customRender: ({ text, record }) => {
        record['entry'] = 'city'
        return (
          <div
            style={{ color: '#49a6ea', cursor: 'pointer' }}
            onClick={() => handleOverdue(record, false, 0)}
          >
            {text}
          </div>
        )
      },
    },
    {
      title: '总到期订单',
      dataIndex: 'expOrderCount',
      width: 120,
      sorter: keys == 'CityTable',
      customRender: ({ text, record }) => {
        record['entry'] = 'city'
        return (
          <div
            style={{ color: '#49a6ea', cursor: 'pointer' }}
            onClick={() => handleOverdue(record, false, 1)}
          >
            {text}
          </div>
        )
      },
    },
    {
      title: '逾期订单',
      dataIndex: 'overdueOrderCount',
      sorter: true,
      customRender: ({ text, record }) => {
        record['entry'] = 'city'
        return (
          <div
            style={{ color: '#49a6ea', cursor: 'pointer' }}
            onClick={() => handleOverdue(record, true, 2)}
          >
            {text}
          </div>
        )
      },
      width: 120,
    },
    {
      title: '订单总金额(元)',
      dataIndex: 'totalAmount',
      width: 180,
      helpMessage: '取值: 【含锁费、公证、增值服务、订单账单金额;不含罚金】',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '首付总金额(元)',
      dataIndex: 'downPaymentAmount',
      width: 140,
      helpMessage: '取值: 【含锁费、公证、增值服务、订单账单金额、部分还款】',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '待收租金金额(元)',
      dataIndex: 'pendingAmount',
      width: 160,
      helpMessage: '取值: 【除去首付以及已还金额期数租金总额、不含逾期租金总金额;不含罚金】',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '已还租金总额(元)',
      dataIndex: 'repaidAmount',
      width: 160,
      helpMessage: '取值: 【含部分还款;不含罚金】',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '逾期剩余未还租金总额(元)',
      dataIndex: 'overdueResidueAmount',
      width: 220,
      helpMessage: '取值: 【含部分还款;不含罚金】',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '已结清订单总金额(元)',
      dataIndex: 'settleAmount',
      width: 180,
      helpMessage: '取值: 【含锁费、公证、增值服务、订单账单金额、罚金】',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '订单罚金总金额(元)',
      dataIndex: 'penaltyAmount',
      width: 180,
      helpMessage: '取值: 在租订单产生的订单罚金',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '订单已还罚金总金额(元)',
      dataIndex: 'repaidPenaltyAmount',
      width: 220,
      helpMessage: '取值: 在租订单产生的订单罚金已还金额',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '金额逾期率',
      dataIndex: 'amountOverdueScale',
      width: 140,
      sorter: true,
      fixed: 'right',
      helpMessage:
        '计算:金额逾期率=逾期剩余未还租金总额(实时)/2期到期的有效订单租金总金额【1、排除首付金额; 2、有效订单指:租赁生效、已逾期、已买断、已完结订单】',
      customRender: ({ text }) => handleToFixed2((text || 0) * 100) + '%',
    },
    {
      title: '订单逾期率',
      dataIndex: 'overdueScale',
      width: 120,
      sorter: true,
      fixed: 'right',
      customRender: ({ text }) => handleToFixed2(text * 100) + '%',
    },
    {
      title: '逾期排名',
      dataIndex: 'sortNum',
      width: 120,
      sorter: true,
      fixed: 'right',
      defaultSortOrder: 'descend',
      customRender: ({ text }) => {
        if (text <= 3) {
          return h('div', { style: { color: 'red' } }, text)
        }
        return text
      },
    },
  ]
}

export function searchFormSchema(): FormSchema[] {
  return [
    {
      show: false,
      field: 'ipCitysTxt',
      label: '地区中文',
      component: 'Input',
    },
    {
      field: 'ipCitys',
      label: '地区',
      component: 'TreeSelect',
      colProps: { span: 6 },
    },
    {
      field: 'spuType',
      label: '商品类目',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: spuTypeList,
      },
      colProps: { span: 6 },
    },
    {
      field: 'time',
      label: '创建时间',
      defaultValue: allTime,
      component: 'RangePicker',
      componentProps: {
        valueFormat: 'YYYY-MM-DD',
        placeholder: ['开始日期', '结束日期'],
      },
      colProps: { span: 6 },
    },
  ]
}
export const columnsModel: BasicColumn[] = [
  {
    title: '用户名/手机号',
    dataIndex: 'nickName',
    width: 150,
    customRender: ({ record }) => {
      return h('div', { textAlign: 'center' }, [
        h('span', {}, record.nickName || '-'),
        h('br'),
        h('span', {}, record.phone || '-'),
      ])
    },
  },
  {
    title: '订单编号/签约时间',
    dataIndex: 'orderSn',
    customRender: ({ record }) => {
      return h('div', { textAlign: 'center' }, [
        h('span', {}, record.orderSn || '-'),
        h('br'),
        h('span', {}, record.signTime || '-'),
      ])
    },
  },
  {
    title: '最新到期时间',
    dataIndex: 'latestRepayDate',
    width: 180,
  },
  {
    title: '锁机状态',
    dataIndex: 'lockStatus',
    width: 100,
    customRender: ({ text }) => {
      const color = text ? 'red' : 'green'
      const txt = text ? '锁机' : '未锁机'
      return h(Tag, { color }, txt)
    },
  },
  {
    title: '操作时间',
    dataIndex: 'updateTime',
    width: 180,
    customRender: ({ text }) => {
      return text ? dayjs(text).format('YYYY-MM-DD hh:mm:ss') : '-'
    },
  },
]

export const columnsModel2: BasicColumn[] = [
  {
    title: '姓名/手机号',
    dataIndex: 'nickName',
    width: 150,
    customRender: ({ record }) => {
      return h('div', { textAlign: 'center' }, [
        h('span', {}, record.nickName || '-'),
        h('br'),
        h('span', {}, record.phone || '-'),
      ])
    },
  },
  {
    title: '订单编号/创建时间',
    dataIndex: 'orderSn',
    customRender: ({ record }) => {
      return h('div', { textAlign: 'center' }, [
        h('span', {}, record.orderSn || '-'),
        h('br'),
        h('span', {}, record.createTime || '-'),
      ])
    },
  },
  {
    title: '订单状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ text }) => {
      const find: any = statusList.find((v) => v.value == text)
      return h(Tag, { color: find?.color || '' }, () => find?.label)
    },
  },
]

export function salespersonColumns(handleOverdue): BasicColumn[] {
  return [
    {
      title: '业务员',
      dataIndex: 'salesperson',
      width: 150,
      customRender: ({ text }) => text || '-',
    },
    // {
    //   title: '归属商家平台',
    //   dataIndex: 'merchantName',
    //   width: 130,
    //   customRender: ({ text }) => text || '-',
    // },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      width: 100,
      sorter: true,
      customRender: ({ text, record }) => {
        record['entry'] = 'salesPerson'
        return (
          <div
            style={{ color: '#49a6ea', cursor: 'pointer' }}
            onClick={() => handleOverdue(record, false, 0)}
          >
            {text}
          </div>
        )
      },
    },
    {
      title: '总到期订单',
      dataIndex: 'expOrderCount',
      width: 120,
      sorter: true,
      customRender: ({ text, record }) => {
        record['entry'] = 'salesPerson'
        return (
          <div
            style={{ color: '#49a6ea', cursor: 'pointer' }}
            onClick={() => handleOverdue(record, false, 1)}
          >
            {text}
          </div>
        )
      },
    },
    {
      title: '逾期订单',
      dataIndex: 'overdueOrderCount',
      sorter: true,
      customRender: ({ text, record }) => {
        record['entry'] = 'salesPerson'
        return (
          <div
            style={{ color: '#49a6ea', cursor: 'pointer' }}
            onClick={() => handleOverdue(record, true, 2)}
          >
            {text}
          </div>
        )
      },
      width: 120,
    },
    // {
    //   title: '近3月逾期率',
    //   dataIndex: 'overdueScaleLast90',
    //   width: 120,
    //   sorter: true,
    //   customRender: ({ text }) => handleToFixed2(text * 100) + '%',
    // },
    {
      title: '订单总金额(元)',
      dataIndex: 'totalAmount',
      width: 180,
      helpMessage: '取值: 【含锁费、公证、增值服务、订单账单金额;不含罚金】',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '首付总金额(元)',
      dataIndex: 'downPaymentAmount',
      width: 140,
      helpMessage: '取值: 【含锁费、公证、增值服务、订单账单金额、部分还款】',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '待收租金金额(元)',
      dataIndex: 'pendingAmount',
      width: 160,
      helpMessage: '取值: 【除去首付以及已还金额期数租金总额、不含逾期租金总金额;不含罚金】',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '已还租金总额(元)',
      dataIndex: 'repaidAmount',
      width: 160,
      helpMessage: '取值: 【含部分还款;不含罚金】',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '逾期剩余未还租金总额(元)',
      dataIndex: 'overdueResidueAmount',
      width: 220,
      helpMessage: '取值: 【含部分还款;不含罚金】',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '已结清订单总金额(元)',
      dataIndex: 'settleAmount',
      width: 180,
      helpMessage: '取值: 【含锁费、公证、增值服务、订单账单金额、罚金】',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '订单罚金总金额(元)',
      dataIndex: 'penaltyAmount',
      width: 180,
      helpMessage: '取值: 在租订单产生的订单罚金',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '订单已还罚金总金额(元)',
      dataIndex: 'repaidPenaltyAmount',
      width: 220,
      helpMessage: '取值: 在租订单产生的订单罚金已还金额',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '金额逾期率',
      dataIndex: 'amountOverdueScale',
      width: 140,
      sorter: true,
      fixed: 'right',
      helpMessage:
        '计算:金额逾期率=逾期剩余未还租金总额(实时)/2期到期的有效订单租金总金额【1、排除首付金额; 2、有效订单指:租赁生效、已逾期、已买断、已完结订单】',
      customRender: ({ text }) => handleToFixed2((text || 0) * 100) + '%',
    },
    {
      title: '订单逾期率',
      dataIndex: 'overdueScale',
      width: 120,
      sorter: true,
      fixed: 'right',
      customRender: ({ text }) => handleToFixed2(text * 100) + '%',
    },
    {
      title: '逾期排名',
      dataIndex: 'sortNum',
      width: 120,
      sorter: true,
      fixed: 'right',
      defaultSortOrder: 'descend',
      customRender: ({ text }) => {
        if (text <= 3) {
          return h('div', { style: { color: 'red' } }, text)
        }
        return text
      },
    },
  ]
}

export const searchSalespersonFormSchema: FormSchema[] = [
  {
    label: '业务员',
    field: 'salespersonId',
    component: 'ApiSelect',
    colProps: { span: 6 },
    componentProps: {
      showSearch: true,
      placeholder: '请选择',
      api: getSalespersonStoreList,
      params: { pageSize: 999999, cursor: 999999, ignoreChild: 1 },
      resultField: 'list',
      labelField: 'name',
      valueField: 'id',
    },
  },
  {
    field: 'spuType',
    label: '商品类目',
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
      options: spuTypeList,
    },
    colProps: { span: 6 },
  },
  // {
  //   ifShow: hasPermission('MerchantAccountCode'),
  //   label: '归属商家平台',
  //   field: 'merchantAccountCode',
  //   component: 'ApiSelect',
  //   colProps: { span: 6 },
  //   componentProps: {
  //     showSearch: true,
  //     placeholder: '请选择',
  //     api: getStoreList,
  //     params: { pageSize: 999999 },
  //     resultField: 'list',
  //     labelField: 'merchantName',
  //     valueField: 'merchantCode',
  //   },
  // },
  {
    field: 'time',
    label: '订单创建时间',
    component: 'RangePicker',
    defaultValue: allTime,
    componentProps: {
      value: allTime,
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
]

export function storeColumns(handleOverdue): BasicColumn[] {
  return [
    {
      title: '门店名称',
      dataIndex: 'storeMerchantName',
      width: 150,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      width: 100,
      sorter: true,
      customRender: ({ text, record }) => {
        record['entry'] = 'store'
        return (
          <div
            style={{ color: '#49a6ea', cursor: 'pointer' }}
            onClick={() => handleOverdue(record, false, 0)}
          >
            {text}
          </div>
        )
      },
    },
    {
      title: '总到期订单',
      dataIndex: 'expOrderCount',
      width: 120,
      sorter: true,
      customRender: ({ text, record }) => {
        record['entry'] = 'store'
        return (
          <div
            style={{ color: '#49a6ea', cursor: 'pointer' }}
            onClick={() => handleOverdue(record, false, 1)}
          >
            {text}
          </div>
        )
      },
      width: 120,
    },
    {
      title: '逾期订单',
      dataIndex: 'overdueOrderCount',
      sorter: true,
      width: 120,
      customRender: ({ text, record }) => {
        record['entry'] = 'store'
        return (
          <div
            style={{ color: '#49a6ea', cursor: 'pointer' }}
            onClick={() => handleOverdue(record, true, 2)}
          >
            {text}
          </div>
        )
      },
    },
    // {
    //   title: '近3月逾期率',
    //   dataIndex: 'overdueScaleLast90',
    //   width: 120,
    //   sorter: true,
    //   customRender: ({ text }) => handleToFixed2(text * 100) + '%',
    // },
    {
      title: '订单总金额(元)',
      dataIndex: 'totalAmount',
      width: 180,
      helpMessage: '取值: 【含锁费、公证、增值服务、订单账单金额;不含罚金】',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '首付总金额(元)',
      dataIndex: 'downPaymentAmount',
      width: 140,
      helpMessage: '取值: 【含锁费、公证、增值服务、订单账单金额、部分还款】',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '待收租金金额(元)',
      dataIndex: 'pendingAmount',
      width: 160,
      helpMessage: '取值: 【除去首付以及已还金额期数租金总额、不含逾期租金总金额;不含罚金】',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '已还租金总额(元)',
      dataIndex: 'repaidAmount',
      width: 160,
      helpMessage: '取值: 【含部分还款;不含罚金】',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '逾期剩余未还租金总额(元)',
      dataIndex: 'overdueResidueAmount',
      width: 220,
      helpMessage: '取值: 【含部分还款;不含罚金】',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '已结清订单总金额(元)',
      dataIndex: 'settleAmount',
      width: 180,
      helpMessage: '取值: 【含锁费、公证、增值服务、订单账单金额、罚金】',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '订单罚金总金额(元)',
      dataIndex: 'penaltyAmount',
      width: 180,
      helpMessage: '取值: 在租订单产生的订单罚金',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '订单已还罚金总金额(元)',
      dataIndex: 'repaidPenaltyAmount',
      width: 220,
      helpMessage: '取值: 在租订单产生的订单罚金已还金额',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '金额逾期率',
      dataIndex: 'amountOverdueScale',
      width: 140,
      sorter: true,
      fixed: 'right',
      helpMessage:
        '计算:金额逾期率=逾期剩余未还租金总额(实时)/2期到期的有效订单租金总金额【1、排除首付金额; 2、有效订单指:租赁生效、已逾期、已买断、已完结订单】',
      customRender: ({ text }) => handleToFixed2((text || 0) * 100) + '%',
    },
    {
      title: '订单逾期率',
      dataIndex: 'overdueScale',
      width: 120,
      sorter: true,
      fixed: 'right',
      customRender: ({ text }) => handleToFixed2(text * 100) + '%',
    },
    {
      title: '逾期排名',
      dataIndex: 'sortNum',
      width: 120,
      sorter: true,
      fixed: 'right',
      defaultSortOrder: 'descend',
      customRender: ({ text }) => {
        if (text <= 3) {
          return h('div', { style: { color: 'red' } }, text)
        }
        return text
      },
    },
  ]
}

export const storeSearchFormSchema: FormSchema[] = [
  {
    field: 'storeMerchantName',
    label: '门店名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'spuType',
    label: '商品类目',
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
      options: spuTypeList,
    },
    colProps: { span: 6 },
  },
  {
    field: 'time',
    label: '创建时间',
    component: 'RangePicker',
    defaultValue: allTime,
    componentProps: {
      value: allTime,
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
]

export const orderColumns: BasicColumn[] = [
  {
    title: '业务员',
    dataIndex: 'salesperson',
    width: 150,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '订单数',
    dataIndex: 'orderCount',
    width: 100,
    sorter: true,
    defaultSortOrder: 'descend',
    customRender: ({ text }) => text || 0,
  },
  {
    title: '总到期订单',
    dataIndex: 'expOrderCount',
    width: 120,
    sorter: true,
    customRender: ({ text }) => text || 0,
  },
  {
    title: '逾期订单',
    dataIndex: 'overdueOrderCount',
    sorter: true,
    width: 120,
  },
  {
    title: '订单总金额(元)',
    dataIndex: 'totalAmount',
    width: 180,
    helpMessage: '取值: 【含锁费、公证、增值服务、订单账单金额;不含罚金】',
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '首付总金额(元)',
    dataIndex: 'downPaymentAmount',
    width: 140,
    helpMessage: '取值: 【含锁费、公证、增值服务、订单账单金额、部分还款】',
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '待收租金金额(元)',
    dataIndex: 'pendingAmount',
    width: 160,
    helpMessage: '取值: 【除去首付以及已还金额期数租金总额、不含逾期租金总金额;不含罚金】',
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '已还租金总额(元)',
    dataIndex: 'repaidAmount',
    width: 160,
    helpMessage: '取值: 【含部分还款;不含罚金】',
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '逾期剩余未还租金总额(元)',
    dataIndex: 'overdueResidueAmount',
    width: 220,
    helpMessage: '取值: 【含部分还款;不含罚金】',
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '已结清订单总金额(元)',
    dataIndex: 'settleAmount',
    width: 180,
    helpMessage: '取值: 【含锁费、公证、增值服务、订单账单金额、罚金】',
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '订单罚金总金额(元)',
    dataIndex: 'penaltyAmount',
    width: 180,
    helpMessage: '取值: 在租订单产生的订单罚金',
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '订单已还罚金总金额(元)',
    dataIndex: 'repaidPenaltyAmount',
    width: 220,
    helpMessage: '取值: 在租订单产生的订单罚金已还金额',
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '金额逾期率',
    dataIndex: 'amountOverdueScale',
    width: 140,
    sorter: true,
    fixed: 'right',
    helpMessage:
      '计算:金额逾期率=逾期剩余未还租金总额(实时)/2期到期的有效订单租金总金额【1、排除首付金额; 2、有效订单指:租赁生效、已逾期、已买断、已完结订单】',
    customRender: ({ text }) => handleToFixed2(text * 100) + '%',
  },
  {
    title: '订单逾期率',
    dataIndex: 'overdueScale',
    width: 120,
    sorter: true,
    fixed: 'right',
    customRender: ({ text }) => handleToFixed2(text * 100) + '%',
  },
]

export const searchOrderFormSchema: FormSchema[] = [
  {
    label: '业务员',
    field: 'salespersonId',
    component: 'ApiSelect',
    colProps: { span: 6 },
    componentProps: {
      showSearch: true,
      placeholder: '请选择',
      api: getSalespersonStoreList,
      params: { pageSize: 999999, cursor: 999999, ignoreChild: 1 },
      resultField: 'list',
      labelField: 'name',
      valueField: 'id',
    },
  },
  {
    field: 'spuType',
    label: '商品类目',
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
      options: spuTypeList,
    },
    colProps: { span: 6 },
  },
  {
    field: 'time',
    label: '订单创建时间',
    component: 'RangePicker',
    defaultValue: allTime,
    componentProps: {
      value: allTime,
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
]

export const searchFormSchemaModal: FormSchema[] = [
  {
    field: 'orderSn',
    label: '订单编号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'nickName',
    label: '姓名',
    component: 'Input',
    colProps: { span: 6 },
  },
]
