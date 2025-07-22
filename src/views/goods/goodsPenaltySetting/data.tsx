import { cloneDeep } from 'lodash-es'
import { rentTypeList } from '../goodsLeaseMore/components/utils'
import { BasicColumn } from '/@/components/Table'

const rentList = cloneDeep(rentTypeList).map((v) => {
  if (v.value == 3) {
    v.value = 2
  }
  return v
})

export const columns: BasicColumn[] = [
  {
    title: '租赁类型',
    dataIndex: 'rentType',
    editComponent: 'Select',
    editComponentProps: {
      options: rentList,
      placeholder: '请选择',
    },
    editRow: true,
    editRule: true,
  },
  {
    title: '罚息设置(单位%)',
    dataIndex: 'penaltyRate',
    editComponent: 'InputNumber',
    editRow: true,
    editRule: true,
  },
]
