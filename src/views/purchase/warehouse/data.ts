import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { cityArray } from '/@/utils/cityData'

export const columns: BasicColumn[] = [
  {
    title: '供应商名称',
    dataIndex: 'supplierName',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '寄件人',
    dataIndex: 'name',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '地址',
    dataIndex: 'provinceName',
    customRender: ({ record }) => {
      return record.provinceName
        ? `${record.provinceName || ''}${record.cityName || ''}${record.boroughName || ''}${
            record.address || ''
          }`
        : '-'
    },
  },
  {
    title: '物流公司',
    dataIndex: 'logisticsName',
    customRender: ({ text }) => text || '-',
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'supplierName',
    label: '供应商名称',
    component: 'Input',
    colProps: { span: 6 },
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
    field: 'name',
    label: '寄件人',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    field: 'phone',
    label: '联系电话',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    label: '地址',
    field: 'city',
    required: true,
    colProps: { span: 20 },
    component: 'Cascader',
    componentProps: { options: cityArray },
  },
  {
    field: 'address',
    label: '详细地址',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    field: 'deviceSn',
    label: '打印设备编号',
    component: 'Input',
    colProps: { span: 20 },
  },
  {
    show: false,
    field: 'logisticsCode',
    label: '物流公司编码',
    defaultValue: 'SF',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
    componentProps: { disabled: true },
  },
  {
    field: 'logisticsName',
    label: '物流公司',
    defaultValue: '顺丰速运',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
    componentProps: { disabled: true },
  },
  {
    field: 'payCardNo',
    label: '月结卡号',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    field: 'sort',
    label: '排序',
    component: 'InputNumber',
    required: true,
    suffix: '注: 从小到大排序',
    colProps: { span: 20 },
  },
]
