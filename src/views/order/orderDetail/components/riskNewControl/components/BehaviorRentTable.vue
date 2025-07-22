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
    {
      title: '近7天',
      dataIndex: 'w1',
      width: 100,
      customRender: ({ text }) => text || '-',
    },
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
  ]
  const props = {
    pdata: { type: Array, defaultValue: [] },
  }
  export default defineComponent({
    name: '租机行为报告',
    components: { BasicTable },
    props,
    setup(props) {
      const pdata = (props.pdata || []) as Recordable<any>[]
      const dataSource: any = [
        { title: '申请平台数' },
        { title: '申请次数' },
        { title: '夜间申请平台数' },
        { title: '夜间申请次数' },
      ]

      const data = dataToTabel(dataSource, pdata, ['租机行为报告'])

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
