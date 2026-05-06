import { BasicColumn, FormSchema } from '/@/components/Table'
export const columns: BasicColumn[] = [
  {
    title: '',
    dataIndex: '',
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'overdueDays',
    label: '筛选范围',
    labelWidth: 64,
    defaultValue: '0',
    component: 'RadioButtonGroup',
    componentProps: {
      options: [
        { label: '0+', value: '0' },
        { label: '30+', value: 30 },
        { label: '60+', value: 60 },
        { label: '90+', value: 90 },
      ],
    },
    colProps: { span: 6 },
  },
  // {
  //   field: 'rentType',
  //   label: '维度',
  //   component: 'Select',
  //   labelWidth: 64,
  //   defaultValue: 2,
  //   colProps: { span: 3 },
  //   componentProps: {
  //     allowClear: false,
  //     options: [
  //       { label: '全部', value: '' },
  //       { label: '日付', value: 0 },
  //       { label: '周付', value: 1 },
  //       { label: '月付', value: 2 },
  //       { label: '十天', value: 4 },
  //     ],
  //   },
  // },
  // {
  //   field: 'spuType',
  //   label: '品类',
  //   labelWidth: 50,
  //   component: 'Select',
  //   defaultValue: '',
  //   colProps: { span: 3 },
  //   componentProps: {
  //     allowClear: false,
  //     options: [
  //       { label: '全部', value: '' },
  //       { label: '手机', value: 1 },
  //       { label: '电动车', value: 2 },
  //     ],
  //   },
  // },
  {
    field: 'historyAttachment',
    label: '数据对比',
    fields: ['historyAttachment2'],
    component: 'DatePicker',
    colProps: { span: 10 },
  },
  {
    show: false,
    field: 'historyAttachment2',
    label: '对比日期',
    component: 'Input',
  },
  {
    field: 'rentModeFullList',
    label: '租赁模式',
    component: 'Select',
    componentProps: {
      mode: 'multiple',
      options: [
        { label: '租完即送', value: 'ZWJS' },
        { label: '租完归还/续租/买断', value: 'ZM' },
        { label: '短租（租完归还）', value: 'ZM01' },
        { label: '租完归还/续租/买断-支持随租随还', value: 'ZM02' },
        { label: '续租', value: 'ZMXZ' },
      ],
    },
    colProps: { span: 8 },
  },
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
export const searchAmountFormSchema: FormSchema[] = [
  {
    field: 'pointType',
    label: '订单总租金是否含首付',
    labelWidth: 148,
    component: 'Select',
    defaultValue: 1,
    componentProps: {
      allowClear: false,
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 2 },
      ],
    },
    colProps: { span: 5 },
  },
  {
    field: 'overdueDays',
    label: '筛选范围',
    labelWidth: 90,
    component: 'RadioButtonGroup',
    defaultValue: 30,
    componentProps: {
      options: [
        { label: '0+', value: '0' },
        { label: '30+', value: 30 },
        { label: '60+', value: 60 },
        { label: '90+', value: 90 },
      ],
    },
    colProps: { span: 7 },
  },
  // {
  //   field: 'rentType',
  //   label: '维度',
  //   component: 'Select',
  //   defaultValue: 2,
  //   colProps: { span: 5 },
  //   componentProps: {
  //     allowClear: false,
  //     options: [
  //       { label: '全部', value: '' },
  //       { label: '日付', value: 0 },
  //       { label: '周付', value: 1 },
  //       { label: '月付', value: 2 },
  //       { label: '十天', value: 4 },
  //     ],
  //   },
  // },
  // {
  //   field: 'spuType',
  //   label: '品类',
  //   labelWidth: 50,
  //   component: 'Select',
  //   defaultValue: '',
  //   colProps: { span: 5 },
  //   componentProps: {
  //     allowClear: false,
  //     options: [
  //       { label: '全部', value: '' },
  //       { label: '手机', value: 1 },
  //       { label: '电动车', value: 2 },
  //     ],
  //   },
  // },
  {
    field: 'historyAttachment',
    label: '数据对比',
    fields: ['historyAttachment2'],
    component: 'DatePicker',
    colProps: { span: 10 },
  },
  {
    show: false,
    field: 'historyAttachment2',
    label: '对比日期',
    component: 'Input',
  },
  {
    field: 'rentModeFullList',
    label: '租赁模式',
    component: 'Select',
    componentProps: {
      mode: 'multiple',
      options: [
        { label: '租完即送', value: 'ZWJS' },
        { label: '租完归还/续租/买断', value: 'ZM' },
        { label: '短租（租完归还）', value: 'ZM01' },
        { label: '租完归还/续租/买断-支持随租随还', value: 'ZM02' },
        { label: '续租', value: 'ZMXZ' },
        { label: '计算器计价', value: 'ZM03' },
        { label: '地区政策表', value: 'ZM05' },
      ],
    },
    colProps: { span: 8 },
  },
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
  {
    field: 'rentModeNameType',
    label: '新租赁模式',
    component: 'Select',
    componentProps: {
      mode: 'multiple',
      options: [
        { label: '租赁模式/租完即送', value: '1' },
        { label: '租赁模式/租完租完归还', value: '2' },
      ],
    },
    colProps: { span: 8 },
  },
]
