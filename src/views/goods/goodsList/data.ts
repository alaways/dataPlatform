import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { formatNumber } from '/@/utils/tool'
import { Image, Switch } from 'ant-design-vue'
import { useMessage } from '/@/hooks/web/useMessage'
import { platform } from '../../order/utils'
import {
  lockStatusGoods,
  shelfStatusGoods,
  showStatusGoods,
  changeWeekRentType,
} from '/@/api/goods'
import { spuTypeList } from '../goodsBase/data'
import { usePermission } from '/@/hooks/web/usePermission'
import { getCategoryTree } from '/@/api/goods/category'
const { hasPermission } = usePermission()

const { createMessage } = useMessage()

export const columns: BasicColumn[] = [
  {
    title: '商品名称',
    dataIndex: 'name',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '图片',
    width: 50,
    dataIndex: 'pic',
    customRender: ({ text }) => h(Image, { src: text }),
  },
  {
    title: '分类',
    dataIndex: 'categoryName',
    width: 100,
  },
  {
    title: '品牌',
    dataIndex: 'brandName',
    width: 100,
  },
  {
    ifShow: hasPermission('GoodsSpuType'),
    title: '商品类目',
    dataIndex: 'spuType',
    width: 100,
    customRender: ({ text }) => {
      const find: any = spuTypeList.find((v) => v.value == text)
      return (find && find.label) || ''
    },
  },
  {
    title: '价格(元)',
    dataIndex: 'firstTotalAmount',
    width: 100,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '原周付商品业务',
    dataIndex: 'commBusiness',
    width: 140,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'commBusiness')) {
        record.commBusiness = false
      }
      return h(Switch, {
        checked: record.commBusiness === 1,
        checkedChildren: '是',
        unCheckedChildren: '否',
        loading: record.commBusinessLoading,
        onChange(checked: boolean) {
          record.commBusinessLoading = true
          const newStatus = checked ? 1 : 0
          changeWeekRentType({ id: record.id, status: newStatus })
            .then(() => {
              record.commBusiness = newStatus
              createMessage.success(`${record.commBusiness === 1 ? '是' : '否'}成功`)
            })
            .catch(() => {
              createMessage.error('锁定商品失败')
            })
            .finally(() => {
              record.commBusinessLoading = false
            })
        },
      })
    },
  },
  // {
  //   title: '官网价格(元)',
  //   dataIndex: 'price',
  //   width: 100,
  //   customRender: ({ text }) => formatNumber(text, 2) || '-',
  // },
  // {
  //   title: '可见范围',
  //   dataIndex: 'sourceFrom',
  //   width: 120,
  //   customRender: ({ text }) => {
  //     const find: any = platform.filter((v) => {
  //       return String(text).split(',').includes(String(v.value))
  //     })
  //     const render: any[] = []
  //     find.forEach((v, i) => {
  //       if (i == 0) {
  //         render.push(h('span', {}, v.label))
  //       } else {
  //         render.push(h('br'))
  //         render.push(h('span', {}, v.label))
  //       }
  //     })
  //     return h('div', {}, render)
  //   },
  // },
  {
    ifShow: hasPermission('GoodsListLock'),
    title: '锁定商品',
    dataIndex: 'ifLock',
    width: 100,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'ifLock')) {
        record.ifLock = false
      }
      return h(Switch, {
        checked: record.ifLock === 1,
        checkedChildren: '锁定',
        unCheckedChildren: '解锁',
        loading: record.lockLoding,
        onChange(checked: boolean) {
          record.lockLoding = true
          const newStatus = checked ? 1 : 0
          lockStatusGoods({ id: record.id, ifLock: newStatus })
            .then(() => {
              record.ifLock = newStatus
              createMessage.success(`${record.ifLock === 1 ? '锁定' : '解锁'}成功`)
            })
            .catch(() => {
              createMessage.error('锁定商品失败')
            })
            .finally(() => {
              record.lockLoding = false
            })
        },
      })
    },
  },
  {
    title: '显示状态',
    dataIndex: 'showFlag',
    width: 100,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'showFlag')) {
        record.showFlag = false
      }
      return h(Switch, {
        checked: record.showFlag === 1,
        checkedChildren: '显示',
        unCheckedChildren: '隐藏',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          // if (record.price <= 0 && checked) {
          //   createMessage.error(`请到修改属性中，填写官网价`)
          //   return
          // }
          record.pendingStatus = true
          const newStatus = checked ? 1 : 0
          showStatusGoods({ id: record.id, ...record, status: newStatus })
            .then(() => {
              record.showFlag = newStatus
              createMessage.success(record.showFlag === 1 ? `显示` : '隐藏')
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
    title: '上架状态',
    dataIndex: 'shelfStatus',
    width: 100,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'shelfStatus')) {
        record.shelfStatus = false
      }
      return h(Switch, {
        checked: record.shelfStatus === 1,
        checkedChildren: '已上架',
        unCheckedChildren: '已下架',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          // if (record.price <= 0 && checked) {
          //   createMessage.error(`请到修改属性中，填写官网价`)
          //   return
          // }
          record.pendingStatus = true
          const newStatus = checked ? 1 : 0
          shelfStatusGoods({ id: record.id, ...record, status: newStatus })
            .then(() => {
              record.shelfStatus = newStatus
              createMessage.success(record.shelfStatus === 1 ? `已上架` : '已下架')
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
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '商品名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'brandName',
    label: '品牌',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'categoryId',
    label: '分类',
    component: 'ApiTreeSelect',
    colProps: { span: 8 },
    componentProps: {
      // treeCheckable: true,
      showSearch: true,
      placeholder: '请选择',
      api: getCategoryTree,
      fieldNames: {
        label: 'name',
        value: 'id',
        key: 'id',
      },
    },
  },
  {
    field: 'sourceFrom',
    label: '可见范围',
    component: 'Select',
    componentProps: { options: platform },
    colProps: { span: 8 },
  },
  {
    field: 'showFlag',
    label: '显示状态',
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
      options: [
        { label: '显示', value: 1 },
        { label: '隐藏', value: 0 },
      ],
    },
    colProps: { span: 8 },
  },
  {
    field: 'shelfStatus',
    label: '上架状态',
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
      options: [
        { label: '已上架', value: 1 },
        { label: '已下架', value: 0 },
      ],
    },
    colProps: { span: 8 },
  },
  {
    ifShow: hasPermission('GoodsSpuType'),
    field: 'spuType',
    label: '商品类目',
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
      options: spuTypeList,
    },
    colProps: { span: 8 },
  },
]

/**
 * 商品二维码
 */
export const paidFormSchema: FormSchema[] = [
  {
    label: 'ID',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: 'rentType',
    field: 'rentType',
    component: 'Input',
    show: false,
  },
  {
    label: 'type',
    field: 'type',
    component: 'Input',
    show: false,
  },
  {
    label: '商家编号',
    field: 'merchantTerminalNo',
    component: 'Input',
    show: false,
  },
  {
    label: '商品名称: ',
    field: 'name',
    labelWidth: 100,
    component: 'Input',
    colProps: { span: 20 },
    slot: 'name',
  },
  {
    label: '生成小程序二维码',
    field: 'qrSelect',
    component: 'Select',
    required: true,
    colProps: { span: 20 },
  },
  {
    label: '商品二维码',
    field: 'qrCode',
    component: 'Input',
    render: () => h('div', {}, ''),
    colProps: { span: 6 },
  },
]
