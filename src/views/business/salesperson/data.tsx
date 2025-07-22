import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { Switch } from 'ant-design-vue'
import { useMessage } from '/@/hooks/web/useMessage'
import { getSalespersonStoreList, updateSalespersonItem } from '/@/api/business/salesperson'
import { cityArray } from '/@/utils/cityData'
import { cloneDeep } from 'lodash-es'
import { cityCoding } from '/@/utils/cityData2'

const cityData2 = cloneDeep(cityCoding)
cityData2.forEach((v) => {
  v.children = v.children.map((c) => {
    return {
      ...c,
      children: [],
    }
  })
})

const cityDatas = cloneDeep(cityArray)
cityDatas.forEach((v) => {
  v.children = v.children.map((c) => {
    return {
      ...c,
      children: [],
    }
  })
})

export const columns: BasicColumn[] = [
  {
    title: '业务员',
    dataIndex: 'name',
    align: 'left',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '所属地区',
    dataIndex: 'province',
    customRender: ({ record }) => {
      return record.province ? `${record.province || ''} ${record.city || ''}` : '-'
    },
  },
  // {
  //   title: '归属商家平台',
  //   dataIndex: 'merchantAccountCode',
  //   customRender: ({ text, record }) => {
  //     return (
  //       <>
  //         <div>{record.merchantAccountName}</div>
  //         <div>{text}</div>
  //       </>
  //     )
  //   },
  // },
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
        checked: record.status === 1,
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true
          const newStatus = checked ? 1 : 0
          const { createMessage } = useMessage()
          updateSalespersonItem({ id: record.id, status: newStatus })
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
  // {
  //   field: 'parentName',
  //   label: '父级业务员',
  //   component: 'Input',
  //   colProps: { span: 6 },
  // },
  {
    field: 'name',
    label: '业务员',
    component: 'Input',
    colProps: { span: 6 },
  },
  // {
  //   field: 'parentId',
  //   label: '上级业务员',
  //   colProps: { span: 6 },
  //   component: 'ApiSelect',
  //   componentProps: {
  //     showSearch: true,
  //     placeholder: '请选择',
  //     api: getSalespersonStoreList,
  //     params: { pageSize: 999999, cursor: 999999 },
  //     resultField: 'list',
  //     labelField: 'name',
  //     valueField: 'id',
  //   },
  // },
  {
    field: 'ipCitys',
    label: '地区',
    component: 'TreeSelect',
    colProps: { span: 6 },
    componentProps: () => {
      return {
        treeNodeFilterProp: 'label',
        treeData: cityData2,
        treeCheckable: true,
        allowClear: true,
        showSearch: true,
      }
    },
  },
]

export const modalFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'isAdmin',
    label: '是否是管理员',
    component: 'Input',
    show: false,
  },
  {
    field: 'parentId',
    label: '上级业务员',
    colProps: { span: 20 },
    component: 'ApiSelect',
    componentProps: {
      showSearch: true,
      placeholder: '请选择',
      api: getSalespersonStoreList,
      params: { pageSize: 999999, cursor: 999999, ignoreChild: 1 },
      resultField: 'list',
      labelField: 'name',
      valueField: 'id',
    },
  },
  {
    field: 'name',
    label: '业务员',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    label: '所属地区',
    field: 'city',
    component: 'Cascader',
    colProps: { span: 20 },
    componentProps: {
      options: cityDatas,
      showSearch: true,
    },
  },
  // {
  //   ifShow: ({ values }) => values.isAdmin,
  //   field: 'merchantAccountCode',
  //   label: '归属商家平台',
  //   component: 'Select',
  //   colProps: { span: 20 },
  // },
  {
    field: 'status',
    label: '状态',
    component: 'RadioGroup',
    colProps: { span: 20 },
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
  },
]

export const batchModalFormSchema: FormSchema[] = [
  {
    field: 'isAdmin',
    label: '是否是管理员',
    component: 'Input',
    show: false,
  },
  {
    field: 'parentId',
    label: '上级业务员',
    colProps: { span: 20 },
    required: true,
    component: 'ApiSelect',
    componentProps: {
      showSearch: true,
      placeholder: '请选择',
      api: getSalespersonStoreList,
      params: { pageSize: 999999, cursor: 999999, ignoreChild: 1 },
      resultField: 'list',
      labelField: 'name',
      valueField: 'id',
    },
  },
  {
    field: 'id',
    label: '业务员',
    required: true,
    colProps: { span: 20 },
    component: 'ApiSelect',
    componentProps: {
      showSearch: true,
      mode: 'multiple',
      placeholder: '请选择',
      api: getSalespersonStoreList,
      params: { pageSize: 999999, cursor: 999999 },
      resultField: 'list',
      labelField: 'name',
      valueField: 'id',
    },
  },
]
