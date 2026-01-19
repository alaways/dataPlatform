import { Switch } from 'ant-design-vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { h } from 'vue'
import { useMessage } from '/@/hooks/web/useMessage'
import { updateLegalChannelsItem } from '/@/api/collection/legalChannels'

export const columns: BasicColumn[] = [
  {
    title: '法诉渠道',
    dataIndex: 'name',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '状态',
    dataIndex: 'status',
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
          updateLegalChannelsItem({ ...record, status: newStatus })
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
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '法诉渠道',
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
        { label: '开启', value: 1 },
        { label: '禁用', value: 0 },
      ],
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
    field: 'name',
    label: '法诉渠道',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioGroup',
    colProps: { span: 20 },
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '开启', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
  },
]
