import { BasicColumn, FormSchema } from '@/components/Table'
import { h } from 'vue'
import { Switch } from 'ant-design-vue'
import { getDeptList, updateDeptItem } from '/@/api/system/dept'
import { useMessage } from '/@/hooks/web/useMessage'
import { getUserList } from '/@/api/system/account'

export const columns: BasicColumn[] = [
  {
    title: '部门名称',
    dataIndex: 'deptName',
    align: 'left',
  },
  {
    title: '负责人',
    dataIndex: 'leader',
    width: 120,
  },
  {
    title: '排序',
    dataIndex: 'orderNum',
    width: 80,
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
          updateDeptItem({ ...record, status: newStatus })
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
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'deptName',
    label: '部门名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '停用', value: '1' },
      ],
    },
    colProps: { span: 8 },
  },
]

export const formSchema: FormSchema[] = [
  {
    show: false,
    field: 'deptId',
    label: '部门名称',
    component: 'Input',
  },
  {
    field: 'parentId',
    label: '上级部门',
    component: 'ApiTreeSelect',
    colProps: { span: 20 },
    componentProps: {
      placeholder: '请选择部门',
      api: getDeptList,
      fieldNames: {
        label: 'deptName',
        value: 'deptId',
        key: 'deptId',
      },
    },
  },
  {
    field: 'deptName',
    label: '部门名称',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    show: false,
    field: 'leader',
    label: '负责人名称',
    component: 'Input',
  },
  {
    field: 'leaderUid',
    label: '负责人',
    component: 'ApiSelect',
    colProps: { span: 20 },
    required: true,
    componentProps: ({ formModel }) => {
      return {
        showSearch: true,
        placeholder: '请选择跟进人',
        api: getUserList,
        params: { limit: 999999, status: '1' },
        resultField: 'list',
        labelField: 'userName',
        valueField: 'uid',
        onChange: (e, v) => {
          console.log(e)
          formModel.leader = v.label
        },
      }
    },
  },
  {
    field: 'orderNum',
    label: '排序',
    component: 'InputNumber',
    required: true,
    colProps: { span: 20 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: '1',
    componentProps: {
      options: [
        { label: '启用', value: '1' },
        { label: '停用', value: '0' },
      ],
    },
    required: true,
  },
]
