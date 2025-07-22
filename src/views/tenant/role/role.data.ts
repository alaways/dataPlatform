import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { h } from 'vue'
import { Switch } from 'ant-design-vue'
import { useMessage } from '/@/hooks/web/useMessage'
import { updateRoleItem } from '/@/api/system/role'
import { useUserStore } from '/@/store/modules/user'

export const columns: BasicColumn[] = [
  {
    title: '角色名称',
    dataIndex: 'roleName',
    width: 180,
  },
  {
    title: '角色标识',
    dataIndex: 'roleKey',
    width: 120,
  },
  {
    title: '显示排序',
    dataIndex: 'roleSort',
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
          const roleId = useUserStore().getUserInfo.roleId
          if (roleId == record.roleId) {
            record.pendingStatus = false
            createMessage.error('无法禁用当前登录的角色')
            return
          }
          updateRoleItem({ ...record, status: newStatus })
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
    field: 'roleName',
    label: '角色名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'roleKey',
    label: '角色标识',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: '1' },
        { label: '停用', value: '0' },
      ],
    },
    colProps: { span: 8 },
  },
]

export const formSchema: FormSchema[] = [
  {
    field: 'roleId',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'roleName',
    label: '角色名称',
    required: true,
    component: 'Input',
    colProps: { span: 20 },
  },
  {
    field: 'roleKey',
    label: '角色标识',
    required: true,
    component: 'Input',
    colProps: { span: 20 },
  },
  {
    field: 'roleSort',
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

export const menuFormSchema: FormSchema[] = [
  {
    field: 'roleId',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    label: ' ',
    labelWidth: 1,
    field: 'menuIds',
    slot: 'menu',
    component: 'Input',
    colProps: { span: 24 },
  },
]
