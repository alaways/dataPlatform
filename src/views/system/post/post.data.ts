import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { h } from 'vue'
import { Switch } from 'ant-design-vue'
import { useMessage } from '/@/hooks/web/useMessage'
import { updatePostItem } from '/@/api/system/post'

export const columns: BasicColumn[] = [
  {
    title: '岗位名称',
    dataIndex: 'postName',
    width: 180,
  },
  {
    title: '岗位标识',
    dataIndex: 'postCode',
    width: 120,
  },
  {
    title: '显示排序',
    dataIndex: 'postSort',
    width: 100,
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
        checked: record.status === '1',
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true
          const newStatus = checked ? '1' : '0'
          const { createMessage } = useMessage()
          updatePostItem({ ...record, status: newStatus })
            .then(() => {
              record.status = newStatus
              createMessage.success(record.status === '1' ? `已启用` : '已禁用')
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
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'postName',
    label: '岗位名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'postCode',
    label: '岗位标识',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: 0 },
        { label: '停用', value: 1 },
      ],
    },
    colProps: { span: 8 },
  },
]

export const formSchema: FormSchema[] = [
  {
    field: 'postId',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'postName',
    label: '岗位名称',
    required: true,
    component: 'Input',
    colProps: { span: 20 },
  },
  {
    field: 'postCode',
    label: '岗位标识',
    required: true,
    component: 'Input',
    colProps: { span: 20 },
  },
  {
    field: 'postSort',
    label: '排序',
    component: 'InputNumber',
    colProps: { span: 20 },
    required: true,
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    colProps: { span: 20 },
    defaultValue: '1',
    componentProps: {
      options: [
        { label: '启用', value: '1' },
        { label: '停用', value: '0' },
      ],
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 20 },
  },
]
