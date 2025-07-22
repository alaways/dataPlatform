<template>
  <BasicTable @register="registerTable" />
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table'

  const columns: BasicColumn[] = [
    {
      title: '文书编号',
      dataIndex: 'id',
      width: 150,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '类型',
      dataIndex: 'dataType',
      width: 120,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 250,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '详细说明',
      dataIndex: 'content',
      customRender: ({ text }) => text || '-',
    },
    {
      title: '时间',
      dataIndex: 'caseTime',
      width: 180,
    },
  ]
  const props = {
    pdata: { type: Array, defaultValue: [] },
  }
  export default defineComponent({
    components: { BasicTable },
    props,
    setup(props) {
      let dataSource = (props.pdata || []) as Recordable<any>[]
      dataSource = dataSource && dataSource.length && dataSource[0] && dataSource[0]?.value
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
