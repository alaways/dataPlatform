<template>
  <BasicTable @register="registerTable" />
</template>
<script lang="ts">
  import { InputNumber } from 'ant-design-vue'
  import { defineComponent, h, watch } from 'vue'
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table'

  const columns: BasicColumn[] = [
    {
      title: '租期',
      dataIndex: 'periodNo',
    },
    {
      title: '还款日',
      dataIndex: 'billDate',
    },
    {
      title: '应付金额(元)',
      dataIndex: 'repayAmount',
      customRender: ({ record }) => record.repayAmount || 0,
    },
  ]
  const columns2: BasicColumn[] = [
    {
      title: '租期',
      dataIndex: 'periodNo',
    },
    {
      title: '还款日',
      dataIndex: 'billDate',
    },
    {
      title: '应付金额(元)',
      dataIndex: 'repayAmount',
      customRender: ({ record }) =>
        h(InputNumber, {
          value: record.repayAmount,
          'onUpdate:value': (val) => {
            record.isEdit = true
            record.repayAmount = val
          },
          // disabled: record.periodNo == 1,
        }),
    },
  ]
  const props = {
    pdata: { type: Array, defaultValue: [] },
    fromChange: { type: Object },
  }
  export default defineComponent({
    components: { BasicTable },
    props,
    setup(props) {
      const [registerTable, { getDataSource, setTableData, setColumns }] = useTable({
        columns: props.fromChange?.type == 1 ? columns2 : columns,
        showIndexColumn: false,
        scroll: { y: '100%' },
        pagination: false,
      })

      // 用于判断是否编辑，编辑则传编辑表格，否则不传（用后端生成）
      watch(
        () => props.pdata,
        (value: any) => setTableData(value),
      )
      watch(
        () => props.fromChange?.type,
        (value: any) => {
          if (value == 1) {
            setColumns(columns2)
          } else {
            setColumns(columns)
          }
        },
      )

      return {
        registerTable,
        getDataSource,
      }
    },
  })
</script>
