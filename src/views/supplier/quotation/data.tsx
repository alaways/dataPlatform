import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { formatNumber } from '/@/utils/tool'

export const columns: BasicColumn[] = [
  {
    title: '供应商名称',
    dataIndex: 'supplierName',
  },
  {
    title: '机型',
    dataIndex: 'modelType',
    width: 120,
  },
  {
    title: '商品名称',
    dataIndex: 'spuName',
  },
  {
    title: '内存',
    dataIndex: 'spuMemory',
    width: 150,
  },
  {
    title: '颜色',
    dataIndex: 'spuColour',
    width: 150,
  },
  {
    title: '官网价格(元)',
    dataIndex: 'spuPrice',
    width: 120,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '报价(元)',
    dataIndex: 'spuQuote',
    width: 120,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
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
    field: 'modelType',
    label: '机型',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: [
        { label: '苹果', value: '苹果' },
        { label: '安卓', value: '安卓' },
      ],
    },
  },
  {
    field: 'spuName',
    label: '商品名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'createTime',
    label: '报价时间',
    component: 'RangePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
]
