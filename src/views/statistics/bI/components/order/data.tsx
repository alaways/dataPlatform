import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { handleMonth } from '/@/utils/order'
import dayjs from 'dayjs'
import { getCategoryTree } from '/@/api/statistics/index'
export const columns: BasicColumn[] = [
  {
    title: '时间',
    dataIndex: 'dateFormat',
    width: 150,
    customRender: ({ text }) => {
      return dayjs(text).format('YYYY-MM-DD')
    },
  },
  // {
  //   title: '商详UV ',
  //   dataIndex: 'pv',
  //   width: 150,
  //   customRender: ({ text }) => {
  //     return text || '-'
  //   },
  // },
  {
    title: '下单数',
    width: 130,
    dataIndex: 'orderNumber',
  },
  // {
  //   title: '已实名数',
  //   dataIndex: 'realNameNumber',
  //   width: 140,
  // },
  {
    title: '预审数',
    dataIndex: 'preCreate',
    width: 100,
  },
  {
    title: '预审通过数',
    dataIndex: 'prePass',
    width: 100,
  },
  {
    title: '预授权调用数',
    dataIndex: 'risk',
    width: 100,
  },
  {
    title: '预授权通过数',
    dataIndex: 'frozen',
    width: 100,
  },
  {
    title: '机审通过',
    dataIndex: 'riskPass',
    width: 100,
    customRender: ({ text }) => {
      return text || '-'
    },
  },
  {
    title: '机审通过率',
    dataIndex: 'riskRatio',
    width: 120,
  },
  // {
  //   title: '需要人审',
  //   dataIndex: 'needRs',
  //   width: 120,
  // },
  // {
  //   title: '下单后取消',
  //   dataIndex: 'orderCancel',
  //   width: 100,
  // },
  // {
  //   title: '回访通过',
  //   dataIndex: 'auditPass',
  //   width: 100,
  // },
  {
    title: '人审通过',
    dataIndex: 'rsAuditPass',
    width: 100,
  },
  {
    title: '通过后取消',
    dataIndex: 'rsAuditCancel',
    width: 100,
  },
  {
    title: '成交数',
    dataIndex: 'auditTotalPass',
    width: 100,
  },
  {
    title: '成交发货率',
    dataIndex: 'allPassRatio',
    width: 100,
  },
  {
    title: '发货数',
    dataIndex: 'deliveryNumber',
    width: 140,
  },
  {
    title: '租完即送-随租随还',
    dataIndex: 'zmjsNumber',
    width: 100,
  },
  {
    title: '租完归还/买断/续租',
    dataIndex: 'zmNumber',
    width: 140,
  },
  {
    title: '增值服务费订单数',
    dataIndex: 'valueAddedNumber',
    width: 140,
  },
  {
    title: '首付比例',
    dataIndex: 'firstPayRatio',
    width: 100,
  },
  {
    title: '定价系数',
    dataIndex: 'priceRatio',
    width: 100,
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'time',
    label: '创建时间',
    defaultValue: handleMonth(),
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
  {
    field: 'categoryIdList',
    label: '商品分类',
    component: 'ApiTreeSelect',
    colProps: { span: 8 },
    componentProps: {
      // treeCheckable: true,
      moultiple: true,
      showSearch: true,
      placeholder: '请选择',
      api: getCategoryTree,
      fieldNames: {
        label: 'name',
        value: 'id',
        key: 'id',
      },
    },
  },
]
