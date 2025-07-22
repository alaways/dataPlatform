<template>
  <BasicTable @register="registerTable" />
</template>
<script lang="ts">
  import { InputNumber } from 'ant-design-vue'
  import { defineComponent, h, watch } from 'vue'
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table'

  const columns: BasicColumn[] = [
    {
      title: '期数',
      dataIndex: 'periodNo',
    },
    {
      title: '基数',
      dataIndex: 'interestRate',
      customRender: ({ record }) =>
        h(InputNumber, {
          value: record.interestRate,
          'onUpdate:value': (val) => {
            record.isEdit = true
            record.interestRate = val
          },
        }),
    },
  ]
  const props = {
    pdata: { type: Array, defaultValue: [] },
  }
  export default defineComponent({
    components: { BasicTable },
    props,
    setup(props) {
      const [registerTable, { getDataSource, setTableData }] = useTable({
        columns: columns,
        showIndexColumn: false,
        bordered: true,
        scroll: { y: '100%' },
        pagination: false,
      })
      // 用于判断是否编辑，编辑则传编辑表格，否则不传（用后端生成）
      watch(
        () => props.pdata,
        (value: any) => {
          setTableData(value)
        },
      )

      return {
        registerTable,
        getDataSource,
      }
    },
  })
</script>
