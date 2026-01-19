import { cloneDeep } from 'lodash-es'
import { FormSchema } from '/@/components/Form'
import { goodTypeList } from '/@/views/goods/goodsLeaseMore/components/utils'
function getGoodsLeaseOptions() {
  const goodsLeaseOptions: any = cloneDeep(goodTypeList)
  goodsLeaseOptions.unshift({ label: '全部', value: '' })
  return goodsLeaseOptions
}

export const searchFormSchema: FormSchema[] = [
  {
    field: 'spuType',
    label: '品类',
    component: 'Select',
    labelWidth: 50,
    defaultValue: '',
    colProps: { span: 6 },
    componentProps: {
      allowClear: false,
      options: [
        { label: '全部', value: '' },
        { label: '手机', value: 1 },
        { label: '电动车', value: 2 },
      ],
    },
  },
  {
    field: 'rentType',
    label: '租赁类型',
    component: 'Select',
    defaultValue: 2,
    colProps: { span: 6 },
    componentProps: {
      allowClear: false,
      options: [
        { label: '全部', value: '' },
        { label: '月付', value: 2 },
        { label: '周付', value: 1 },
      ],
    },
  },
  {
    field: 'goodsLeaseType',
    label: '租赁业务',
    component: 'Select',
    defaultValue: '',
    colProps: { span: 6 },
    componentProps: {
      allowClear: false,
      options: getGoodsLeaseOptions(),
    },
  },
]
