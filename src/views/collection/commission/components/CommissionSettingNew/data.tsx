import { Switch, Tag } from 'ant-design-vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { useMessage } from '/@/hooks/web/useMessage'
import { h } from 'vue'
import { updateCommissionStatusItem } from '/@/api/collection/commission'
import { usePermission } from '/@/hooks/web/usePermission'
import { canParseJSON } from '/@/utils/tool'
const { hasPermission } = usePermission()

export const distributeUidListOptions = [
  { label: '即将到期订单-未有逾期', value: 11 },
  { label: '即将到期订单-单期逾期', value: 12 },
  { label: '即将到期订单-多期逾期', value: 13 },
  { label: '逾期订单-单期逾期', value: 14 },
  { label: '逾期订单-多期逾期', value: 15 },
]

export const rulesTitle = {
  0: '当月已回款即将到期订单数',
  1: '当月回款催收订单数',
}

export const columns: BasicColumn[] = [
  {
    title: '序号',
    dataIndex: 'sort',
    width: 80,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '逾期天数',
    dataIndex: 'envs',
    customRender: ({ text }) => {
      if (!text) return '-'

      const arr = String(text).split(',')
      return `${arr[0] || '-'} 至 ${arr[1] || '-'}`
    },
  },
  {
    title: '提成点',
    dataIndex: 'returnVal',
    align: 'left',
    customRender: ({ text }) => {
      if (!text || text == 'NaN' || !canParseJSON(text)) {
        return '-'
      }
      const returnVal = JSON.parse(text)
      const rules: any = returnVal.rules
      let first: any = {}
      let olist: any = []
      if (rules && rules.length) {
        first = rules.find((v) => v.ge == -1)
        olist = rules.filter((v) => v.ge != -1)
      }
      return (
        <>
          <div style={{ display: first ? 'block' : 'none' }}>
            初始提成 &nbsp;&nbsp;&nbsp;{(first.val * 100).toFixed(2)}%
          </div>
          <div>{rulesTitle[returnVal.inIndex || 0]}</div>
          {olist.map((v, i) => (
            <div key={i}>
              {v.ge}单 &nbsp;&nbsp;&nbsp;提成{(v.val * 100).toFixed(2)}%
            </div>
          ))}
        </>
      )
    },
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
    required: true,
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
    field: 'sort',
    component: 'InputNumber',
    label: '序号',
    required: true,
    helpMessage: '从小到大排序',
    colProps: { span: 10 },
  },
  {
    field: 't1',
    component: 'InputNumber',
    label: '',
    colProps: { span: 10 },
    slot: 't1',
  },
  {
    label: '阶梯提成',
    field: 'inIndex',
    component: 'Select',
    defaultValue: 0,
    colProps: { span: 10 },
    componentProps: ({ formModel }) => {
      return {
        allowClear: false,
        options: [
          { label: '当月即将到期回款订单', value: 0 },
          { label: '当月催收回款订单', value: 1 },
        ],
        onChange: (e) => {
          formModel.ge = rulesTitle[e] || ''
        },
      }
    },
  },
  {
    label: '',
    field: 'ge',
    component: 'Input',
    defaultValue: 0,
    colProps: { span: 24 },
    slot: 'ge',
  },
  {
    label: '',
    field: 'geForm',
    component: 'Input',
    slot: 'geForm',
    colProps: { span: 24 },
  },
]

export function geFormSchema(n: number): FormSchema[] {
  let geItem: any = {
    field: `ge${n}`,
    component: 'InputNumber',
    label: '',
    required: true,
    colProps: { span: 9 },
  }
  if (!n) {
    geItem = {
      field: `ge0`,
      component: 'InputNumber',
      label: '',
      defaultValue: -1,
      colProps: { span: 9 },
      slot: 'ge0',
    }
  }
  return [
    geItem,
    {
      field: `txtOne${n}`,
      component: 'Input',
      label: '',
      colProps: { span: 1 },
      slot: 'txtOne',
    },
    {
      field: `val${n}`,
      component: 'InputNumber',
      label: '',
      colProps: { span: 9 },
      required: true,
      componentProps: {
        addonAfter: '%',
      },
    },
    {
      field: `${n}`,
      component: 'Input',
      colProps: { span: 4 },
      label: '',
      labelWidth: 1,
      slot: 'del',
    },
  ]
}
