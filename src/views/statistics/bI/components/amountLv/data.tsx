import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { handleMonth } from '/@/utils/order'
import { getAppList } from '/@/api/saas/app'

export const columns: BasicColumn[] = [
  {
    title: '创建时间',
    dataIndex: '创建时间',
    width: 150,
  },
  {
    title: '订单数',
    width: 130,
    dataIndex: '订单数',
  },
  {
    title: 'fpd1%',
    dataIndex: 'per-fpd1%',
    width: 140,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: 'fpd3%',
    dataIndex: 'per-fpd3%',
    width: 140,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: 'fpd7%',
    dataIndex: 'per-fpd7%',
    width: 140,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: 'fpd15%',
    dataIndex: 'per-fpd15%',
    width: 140,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: 'fpd30%',
    dataIndex: 'per-fpd30%',
    width: 140,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  
]
export const columns1: BasicColumn[] = [
  {
    title: '创建时间',
    dataIndex: '创建时间',
    width: 150,
  },
  {
    title: 'fpd1%',
    width: 130,
    dataIndex: 'amt-spd1%',
    customRender: ({ text }) => {
      return text || '-'
    },
  },
  {
    title: 'fpd3%',
    dataIndex: 'amt-spd3%',
    width: 140,
    customRender: ({ text }) => {
      return text || '-'
    },
  },
  {
    title: 'fpd7%',
    dataIndex: 'amt-spd7%',
    width: 100,
    customRender: ({ text }) => {
      return text || '-'
    },
  },
  {
    title: 'fpd15%',
    dataIndex: 'amt-spd15%',
    width: 100,
    customRender: ({ text }) => {
      return text || '-'
    },
  },
  {
    title: 'fpd30%',
    dataIndex: 'amt-spd30%',
    width: 100,
    customRender: ({ text }) => {
      return text || '-'
    },
  },
  {
    title: '人数类-fpd1%',
    dataIndex: 'pers-spd1%',
    width: 100,
    customRender: ({ text }) => {
      return text || '-'
    },
  },
  {
    title: '人数类-fpd3%',
    dataIndex: 'pers-spd3%',
    width: 100,
    customRender: ({ text }) => {
      return text || '-'
    },
  },
  {
    title: '人数类-fpd7%',
    dataIndex: 'pers-spd7%',
    width: 100,
    customRender: ({ text }) => {
      return text || '-'
    },
  },
  {
    title: '人数类-fpd15%',
    dataIndex: 'pers-spd15%',
    width: 100,
    customRender: ({ text }) => {
      return text || '-'
    },
  },
  {
    title: '人数类-fpd30%',
    dataIndex: 'pers-spd30%',
    width: 100,
    customRender: ({ text }) => {
      return text || '-'
    },
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'time',
    label: '创建时间',
    defaultValue: handleMonth(),
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
  {
    field: 'periodNo',
    label: '逾期率类型',
    defaultValue: 2,
    component: 'Select',
    componentProps: {
      options: [
        { label: 'FPD逾期率', value: 2 },
        { label: 'SPD逾期率', value: 3 },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'categoryInfoType',
    label: '品类',
    component: 'Select',
    componentProps: {
      options: [
        { label: '二手机', value: 1 },
        { label: '全新机', value: 2 },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'rentModeNameType',
    label: '租赁模式',
    component: 'Select',
    componentProps: {
      options: [
        { label: '租赁模式/租完即送', value: 1 },
        { label: '租赁模式/租完租完归还', value: 2 },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'merchantTerminalNoList',
    label: '平台',
    component: 'ApiSelect',
    colProps: { span: 6 },
    componentProps: () => {
      return {
        params: { limit: '999999' },
        showSearch: true,
        placeholder: '请选择小程序',
        api: getAppList,
        afterFetch: (data) => {
          const ndata = data.list
          return ndata
        },
        mode: 'multiple',
        resultField: 'list',
        labelField: 'appletName',
        valueField: 'merchantTerminalNo',
      }
    },
  },
]
