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
    title: '期数',
    dataIndex: '期数',
    width: 100,
    customRender: ({ text }) => {
      return text || '-'
    },
  },
  {
    title: '当前逾期率',
    dataIndex: '当前逾期率',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: '当前7天逾期率',
    width: 120,
    dataIndex: '当前7天逾期率',
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: '当前M1逾期率',
    dataIndex: '当前M1逾期率',
    width: 120,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: '当前M2逾期率',
    dataIndex: '当前M2逾期率',
    width: 120,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: '整体催回率',
    dataIndex: '整体催回率',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: 'M1天催回率',
    dataIndex: 'M1天催回率',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: '7天催回率',
    dataIndex: '7天催回率',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
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
  // {
  //   field: 'periodNo',
  //   label: '逾期率类型',
  //   defaultValue: 2,
  //   component: 'Select',
  //   componentProps: {
  //     options: [
  //       { label: 'FPD逾期率', value: 2 },
  //       { label: 'SPD逾期率', value: 3 },
  //     ],
  //   },
  //   colProps: { span: 6 },
  // },
  {
    field: 'categoryInfoType',
    label: '品类',
    component: 'Select',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '二手机', value: 1 },
        { label: '全新机', value: 2 },
      ],
    },
    colProps: { span: 6 },
  },
  // {
  //   field: 'rentModeNameType',
  //   label: '租赁模式',
  //   component: 'Select',
  //   componentProps: {
  //     options: [
  //       { label: '租赁模式/租完即送', value: 1 },
  //       { label: '租赁模式/租完租完归还', value: 2 },
  //     ],
  //   },
  //   colProps: { span: 6 },
  // },
  // {
  //   field: 'merchantTerminalNoList',
  //   label: '平台',
  //   component: 'ApiSelect',
  //   colProps: { span: 6 },
  //   componentProps: () => {
  //     return {
  //       params: { limit: '999999' },
  //       showSearch: true,
  //       placeholder: '请选择小程序',
  //       api: getAppList,
  //       afterFetch: (data) => {
  //         const ndata = data.list
  //         return ndata
  //       },
  //       mode: 'multiple',
  //       resultField: 'list',
  //       labelField: 'appletName',
  //       valueField: 'merchantTerminalNo',
  //     }
  //   },
  // },
]
