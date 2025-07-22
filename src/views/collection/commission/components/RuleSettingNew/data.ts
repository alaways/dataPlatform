import { FormSchema } from '/@/components/Table'
import { getUserList } from '/@/api/system/account'

export const distributeUidListOptions = [
  { label: '即将到期订单-未有逾期', value: 11 },
  { label: '即将到期订单-单期逾期', value: 12 },
  { label: '即将到期订单-多期逾期', value: 13 },
  // { label: '逾期订单-单期逾期', value: 14 },
  // { label: '逾期订单-多期逾期', value: 15 },
  { label: '逾期天数-第1天', value: 50001 },
  { label: '逾期天数-第8天', value: 50008 },
  { label: '逾期天数-第15天', value: 50015 },
  { label: '逾期天数-第31天', value: 50031 },
  { label: '逾期天数-第61天', value: 50061 },
  { label: '逾期天数-第91天', value: 50091 },
]

export const distributeTypeOptions = [
  {
    label: '循环分配',
    value: 2,
    helpMessage:
      '循环分配: 配置循环分配给A、B、C三人,第一条数据给A,第二条给B,第三条数据给C,依次循环',
  },
]

export const ruleFormSchema: FormSchema[] = [
  {
    field: 'clientMax',
    component: 'InputNumber',
    label: '拥有任务限制',
    colProps: { span: 10 },
    helpMessage: '拥有任务数上线',
    suffix: '个',
    required: true,
  },
  {
    field: 'seat1',
    component: 'Input',
    label: '',
    colProps: { span: 10 },
    slot: 'seat1',
  },
  {
    field: 'clientLockMax',
    component: 'InputNumber',
    label: '锁定任务限制',
    colProps: { span: 10 },
    helpMessage: '锁定任务数上限',
    suffix: '个',
    required: true,
  },
  {
    field: 'limit',
    component: 'RadioGroup',
    label: '领取频率规则',
    defaultValue: 0,
    colProps: { span: 20 },
    required: true,
    componentProps: {
      options: [
        { label: '不限制', value: 0 },
        { label: '限制', value: 1 },
      ],
    },
  },
  {
    ifShow: ({ values }) => values.limit == 1,
    field: 'collectionFrequency',
    component: 'Input',
    label: ' ',
    slot: 'collectionFrequency',
    colProps: { span: 24 },
  },
  {
    field: 'recycleEnable',
    component: 'RadioGroup',
    label: '收回规则',
    defaultValue: 0,
    colProps: { span: 20 },
    required: true,
    componentProps: {
      options: [
        { label: '自动回收', value: 1 },
        { label: '不自动回收', value: 0 },
      ],
    },
  },
  {
    ifShow: ({ values }) => values.recycleEnable == 1,
    field: 'recycleDay',
    component: 'Input',
    label: ' ',
    slot: 'recycleDay',
    colProps: { span: 24 },
  },
  {
    field: 'distributeEnable',
    component: 'RadioGroup',
    label: '自动分配',
    defaultValue: 1,
    colProps: { span: 20 },
    required: true,
    componentProps: {
      options: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 },
      ],
    },
  },
  {
    ifShow: ({ values }) => values.distributeEnable == 1,
    field: 'scopeList',
    component: 'Input',
    label: ' ',
    slot: 'scopeList',
    colProps: { span: 24 },
  },
  {
    show: ({ values }) => values.distributeEnable == 1,
    field: 'distributeType',
    component: 'RadioGroup',
    label: '分配逻辑',
    defaultValue: 1,
    colProps: { span: 20 },
    required: true,
    slot: 'distributeType',
  },
  {
    show: false,
    field: 'distributeUidList',
    label: '分配用户',
    component: 'ApiSelect',
    colProps: { span: 10 },
    componentProps: {
      showSearch: true,
      mode: 'multiple',
      placeholder: '请选择',
      api: getUserList,
      params: { limit: 999999, status: '1', roleKey: 'kefu' },
      resultField: 'list',
      labelField: 'userName',
      valueField: 'uid',
    },
  },
  {
    show: ({ values }) => values.distributeEnable == 1,
    field: 'distributeUidInfoList',
    component: 'Input',
    label: '分配人员',
    colProps: { span: 24 },
    slot: 'distributeUidInfoList',
  },
]
