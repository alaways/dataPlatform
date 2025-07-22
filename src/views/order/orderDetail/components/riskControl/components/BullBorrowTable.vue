<template>
  <BasicTable @register="registerTable" />
</template>
<script lang="ts">
  import { defineComponent, h, ref } from 'vue'
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table'
  import { dataToBullTabel } from '../utils'
  const props = {
    pdata: { type: Array, defaultValue: [] },
    title: { type: String, defaultValue: '' },
    name: { type: String, defaultValue: '' },
  }
  export default defineComponent({
    name: '借贷多头、租赁多头',
    components: { BasicTable },
    props,
    setup(props) {
      const pdata = (props.pdata || []) as Recordable<any>[]

      const dataSource: any = ref([])

      const type = props.title == '身份证命中' ? 'id' : 'cell'
      if (props.name == '借贷多头') {
        dataSource.value = [
          { title: '非银机构', type, type2: 'nbank' },
          { title: '银行机构', type, type2: 'bank' },
        ]
      } else {
        dataSource.value = [
          { title: '租赁机构申请次数', type, type2: 'allnum' },
          { title: '租赁机构周末申请次数', type, type2: 'weekend_allnum' },
          { title: '租赁机构夜间申请次数', type, type2: 'night_allnum' },
        ]
      }

      dataToBullTabel(dataSource.value, pdata)

      const columns: BasicColumn[] = [
        {
          title: props.title,
          dataIndex: 'title',
          width: 230,
          customRender: ({ text, record }) => h('div', { style: { color: record.color } }, text),
        },
        {
          title: '近1周',
          dataIndex: 'd7',
          customRender: ({ text }) => text || '-',
        },
        {
          title: '近1月',
          dataIndex: 'm1',
          customRender: ({ text }) => text || '-',
        },
        {
          title: '近3月',
          dataIndex: 'm3',
          customRender: ({ text }) => text || '-',
        },
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
      ]
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
