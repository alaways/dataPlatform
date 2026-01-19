const yewuOptionList = [
  { label: '全部', value: 'all' },
  { label: '周付', value: '1' },
  { label: '线下月付', value: '2' },
  { label: '地区月付', value: '4' },
]
const typeList = [
  { label: '全部', value: 'all' },
  { label: '手机', value: '1' },
  { label: '电动车', value: '2' },
]
export const searchFormSchema = [
  {
    field: 'rentType',
    label: '业务数据',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: yewuOptionList,
    },
  },
  {
    field: 'spuType',
    label: '品类',
    component: 'Select',
    componentProps: { options: typeList },
    colProps: { span: 6 },
  },
]
export const searchFormSchema1 = [
  {
    field: 'rentType',
    label: '业务数据',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: yewuOptionList,
    },
  },
  {
    field: 'spuType',
    label: '品类',
    component: 'Select',
    componentProps: { options: typeList },
    colProps: { span: 6 },
  },
]

