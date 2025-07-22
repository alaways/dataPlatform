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
      width: 200,
      customRender: ({ text, record }) => h('div', { style: { color: record.color } }, text),
    },
    // {
    //   title: '近1周',
    //   dataIndex: 'w1',
    // width: 100,
    //   customRender: ({ text }) => text || '-',
    // },
    // {
    //   title: '近1月',
    //   dataIndex: 'm1',
    // width: 100,
    //   customRender: ({ text }) => text || '-',
    // },
    // {
    //   title: '近3月',
    //   dataIndex: 'm3',
    // width: 100,
    //   customRender: ({ text }) => text || '-',
    // },
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
    components: { BasicTable },
    props,
    setup(props) {
      const pdata = (props.pdata || []) as Recordable<any>[]

      const dataSource: any = [
        { title: 'M0+逾期贷款笔数', color: 'red' },
        { title: 'M1+逾期贷款笔数', color: 'red' },
      ]

      const data = dataToTabel(dataSource, pdata, ['逾期报告'])

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
