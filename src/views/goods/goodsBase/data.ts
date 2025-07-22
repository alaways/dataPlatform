import { h } from 'vue'
import { FormSchema } from '/@/components/Form'
import {
  formatDecimal,
  handleImgAfter,
  handleImgUploadFormat,
  imgUploadFormat,
} from '/@/utils/tool'
import { Tinymce } from '/@/components/Tinymce'
import { uploadApi } from '/@/api/sys/upload'
import { platform } from '../../order/utils'
/**
 * 处理不是金额字段
 * 逾期罚金,可预付期数,分期间隔,总租期,租赁类型
 */
const filterate = ['showPrice', 'price']
/**
 * 处理金额
 * @param data 对象
 * @param multiplication 是否是乘法
 */
export function handlenAmount(data: any, multiplication: boolean) {
  Object.keys(data).forEach((e) => {
    if (!filterate.includes(e)) return
    if (typeof data[e] != 'number') return
    if (multiplication) {
      data[e] = (data[e] * 100).toFixed(0)
    } else {
      data[e] = data[e] / 100
    }
  })
  return data
}

// 递归处理 分类 结构
export function handleCategory(data, findId = -1) {
  const pdata = {
    id: [],
    isFind: false,
  }
  const list = data.map((v) => {
    const ids = [v.id] // 首次循环都创建新的对象
    v.children = categoryRecursion(v.children, ids, findId, pdata)
    return {
      label: v.name,
      value: v.id,
      children: v.children,
    }
  })

  return {
    ...pdata,
    list,
  }
}

/**
 * 递归分类
 * @param data 递归数组
 * @param ids 存的ids
 * @param findId 要查找的id
 * @param pdata 用对象存起找到的值
 */
function categoryRecursion(data, ids, findId, pdata) {
  return data.map((v) => {
    if (!pdata.isFind) {
      ids.push(v.id)
    }
    if (findId == v.id) {
      pdata.isFind = true
      pdata.id = ids
    }
    return {
      label: v.name,
      value: v.id,
      children: categoryRecursion(v.children, ids, findId, pdata),
    }
  })
}

const colProps1 = { xs: 20, ms: 20, md: 20, lg: 20, xl: 8, xxl: 8 }
const colProps2 = { xs: 20, ms: 20, md: 20, lg: 20, xl: 12, xxl: 12 }

export const spuTypeList = [
  { label: '手机', value: 1 },
  { label: '电动车', value: 2 },
]

export const schemas: FormSchema[] = [
  {
    label: '商品类目',
    field: 'spuType',
    component: 'RadioGroup',
    colProps: { span: 24 },
    required: true,
    componentProps: {
      options: spuTypeList,
    },
  },
  {
    label: '商品名称',
    field: 'name',
    component: 'Input',
    required: true,
    colProps: { span: 19 },
  },
  {
    label: '分类',
    field: 'categoryId',
    component: 'Cascader',
    required: true,
    colProps: colProps1,
  },
  {
    label: '分类名称',
    field: 'categoryName',
    component: 'Input',
    colProps: { span: 19 },
    show: false,
  },
  {
    label: '品牌',
    field: 'brandId',
    component: 'Select',
    colProps: colProps1,
    required: true,
  },
  {
    label: '品牌名称',
    field: 'brandName',
    component: 'Select',
    colProps: { span: 8 },
    show: false,
  },
  {
    label: '主图',
    field: 'pic',
    component: 'ImageUpload',
    colProps: { span: 24 },
    required: true,
    componentProps: ({ formModel }) => {
      return {
        api: uploadApi,
        afterFetch: (data) => handleImgAfter(data),
        onChange: (e: imgUploadFormat[]) => {
          formModel.pic = handleImgUploadFormat(e).join(',')
        },
        accept: ['png', 'jpeg', 'jpg'],
        maxNumber: 1,
      }
    },
  },
  {
    label: '图集',
    field: 'albums',
    colProps: { span: 24 },
    required: true,
    component: 'ImageUpload',
    componentProps: ({ formModel }) => {
      return {
        api: uploadApi,
        afterFetch: (data) => handleImgAfter(data),
        onChange: (e: imgUploadFormat[]) => {
          formModel.albums = handleImgUploadFormat(e)
        },
        accept: ['png', 'jpeg', 'jpg'],
      }
    },
  },
  {
    label: '是否全新机',
    field: 'ifNew',
    component: 'Switch',
    defaultValue: 0,
    colProps: colProps1,
    required: true,
    componentProps: {
      checkedChildren: '是',
      unCheckedChildren: '否',
      checkedValue: 1,
      unCheckedValue: 0,
    },
  },
  {
    label: '是否手机',
    field: 'ifSupervise',
    component: 'Switch',
    defaultValue: 0,
    colProps: colProps1,
    required: true,
    componentProps: {
      checkedChildren: '是',
      unCheckedChildren: '否',
      checkedValue: 1,
      unCheckedValue: 0,
    },
  },
  {
    show: false,
    label: '可见范围',
    field: 'showRange',
    component: 'CheckboxGroup',
    colProps: { span: 24 },
    // required: true,
    componentProps: {
      options: platform,
    },
  },
  {
    label: '官网价格',
    field: 'price',
    component: 'InputNumber',
    defaultValue: 0,
    required: true,
    colProps: colProps2,
    componentProps: {
      step: 0.01,
      min: 0,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonBefore: '￥',
      addonAfter: '元',
    },
  },
  {
    show: false,
    label: '显示价格',
    field: 'showPrice',
    component: 'InputNumber',
    defaultValue: 0,
    colProps: colProps2,
    componentProps: {
      step: 0.01,
      min: 0,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonBefore: '￥',
      addonAfter: '元',
    },
  },
  {
    show: false,
    label: '排序',
    field: 'sort',
    component: 'InputNumber',
    defaultValue: 0,
    colProps: colProps2,
  },
  {
    label: '商品规格',
    field: 'specsList',
    component: 'Input',
    slot: 'specs',
    colProps: { span: 24 },
  },
  {
    label: '商品详情',
    field: 'introduce',
    component: 'Input',
    colProps: { span: 24 },
    render: ({ model, field }) => {
      return h(Tinymce, {
        value: model[field],
        onChange: (value: string) => {
          model[field] = value
        },
      })
    },
  },
  {
    // 宣传属性
    label: '',
    field: 'advertiseAttributeList',
    component: 'Input',
    slot: 'advertiseAttribute',
    colProps: colProps2,
  },
  {
    // 商品属性
    label: ' ',
    labelWidth: '30',
    field: 'spuAttributeList',
    component: 'Input',
    slot: 'spuAttribute',
    colProps: colProps2,
  },
  {
    // 发货属性
    label: '',
    field: 'deliveryAttributeList',
    component: 'Input',
    slot: 'deliveryAttribute',
    colProps: colProps2,
  },
]
