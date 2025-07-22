import { Switch } from 'ant-design-vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { h } from 'vue'
import { formatNumber } from '/@/utils/tool'
import { useMessage } from '/@/hooks/web/useMessage'
import { updateAreaItem } from '/@/api/calculator/area'
import { cityCoding } from '/@/utils/cityData2'

export const columns: BasicColumn[] = [
  {
    title: '地区编号',
    dataIndex: 'regionId',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '地区名称',
    dataIndex: 'regionName',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '开发租赁方式',
    dataIndex: 'rentType',
    width: 120,
    customRender: ({ text }) => (text == 1 ? '垫资模式' : '首付模式'),
  },
  {
    title: '利率(%)',
    dataIndex: 'interestRate',
    width: 120,
    customRender: ({ text, record }) => {
      if (record.rentType == 1) {
        return formatNumber(text || 0, 2)
      } else {
        return '-'
      }
    },
  },

  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'status')) {
        record.status = false
      }
      return h(Switch, {
        checked: record.status === 0,
        checkedChildren: '启用',
        unCheckedChildren: '禁用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true
          const newStatus = checked ? 0 : 1
          const { createMessage } = useMessage()
          updateAreaItem({ id: record.id, ...record, status: newStatus })
            .then(() => {
              record.status = newStatus
              createMessage.success(record.status === 0 ? `启用` : '禁用')
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
    width: 180,
    dataIndex: 'createTime',
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
    field: 'additionalData',
    label: '自定义JSON',
    component: 'Input',
    show: false,
  },
  {
    field: 'regionParentId',
    label: '父id',
    component: 'Input',
    show: false,
  },
  {
    field: 'regionName',
    label: '地区名称',
    component: 'Input',
    colProps: { span: 19 },
    show: false,
  },
  {
    field: 'regionTree',
    label: '地区树状',
    component: 'Input',
    colProps: { span: 19 },
    show: false,
  },
  {
    field: 'regionId',
    label: '地区名称',
    required: true,
    component: 'Cascader',
    colProps: { span: 20 },
    componentProps: ({ formModel }) => {
      return {
        changeOnSelect: true,
        options: cityCoding,
        onChange: (e: any, v: any) => {
          if (v && v.length) {
            const len = v.length
            formModel.regionName = v[len - 1].label
            formModel.regionParentId = v[len - 2]?.value || 0
            formModel.regionTree = e.join('/')
            console.log(formModel)
          }
        },
      }
    },
  },
  {
    field: 'rentType',
    label: '开放租赁方式',
    component: 'RadioGroup',
    colProps: { span: 20 },
    required: true,
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '首付模式', value: 2 },
        { label: '垫资模式', value: 1 },
      ],
    },
  },
  {
    show: ({ values }) => values.rentType == 1,
    field: 'interestRate',
    label: '利率',
    required: true,
    component: 'InputNumber',
    colProps: { span: 19 },
    componentProps: {
      addonAfter: '%',
    },
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioGroup',
    colProps: { span: 20 },
    required: true,
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '正常', value: 0 },
        { label: '禁用', value: 1 },
      ],
    },
  },
  {
    show: ({ values }) => values.rentType == 2,
    field: 'headInterestList',
    labelWidth: 0,
    label: '',
    component: 'Input',
    slot: 'headInterestList',
    colProps: { span: 24 },
  },
]
