import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { handleMonth } from '/@/utils/order'
import { getAppList } from '/@/api/saas/app'

export const columns: BasicColumn[] = [
  {
    title: '创建时间',
    dataIndex: '创建时间',
    width: 150,
  },
  {
    title: 'fpd1%',
    width: 130,
    dataIndex: 'farg1%',
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: 'fpd3%',
    dataIndex: 'farg3%',
    width: 140,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: 'fpd7%',
    dataIndex: 'farg7%',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: 'fpd15%',
    dataIndex: 'farg15%',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: 'fpd30%',
    dataIndex: 'farg30%',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'time',
    label: '创建时间',
    defaultValue: handleMonth(),
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
  {
    field: 'merchantTerminalNoList',
    label: '平台',
    component: 'ApiSelect',
    colProps: { span: 6 },
    componentProps: () => {
      return {
        params: { limit: '999999' },
        showSearch: true,
        placeholder: '请选择小程序',
        api: getAppList,
        afterFetch: (data) => {
          const ndata = data.list
          return ndata
        },
        mode: 'multiple',
        resultField: 'list',
        labelField: 'appletName',
        valueField: 'merchantTerminalNo',
      }
    },
  },
]
