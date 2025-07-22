import { Switch } from 'ant-design-vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { h } from 'vue'
import { useMessage } from '/@/hooks/web/useMessage'
import { updateSealItem } from '/@/api/contract/seal'
import { spuTypeList } from '../../goods/goodsBase/data'
import { rentTypeList } from '../../goods/goodsLease/utils'
import { copyText } from '/@/utils/copyTextToClipboard'

export const contractType = [
  { label: '契约锁', value: 1 },
  { label: 'E签宝', value: 2 },
]

export function sealColumns(other: any): BasicColumn[] {
  return [
    {
      title: '印章名称',
      dataIndex: 'company2TenantName',
      customRender: ({ text }) => {
        return h('div', { onclick: () => copyText(text, '复制成功') }, text)
      },
    },
    {
      title: '印章编号',
      width: 200,
      dataIndex: 'sealId',
      customRender: ({ text }) => {
        return h('div', { onclick: () => copyText(text, '复制成功') }, text)
      },
    },
    {
      title: '法人',
      dataIndex: 'company2UserName',
      width: 120,
      customRender: ({ text }) => {
        return h('div', { onclick: () => copyText(text, '复制成功') }, text)
      },
    },
    {
      title: '统一信用代码',
      dataIndex: 'creditCode',
      width: 120,
      customRender: ({ text }) => {
        return h('div', { onclick: () => copyText(text, '复制成功') }, text)
      },
    },
    {
      title: '营业执照地址',
      dataIndex: 'company2TenantAddress',
      width: 200,
      customRender: ({ text }) => {
        return h('div', { onclick: () => copyText(text, '复制成功') }, text)
      },
    },
    {
      title: '手机号',
      dataIndex: 'company2UserContact',
      width: 120,
      customRender: ({ text }) => {
        return h('div', { onclick: () => copyText(text, '复制成功') }, text)
      },
    },
    {
      title: '合同来源',
      dataIndex: 'type',
      width: 100,
      customRender: ({ text }) => {
        const find: any = contractType.find((v) => v.value == text)
        return find?.label || '-'
      },
    },
    {
      title: '租赁类型',
      dataIndex: 'rentType',
      width: 100,
      customRender: ({ text }) => {
        if (text) {
          const list = text.split(',').map((v) => {
            if (v == 2) {
              return '月付'
            }
            const find = rentTypeList.find((f) => f.value == v)
            return find?.label || '-'
          })
          return list.join() || '-'
        }
        return '-'
      },
    },
    {
      title: '商品类目',
      dataIndex: 'spuType',
      width: 100,
      customRender: ({ text }) => {
        const find: any = spuTypeList.find((v) => v.value == text)
        return find?.label || '-'
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 50,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '默认设置',
      dataIndex: 'isDefault',
      width: 120,
      customRender: ({ record }) => {
        if (!Reflect.has(record, 'pendingIsDefault')) {
          record.pendingIsDefault = false
        }
        return h(Switch, {
          checked: record.isDefault === 1,
          checkedChildren: '已开启',
          unCheckedChildren: '已关闭',
          loading: record.pendingIsDefault,
          onChange(checked: boolean) {
            record.pendingIsDefault = true
            const newIsDefault = checked ? 1 : 0
            const { createMessage } = useMessage()
            updateSealItem({ ...record, isDefault: newIsDefault })
              .then(() => {
                record.isDefault = newIsDefault
                other.handleSuccess()
                createMessage.success(newIsDefault ? `开启默认成功` : `关闭默认成功`)
              })
              .catch(() => {
                createMessage.error('修改默认失败')
              })
              .finally(() => {
                record.pendingIsDefault = false
              })
          },
        })
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      customRender: ({ record }) => {
        if (!Reflect.has(record, 'pendingStatus')) {
          record.pendingStatus = false
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
            updateSealItem({ ...record, status: newStatus })
              .then(() => {
                record.status = newStatus
                createMessage.success(newStatus ? `启用成功` : `停用成功`)
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
  ]
}

export const searchFormSchema: FormSchema[] = [
  {
    field: 'sealId',
    label: '印章名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: [
        { label: '已启用', value: 1 },
        { label: '已禁用', value: 0 },
      ],
    },
  },
  {
    field: 'type',
    label: '合同来源',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: contractType,
    },
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
    field: 'company2TenantName',
    label: '印章名称',
    required: true,
    component: 'Input',
    colProps: { span: 20 },
  },
  {
    field: 'sealId',
    label: '印章编号',
    required: true,
    component: 'Input',
    colProps: { span: 20 },
  },
  {
    field: 'company2UserName',
    label: '法人',
    required: true,
    component: 'Input',
    colProps: { span: 20 },
  },
  {
    field: 'company2UserContact',
    label: '手机号',
    required: true,
    component: 'Input',
    colProps: { span: 20 },
  },
  {
    field: 'creditCode',
    label: '统一信用代码',
    required: true,
    component: 'Input',
    colProps: { span: 20 },
  },
  {
    field: 'company2TenantAddress',
    label: '营业执照地址',
    required: true,
    component: 'InputTextArea',
    colProps: { span: 20 },
  },
  {
    field: 'type',
    label: '合同来源',
    required: true,
    component: 'Select',
    colProps: { span: 20 },
    componentProps: {
      options: contractType,
    },
  },
  {
    field: 'rentType',
    label: '租赁类型',
    required: true,
    component: 'Select',
    colProps: { span: 20 },
    componentProps: {
      mode: 'multiple',
      showSearch: true,
      options: rentTypeList,
    },
  },
  {
    field: 'spuType',
    label: '商品类目',
    required: true,
    component: 'Select',
    colProps: { span: 20 },
    componentProps: {
      options: spuTypeList,
    },
  },
  {
    field: 'isDefault',
    label: '设置默认',
    required: true,
    component: 'RadioGroup',
    colProps: { span: 20 },
    componentProps: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
  },
  {
    field: 'sort',
    label: '排序',
    helpMessage: '数值越小,排名越高',
    required: true,
    component: 'InputNumber',
    colProps: { span: 10 },
  },
  {
    field: 'status',
    label: '状态',
    required: true,
    component: 'RadioGroup',
    colProps: { span: 20 },
    componentProps: {
      options: [
        { label: '已启用', value: 1 },
        { label: '已禁用', value: 0 },
      ],
    },
  },
]
