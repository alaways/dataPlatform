import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { h } from 'vue'
import { Switch, Tag } from 'ant-design-vue'
import { Icon } from '/@/components/Icon'
import { useMessage } from '/@/hooks/web/useMessage'
import { updateMenuItem } from '/@/api/system/menu'

const menuType = [
  { label: '目录', value: 'C', color: '#108ee9' },
  { label: '菜单', value: 'M', color: '#87d068' },
  { label: '按钮', value: 'F', color: '#2db7f5' },
]

export const columns: BasicColumn[] = [
  {
    title: '菜单名称',
    dataIndex: 'menuName',
    align: 'left',
    width: 230,
  },
  {
    title: '图标',
    dataIndex: 'icon',
    width: 50,
    customRender: ({ record }) => {
      return h(Icon, { icon: record.icon || '' })
    },
  },
  {
    title: '标识(唯一)',
    dataIndex: 'menuCode',
    width: 180,
  },
  {
    title: '菜单类型',
    dataIndex: 'menuType',
    width: 80,
    customRender: ({ text }) => {
      const find = menuType.find((v) => v.value == text)
      return h(Tag, { color: find?.color || 'default' }, find?.label || '-')
    },
  },
  {
    title: '文件路径',
    dataIndex: 'url',
  },
  {
    title: '排序',
    dataIndex: 'orderNum',
    width: 80,
  },
  {
    title: '菜单显示',
    dataIndex: 'visible',
    width: 100,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'visible')) {
        record.visible = false
      }
      return h(Switch, {
        checked: record.visible == '1',
        checkedChildren: '已显示',
        unCheckedChildren: '已隐藏',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true
          const newStatus = checked ? '1' : '0'
          const { createMessage } = useMessage()
          updateMenuItem({ ...record, visible: newStatus })
            .then(() => {
              record.visible = newStatus
              createMessage.success(record.visible == '1' ? `已显示` : '已隐藏')
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
    title: '状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'status')) {
        record.status = false
      }
      return h(Switch, {
        checked: record.status == '1',
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true
          const newStatus = checked ? '1' : '0'
          const { createMessage } = useMessage()
          updateMenuItem({ ...record, status: newStatus })
            .then(() => {
              record.status = newStatus
              createMessage.success(record.status == '1' ? `已启用` : '已禁用')
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
]

export const formSchema: FormSchema[] = [
  {
    show: false,
    field: 'menuId',
    label: '菜单ID',
    component: 'Input',
  },
  {
    field: 'menuName',
    label: '菜单名称',
    component: 'Input',
    required: true,
    colProps: { span: 12 },
  },
  {
    field: 'menuCode',
    label: '菜单标识',
    component: 'Input',
    required: true,
    colProps: { span: 12 },
  },
  {
    field: 'icon',
    label: '图标',
    component: 'IconPicker',
    colProps: { span: 12 },
  },
  {
    field: 'parentId',
    label: '上级菜单',
    component: 'TreeSelect',
    colProps: { span: 12 },
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'menuType',
    label: '菜单类型',
    required: true,
    component: 'RadioButtonGroup',
    colProps: { span: 24 },
    componentProps: {
      options: menuType,
    },
  },
  {
    field: 'url',
    label: '文件路径',
    component: 'Input',
    defaultValue: 'LAYOUT',
    required: true,
    colProps: {
      span: 24,
    },
  },
  {
    field: 'orderNum',
    label: '排序',
    suffix: '从小到大排序',
    component: 'InputNumber',
    required: true,
  },
  {
    field: 'addChild',
    label: '添加增删改查',
    labelWidth: 120,
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '是', value: '1' },
        { label: '否', value: '0' },
      ],
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'visible',
    label: '显示菜单',
    component: 'RadioButtonGroup',
    defaultValue: '1',
    componentProps: {
      options: [
        { label: '是', value: '1' },
        { label: '否', value: '0' },
      ],
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: '1',
    componentProps: {
      options: [
        { label: '启用', value: '1' },
        { label: '禁用', value: '0' },
      ],
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'remark',
    label: '备注',
    component: 'InputTextArea',
    colProps: { span: 20 },
  },
]
