<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '删除',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <Button block class="mt-5" type="dashed" @click="handleAdd"> 新增系数 </Button>
  </div>
</template>
<script lang="ts">
  import { Recordable } from 'vite-plugin-mock'
  import { defineComponent, ref, watch } from 'vue'
  import { BasicTable, useTable, TableAction, EditRecordRow } from '/@/components/Table'
  import { canParseJSON } from '/@/utils/tool'
  import { tableColumn, tableEditRow } from './data'
  import { Button } from 'ant-design-vue'

  export default defineComponent({
    components: {
      BasicTable,
      TableAction,
      Button,
    },
    props: {
      data: Object,
    },
    setup(props) {
      const currentKey = ref()
      const editRow = tableEditRow

      const [registerTable, { getDataSource, setTableData }] = useTable({
        columns: tableColumn,
        scroll: { y: 600 },
        showIndexColumn: false,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
        },
        pagination: false,
      })

      function handleAdd() {
        const data = getDataSource()
        const addRow: EditRecordRow = {
          ...editRow,
          editable: true,
          isNew: true,
          id: `${Date.now()}`,
        }
        data.push(addRow)
      }

      function handleDelete(record: Recordable) {
        const data = getDataSource()
        const index = data.findIndex((item) => item.key === record.key)
        data.splice(index, 1)
      }

      async function init() {
        // 获取菜单
        if (canParseJSON(props.data)) {
          const data = JSON.parse(String(props.data))
          if (typeof data !== 'number') {
            setTableData(data)
            return
          }
        }
        setTableData([])
      }

      watch(
        () => props.data,
        () => {
          init()
        },
      )

      return {
        registerTable,
        currentKey,
        handleAdd,
        getDataSource,
        setTableData,
        handleDelete,
      }
    },
  })
</script>
