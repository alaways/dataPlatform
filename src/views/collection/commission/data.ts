import { Switch, Tag } from 'ant-design-vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { useMessage } from '/@/hooks/web/useMessage'
import { h } from 'vue'
import { updateCommissionStatusItem } from '/@/api/collection/commission'
import { usePermission } from '/@/hooks/web/usePermission'
import { getUserList } from '/@/api/system/account'
const { hasPermission } = usePermission()

export const distributeUidListOptions = [
  { label: '即将到期订单-未有逾期', value: 11 },
  { label: '即将到期订单-单期逾期', value: 12 },
  { label: '即将到期订单-多期逾期', value: 13 },
  { label: '逾期订单-单期逾期', value: 14 },
  { label: '逾期订单-多期逾期', value: 15 },
]

export const distributeTypeOptions = [
  {
    label: '循环分配',
    value: 2,
    helpMessage:
      '循环分配: 配置循环分配给A、B、C三人,第一条数据给A,第二条给B,第三条数据给C,依次循环',
  },
]

export const columns: BasicColumn[] = [
  {
    title: '逾期天数',
    dataIndex: 'name',
    customRender: ({ record }) => {
      return `${record.minDays || '-'} 至 ${record.maxDays || '-'}`
    },
  },
  {
    title: '提成点',
    dataIndex: 'royaltyFee',
    customRender: ({ text }) => text || '-',
  },
  {
    ifShow: !hasPermission('CollectionCommissionUpdateStatus'),
    title: '状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ text }) =>
      h(Tag, { color: text ? 'green' : 'red' }, text ? '已启用' : '已禁用'),
  },
  {
    ifShow: hasPermission('CollectionCommissionUpdateStatus'),
    title: '状态',
    dataIndex: 'status',
    width: 100,
    fiexd: 'rignt',
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'status')) {
        record.status = false
      }
      return h(Switch, {
        checked: record.status === 1,
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true
          const newStatus = checked ? 1 : 0
          const { createMessage } = useMessage()
          updateCommissionStatusItem({ id: record.id, status: newStatus })
            .then(() => {
              record.status = newStatus
              createMessage.success(record.status === 1 ? `已启用` : '已禁用')
            })
            .catch(() => {
              createMessage.error('修改状态失败')
            })
            .finally(() => {
              record.pendingStatus = false
            })
        },
      })
    },
  },
  {
    title: '最后修改时间',
    dataIndex: 'updateTime',
    width: 180,
  },
]
export const pageColumns: BasicColumn[] = [
  {
    title: '业务端',
    dataIndex: 'name',
    customRender: ({ text }) => {
      return text || '-'
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '启用状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ text }) =>
      h(Tag, { color: text ? 'green' : 'red' }, text ? '已启用' : '已禁用'),
  },
]
export const userFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    label: '逾期天数区间',
    field: 'minDays',
    component: 'InputNumber',
    colProps: { span: 20 },
    slot: 'days',
  },
  {
    show: false,
    label: '逾期天数区间',
    field: 'maxDays',
    component: 'InputNumber',
    colProps: { span: 20 },
  },
  {
    label: '提成点',
    field: 'royaltyFee',
    component: 'InputNumber',
    defaultValue: 0,
    colProps: { span: 20 },
    componentProps: {
      step: 0.01,
      min: 0,
      addonAfter: '%',
    },
  },
]

export function expireFormSchema(n: number): FormSchema[] {
  return [
    {
      field: `id${n}`,
      component: 'Input',
      label: 'ID',
      show: false,
    },
    {
      field: `sort${n}`,
      component: 'InputNumber',
      label: '',
      required: true,
      colProps: { span: 2 },
      rules: [{ required: true, message: '请输入序号', trigger: 'blur' }],
      componentProps: {
        placeholder: '请输入序号',
      },
    },
    {
      field: `expire${n}`,
      component: 'Select',
      label: '',
      labelWidth: 10,
      colProps: { span: 4 },
      required: true,
      defaultValue: '$P0',
      componentProps: {
        options: [{ label: '当月即将到期催收单(数)', value: '$P0' }],
      },
    },
    {
      field: `than${n}`,
      component: 'Select',
      label: '',
      defaultValue: '=',
      colProps: { span: 3 },
      required: true,
      componentProps: {
        options: [
          { label: '等于', value: '=' },
          { label: '大于', value: '>' },
          { label: '大于等于', value: '>=' },
          { label: '小于', value: '<' },
          { label: '小于等于', value: '<=' },
        ],
      },
    },
    {
      // 固定传，以后可能会改变固定值是$E0
      field: `Ex${n}`,
      component: 'Input',
      label: '',
      show: false,
    },
    {
      field: `envs${n}`,
      component: 'InputNumber',
      label: '',
      colProps: { span: 2 },
      required: true,
    },
    {
      field: `txtOne${n}`,
      component: 'Input',
      label: '',
      colProps: { span: 1 },
      slot: 'txtOne',
    },
    {
      field: `code${n}`,
      component: 'Select',
      label: '',
      defaultValue: 'collection-rule',
      colProps: { span: 4 },
      required: true,
      componentProps: {
        options: [{ label: '当月催收提成点计算', value: 'collection-rule' }],
      },
    },
    {
      field: `txtTwo${n}`,
      component: 'Input',
      label: '',
      colProps: { span: 1 },
      slot: 'txtTwo',
    },
    {
      field: `returnVal${n}`,
      component: 'InputNumber',
      label: '',
      required: true,
      colProps: { span: 3 },
    },
    {
      field: `txtThree${n}`,
      component: 'Input',
      label: '',
      helpMessage: '标准基数为“1”,如“设置1,则与原有逾期催收提成点计算”',
      colProps: { span: 1 },
      slot: 'txtThree',
    },
    {
      field: `${n}`,
      component: 'Input',
      colProps: { span: 2 },
      label: ' ',
      slot: 'del',
    },
    {
      field: `add${n}`,
      component: 'Input',
      label: ' ',
      colProps: { span: 24 },
      slot: 'add',
    },
  ]
}

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
