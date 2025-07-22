import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { Switch } from 'ant-design-vue'
import { useMessage } from '/@/hooks/web/useMessage'
import { updateUserItem } from '/@/api/system/account'
import { getRoleList } from '/@/api/system/role'
import { getDeptList } from '/@/api/system/dept'
import { getPostList } from '/@/api/system/post'
import { useUserStore } from '/@/store/modules/user'
// import { getAppList } from '/@/api/saas/app'
// import { getProductList } from '/@/api/saas/product'
import { getSalespersonStoreList } from '/@/api/business/salesperson'
export const columns: BasicColumn[] = [
  {
    title: '登录名',
    dataIndex: 'loginName',
    width: 130,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '员工名称',
    dataIndex: 'userName',
    width: 120,
    customRender: ({ text }) => text || '-',
  },
  // {
  //   title: '头像',
  //   dataIndex: 'avatar',
  //   width: 80,
  //   customRender: ({ text }) => h(Avatar, { src: text }),
  // },
  // {
  //   title: '手机号',
  //   dataIndex: 'phone',
  //   width: 120,
  //   customRender: ({ text }) => text || '-',
  // },
  // {
  //   title: '邮箱',
  //   dataIndex: 'email',
  //   width: 120,
  //   customRender: ({ text }) => text || '-',
  // },
  {
    title: '角色',
    dataIndex: 'roleValue',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '所属部门',
    dataIndex: 'deptValue',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    fiexd: 'rignt',
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'status')) {
        record.status = false
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
          const loginName = useUserStore().getUserInfo.loginName
          if (loginName == record.loginName) {
            record.pendingStatus = false
            createMessage.error('无法禁用当前登录的账户')
            return
          }
          updateUserItem({ id: record.id, ...record, status: newStatus })
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
  // {
  //   title: '备注',
  //   dataIndex: 'remark',
  //   customRender: ({ text }) => text || '-',
  // },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
    customRender: ({ text }) => text || '-',
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'userName',
    label: '员工名称',
    component: 'Input',
    colProps: { span: 6 },
  },
]

export const accountFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'uid',
    label: 'UID',
    component: 'Input',
    show: false,
  },
  {
    field: 'loginName',
    label: '登录名',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    ifShow: ({ values }) => !values.id,
    field: 'password',
    label: '登录密码',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    field: 'userName',
    label: '员工名称',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    field: 'roleId',
    label: '角色',
    required: true,
    component: 'ApiSelect',
    colProps: { span: 20 },
    componentProps: {
      mode: 'multiple',
      showSearch: true,
      placeholder: '请选择角色',
      api: getRoleList,
      params: { limit: 999999, status: '1' },
      resultField: 'list',
      labelField: 'roleName',
      valueField: 'roleId',
    },
  },
  {
    field: 'deptId',
    label: '部门',
    component: 'ApiTreeSelect',
    colProps: { span: 20 },
    componentProps: {
      // treeCheckable: true,
      showSearch: true,
      placeholder: '请选择部门',
      api: getDeptList,
      params: { status: '1' },
      fieldNames: {
        label: 'deptName',
        value: 'deptId',
        key: 'deptId',
      },
    },
  },
  {
    field: 'status',
    label: '状态',
    required: true,
    component: 'RadioGroup',
    defaultValue: '1',
    colProps: { span: 20 },
    componentProps: {
      options: [
        { label: '启用', value: '1' },
        { label: '禁用', value: '0' },
      ],
    },
  },
]

export const passwordFormSchema: FormSchema[] = [
  {
    show: false,
    label: '登录名',
    field: 'loginName',
    component: 'Input',
  },
  {
    label: '登录密码',
    field: 'password',
    component: 'InputPassword',
    required: true,
  },
]
