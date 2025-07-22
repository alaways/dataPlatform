<template>
  <BasicTable @register="registerTable" />
</template>
<script lang="ts">
  import { defineComponent, h } from 'vue'
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table'
  import { dataToTabel } from '../utils'
  import { Recordable } from 'vite-plugin-mock'

  const columns: BasicColumn[] = [
    {
      title: '详细',
      dataIndex: 'title',
      width: 230,
      customRender: ({ text, record }) => h('div', { style: { color: record.color } }, text),
    },
    // {
    //   title: '近7天',
    //   dataIndex: 'w1',
    // width: 100,
    //   customRender: ({ text }) => text || '-',
    // },
    {
      title: '近1月',
      dataIndex: 'm1',
      width: 100,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '近3月',
      dataIndex: 'm3',
      width: 100,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '近6月',
      dataIndex: 'm6',
      width: 100,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '近12月',
      dataIndex: 'm12',
      width: 100,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '近24月',
      dataIndex: 'm24',
      width: 100,
      customRender: ({ text }) => text || '-',
    },
  ]
  const props = {
    pdata: { type: Array, defaultValue: [] },
  }
  export default defineComponent({
    name: '行为报告',
    components: { BasicTable },
    props,
    setup(props) {
      const pdata = (props.pdata || []) as Recordable<any>[]
      const dataSource: any = [
        { title: '贷款笔数' },
        { title: '贷款总金额' },
        { title: '贷款机构数' },
        { title: '消⾦类贷款机构数' },
        { title: '累计逾期⾦额' },
        { title: '失败扣款笔数', color: 'red' },
        { title: '履约贷款总⾦额' },
        { title: '履约贷款次数' },
      ]

      const data = dataToTabel(dataSource, pdata, ['行为报告'])

      const [registerTable, { getDataSource }] = useTable({
        columns: columns,
        dataSource: data,
        showIndexColumn: false,
        pagination: false,
      })

      return {
        registerTable,
        getDataSource,
      }
    },
  })
</script>
