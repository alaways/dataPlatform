import { h } from 'vue'
import { FormSchema } from '/@/components/Table'
import { formatNumber, handleCurrentoDays } from '/@/utils/tool'
import { rentTypeList } from '../../goods/goodsLease/utils'
import { getUserList } from '/@/api/system/account'
import { usePermission } from '/@/hooks/web/usePermission'
import { spuTypeList } from '../../goods/goodsBase/data'
import { getSalespersonStoreList } from '/@/api/business/salesperson'
import { cloneDeep } from 'lodash-es'
import { cityCoding } from '/@/utils/cityData2'
import { Tag } from 'ant-design-vue'
import { getTextArr } from '/@/utils'
const { hasPermission } = usePermission()
import { dataList } from '/@/views/collection/remit/data'
const repayDateDefultValue = handleCurrentoDays(0)

const cityDatas = cloneDeep(cityCoding)
cityDatas.forEach((v) => {
  v.children = v.children.map((c) => {
    return {
      ...c,
      children: [],
    }
  })
})
const orderStatus = {
  订单编号: hasPermission('soonRow_orderSn'),
  签约时间: hasPermission('soonRow_signTime'),
}
const userStatus = {
  姓名: hasPermission('soonRow_nickName'),
  手机号: hasPermission('soonRow_phone'),
}
export const columns = () => {
  const oinfo = getTextArr(orderStatus)
  const uinfo = getTextArr(userStatus)
  return [
    {
      title: oinfo,
      ifShow: orderStatus['订单编号'] || orderStatus[' 签约时间'],
      dataIndex: 'orderSn',
      width: 180,
      customRender: ({ record }) => {
        const signTime = orderStatus['签约时间'] ? record.signTime || '-' : ''
        const orderSn = orderStatus['订单编号'] ? record.orderSn || '-' : ''
        return h('div', { textAlign: 'center' }, [
          h('span', {}, orderSn),
          h('br'),
          h('span', {}, signTime),
        ])
      },
    },
    {
      title: '业务端',
      dataIndex: 'dataSources',
      width: 150,
      customRender: ({ record }) => {
        const find = dataList.find((item: any) => item.value == record.dataSources)
        if (find) return find?.label
      },
    },
    {
      title: '商品类目',
      dataIndex: 'spuType',
      ifShow: hasPermission('soonRow_spuType'),
      width: 100,
      customRender: ({ text }) => {
        const find: any = spuTypeList?.find((v) => v.value == text)
        return find?.label || '-'
      },
    },
    {
      title: '租赁类型',
      dataIndex: 'rentType',
      ifShow: hasPermission('soonRow_rentType'),
      width: 100,
      customRender: ({ text }) => {
        if (text == 2) {
          return '月付'
        }
        const find = rentTypeList?.find((v) => v.value == text)
        return find?.label
      },
    },
    {
      title: '地区',
      dataIndex: 'ipProvince',
      ifShow: hasPermission('soonRow_ipProvince'),
      width: 120,
      customRender: ({ record }) => {
        return record.province ? `${record.province || ''}${record.city || ''}` : '-'
      },
    },
    {
      title: '业务员',
      dataIndex: 'salesperson',
      ifShow: hasPermission('soonRow_salesperson'),
      width: 120,
      customRender: ({ text, record }) => {
        return (
          <>
            <div>{text}</div>
            <Tag color="#f2cf98" style={{ display: record.salesmanGuarantee ? 'block' : 'none' }}>
              业务员担保
            </Tag>
          </>
        )
      },
    },
    {
      title: uinfo,
      ifShow: userStatus['姓名'] || userStatus['手机号'],
      width: 130,
      customRender: ({ record }) => {
        const nickName = userStatus['姓名'] ? `${record.nickName || '-'}` : ''
        const phone = userStatus['手机号'] ? record.phone || '-' : ''
        return h('div', { textAlign: 'center' }, [
          h('span', {}, nickName),
          h('br'),
          h('span', {}, phone),
        ])
      },
    },
    {
      title: '过往逾期数',
      dataIndex: 'overdueCount',
      ifShow: hasPermission('soonRow_overdueCount'),
      width: 120,
    },
    {
      title: '到期还款期数',
      dataIndex: 'periodNo',
      ifShow: hasPermission('soonRow_periodNo'),
      width: 120,
    },
    {
      title: '最新到期日期',
      dataIndex: 'repayDate',
      ifShow: hasPermission('soonRow_repayDate'),
      width: 120,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '到期应还金额(元)',
      dataIndex: 'repayAmount',
      ifShow: hasPermission('soonRow_repayAmount'),
      width: 130,
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      ifShow: hasPermission('OrdeSoonFollowBy'),
      title: '跟进人',
      dataIndex: 'followByName',
      width: 100,
      customRender: ({ text }) => text || '-',
      fixed: 'right',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ifShow: hasPermission('soonRow_remark'),
    },
  ]
}

export const searchFormSchema: FormSchema[] = [
  {
    field: 'orderSn',
    label: '订单编号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'nickName',
    label: '姓名',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'overdueCount',
    label: '逾期期数',
    component: 'Input',
    colProps: { span: 6 },
  },
  // {
  //   field: 'dayType',
  //   label: '最新到期日',
  //   component: 'Select',
  //   colProps: { span: 6 },
  //   componentProps: {
  //     options: [
  //       { label: '昨日', value: 3 },
  //       { label: '今天', value: 1 },
  //       { label: '明天', value: 2 },
  //     ],
  //   },
  // },
  {
    field: 'spuType',
    label: '商品类目',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: spuTypeList,
    },
  },
  {
    field: 'rentTypeList',
    label: '租赁类型',
    component: 'Select',
    componentProps: { options: rentTypeList },
    colProps: { span: 6 },
  },
  {
    ifShow: hasPermission('OrdeSoonFollowBy'),
    field: 'followBy',
    label: '跟进人',
    colProps: { span: 6 },
    component: 'ApiSelect',
    componentProps: {
      showSearch: true,
      placeholder: '请选择跟进人',
      api: getUserList,
      params: { limit: 999999, status: '1' },
      resultField: 'list',
      labelField: 'userName',
      valueField: 'uid',
    },
  },
  {
    field: 'salesperson',
    label: '业务员',
    component: 'Input',
    colProps: { span: 6 },
  },
  // {
  //   ifShow: hasPermission('OrdeSoonSalesperson'),
  //   label: '业务员',
  //   field: 'salespersonId',
  //   component: 'ApiSelect',
  //   colProps: { span: 6 },
  //   componentProps: {
  //     showSearch: true,
  //     placeholder: '请选择',
  //     api: getSalespersonStoreList,
  //     params: { pageSize: 999999, cursor: 999999 },
  //     resultField: 'list',
  //     labelField: 'name',
  //     valueField: 'id',
  //   },
  // },
  {
    field: 'city',
    label: '地区',
    component: 'TreeSelect',
    colProps: { span: 6 },
    componentProps: () => {
      return {
        treeNodeFilterProp: 'label',
        treeData: cityDatas,
        treeCheckable: true,
        allowClear: true,
        showSearch: true,
      }
    },
  },
  {
    field: 'repayDate',
    label: '到期时间',
    component: 'RangePicker',
    defaultValue: repayDateDefultValue,
    componentProps: {
      value: repayDateDefultValue,
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
  // {
  //   field: 'dataSources',
  //   label: '业务数据',
  //   component: 'Select',
  //   defaultValue: 'xx',
  //   componentProps: {
  //     options: dataList,
  //   },
  //   colProps: { span: 8 },
  // },
]
