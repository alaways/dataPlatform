import { Tag } from 'ant-design-vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { h } from 'vue'

const statusList = [
  { label: '生效', value: 1 },
  { label: '失效', value: 0 },
]

export const columns: BasicColumn[] = [
  {
    title: '供应商编号',
    dataIndex: 'supplierNo',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '供应商名称',
    dataIndex: 'supplierName',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '法人姓名',
    dataIndex: 'legalPerson',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '营业执照编号',
    dataIndex: 'licenseNo',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({ text }) => {
      const color = text ? 'green' : 'red'
      const txt = text ? '生效' : '失效'
      return h(Tag, { color }, txt)
    },
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'supplierName',
    label: '供应商名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: statusList,
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
    field: 'supplierNo',
    label: '供应商编号',
    component: 'Input',
    show: false,
  },
  {
    field: 'supplierName',
    label: '供应商名称',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    field: 'legalPerson',
    label: '法人姓名',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    field: 'licenseNo',
    label: '营业执照编号',
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
      options: statusList,
    },
  },
  {
    field: 'sort',
    label: '排序',
    component: 'InputNumber',
    required: true,
    suffix: '注: 从小到大排序',
    colProps: { span: 20 },
  },
  {
    field: 'remark',
    label: '备注',
    component: 'InputTextArea',
    colProps: { span: 20 },
  },
]
