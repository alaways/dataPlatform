<template>
  <BasicTable @register="registerTable" />
</template>
<script lang="ts">
  import { defineComponent, h } from 'vue'
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table'

  const columns: BasicColumn[] = [
    {
      title: '案号',
      dataIndex: 'casenum',
      width: 230,
      customRender: ({ text }) => h('div', {}, text),
    },
    {
      title: '法院名称',
      dataIndex: 'court',
      width: 250,
      customRender: ({ text }) => h('div', {}, text),
    },
    {
      title: '时间',
      dataIndex: 'datatime',
      width: 180,
    },
    {
      title: '详细说明',
      dataIndex: 'statute',
      customRender: ({ text }) => h('div', {}, text),
    },
  ]
  const props = {
    pdata: { type: Array, defaultValue: [] },
  }
  export default defineComponent({
    name: '反欺诈规则——法院被执行人',
    components: { BasicTable },
    props,
    setup(props) {
      const dataSource = (props.pdata || []) as Recordable<any>[]
      const [registerTable, { getDataSource }] = useTable({
        columns: columns,
        dataSource,
        showIndexColumn: false,
        scroll: { y: '100%' },
        pagination: false,
      })

      return {
        registerTable,
        getDataSource,
      }
    },
  })
</script>
