<template>
  <BasicTable @register="registerTable" />
</template>
<script lang="ts">
  import { defineComponent, h } from 'vue'
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table'
  import { dataToTabel } from '../utils'

  const columns: BasicColumn[] = [
    {
      title: '详细',
      dataIndex: 'title',
      width: 230,
      customRender: ({ text, record }) => h('div', { style: { color: record.color } }, text),
    },
    // {
    //   title: '近1周',
    //   dataIndex: 'w1',
    //   customRender: ({ text }) => text || '-',
    // },
    // {
    //   title: '近1月',
    //   dataIndex: 'm1',
    //   customRender: ({ text }) => text || '-',
    // },
    // {
    //   title: '近3月',
    //   dataIndex: 'm3',
    //   customRender: ({ text }) => text || '-',
    // },
    {
      title: '近6月',
      dataIndex: 'm6',
      customRender: ({ text }) => text || '-',
    },
    {
      title: '近12月',
      dataIndex: 'm12',
      customRender: ({ text }) => text || '-',
    },
    {
      title: '近24月',
      dataIndex: 'm24',
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
        // { title: '申请人逾期次数' },
        // { title: '申请人逾期银行次数' },
        // { title: '申请人逾期贷款超市次数' },
        { title: 'M0+逾期贷款笔数', color: 'red' },
        { title: 'M1+逾期贷款笔数', color: 'red' },
      ]

      dataToTabel(dataSource, pdata, ['逾期报告', '逾期数据'])

      const [registerTable, { getDataSource }] = useTable({
        columns: columns,
        dataSource,
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
