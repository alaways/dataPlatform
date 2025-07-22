import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
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
    title: '门店名称',
    dataIndex: 'name',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '所属地区',
    dataIndex: 'province',
    customRender: ({ record }) => {
      return record.province ? `${record.province || ''} ${record.city || ''}` : '-'
    },
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '门店名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  // {
  //   field: 'ipCitys',
  //   label: '地区',
  //   component: 'TreeSelect',
  //   colProps: { span: 6 },
  //   componentProps: () => {
  //     return {
  //       treeNodeFilterProp: 'label',
  //       treeData: cityData2,
  //       treeCheckable: true,
  //       allowClear: true,
  //       showSearch: true,
  //     }
  //   },
  // },
]

export const modalFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'name',
    label: '门店名称',
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
]
