import { h } from 'vue'
import { uploadApi } from '/@/api/sys/upload'
import { BasicColumn } from '/@/components/Table'
import { Image } from 'ant-design-vue'

/**
 * 规格
 */
export const specsColumns: BasicColumn[] = [
  {
    title: '商品ID',
    dataIndex: 'spuId',
    ifShow: false,
  },
  {
    title: '规格id', // 有的话传他
    dataIndex: 'id',
    ifShow: false,
  },
  {
    title: '随机生成的id', // 没有的话要使用它上传
    dataIndex: 'uniqueId',
    ifShow: false,
  },
  {
    title: '规格名',
    dataIndex: 'name',
    editComponent: 'Input',
    editRow: true,
    editRule: true,
  },
  {
    title: '规格值',
    dataIndex: 'value',
    editComponent: 'Input',
    editRow: true,
    editRule: true,
  },
  {
    title: '图片',
    dataIndex: 'pic',
    editRender: ({ record }) => h(Image, { src: record.pic, width: 50 }),
    editRow: true,
    editComponent: 'ImageUpload',
    editComponentProps: {
      api: uploadApi,
      accept: ['png', 'jpeg', 'jpg'],
      maxNumber: 1,
    },
  },
  {
    title: '排序',
    dataIndex: 'sort',
    editRow: true,
    editRule: true,
    editComponent: 'InputNumber',
    editComponentProps: {
      step: 1,
      min: 0,
      formatter: (value) => parseInt(value),
      parser: (value) => parseInt(value),
    },
  },
]
export const specsEditRow = {
  name: '',
  value: '',
  pic: '',
  sort: '',
}
/**
 * 宣传属性
 */
export const publicizeColumns: BasicColumn[] = [
  {
    title: '宣传类型',
    dataIndex: 'name',
    editRow: true,
    editRule: true,
  },
  {
    title: '宣传值',
    dataIndex: 'value',
    editRow: true,
    editRule: true,
  },
]
export const publicizeEditRow = {
  name: '',
  img: '',
}
/**
 * 商品属性
 */
export const goodsColumns: BasicColumn[] = [
  {
    title: '属性名',
    dataIndex: 'name',
    editRow: true,
    editRule: true,
  },
  {
    title: '属性值',
    dataIndex: 'value',
    editRow: true,
    editRule: true,
  },
]

export const goodsEditRow = {
  name: '',
  img: '',
}
/**
 * 发货属性
 */
export const deliveryColumns: BasicColumn[] = [
  {
    title: '属性名',
    dataIndex: 'name',
    editRow: true,
    editRule: true,
  },
  {
    title: '属性值',
    dataIndex: 'value',
    editRow: true,
    editRule: true,
  },
]
export const deliveryEditRow = {
  name: '',
  img: '',
}

/**
 * 整合参数
 */
export const columnsType = {
  商品规格: {
    columns: specsColumns,
    editRow: specsEditRow,
  },
  宣传属性: {
    columns: publicizeColumns,
    editRow: publicizeEditRow,
  },
  商品属性: {
    columns: goodsColumns,
    editRow: goodsEditRow,
  },
  发货属性: {
    columns: deliveryColumns,
    editRow: deliveryEditRow,
  },
}
