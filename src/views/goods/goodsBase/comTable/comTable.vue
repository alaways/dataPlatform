<template>
  <div class="p-0">
    <h1 v-if="isTitle">{{ name }}</h1>
    <BasicTable @register="registerTable" @edit-change="handleEditChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="createActions(record)" />
        </template>
      </template>
    </BasicTable>
    <a-button block class="mt-5" type="dashed" @click="handleAdd"> 添加一行数据 </a-button>
  </div>
</template>
<script lang="ts">
  import { Recordable } from 'vite-plugin-mock'
  import { defineComponent, watch } from 'vue'
  import { BasicTable, useTable, TableAction, ActionItem, EditRecordRow } from '/@/components/Table'
  import { columnsType } from './comTable'
  import { generateRandomID } from '../utils'
  import { handleImgAfter } from '/@/utils/tool'
  import { useMessage } from '/@/hooks/web/useMessage'

  const props = {
    pdata: { type: Array, defaultValue: [] },
    name: { type: String, defaultValue: '' },
    isTitle: { type: Boolean },
    spuId: { type: String, defaultValue: '' },
  }
  export default defineComponent({
    components: { BasicTable, TableAction },
    props,
    setup(props) {
      const name = props.name || ''
      const isTitle = props.isTitle || false
      const columns = columnsType[name].columns || []
      const editRow = columnsType[name].editRow || {}
      const { createMessage } = useMessage()
      const [registerTable, { getDataSource, setTableData }] = useTable({
        columns,
        scroll: { y: 600 },
        showIndexColumn: false,
        actionColumn: {
          title: '操作',
          dataIndex: 'action',
          width: 160,
        },
        scroll: { y: '100%' },
        pagination: false,
      })

      watch(
        () => props.pdata,
        (value: any) => {
          setTableData(value)
        },
      )

      function handleEdit(record: EditRecordRow) {
        record.onEdit?.(true)
      }

      function handleCancel(record: EditRecordRow) {
        record.onEdit?.(false)
        if (record.isNew) {
          handleDelete(record)
        }
      }

      function handleSave(record: EditRecordRow) {
        if (name == '商品规格') {
          // 如果没有id则需要生成
          record['spuId'] = props.spuId
          if (!record.id && !record.uniqueId) {
            record['uniqueId'] = generateRandomID()
          }

          const data = getDataSource()
          const find = data.find(
            (v) => record.uniqueId != v.uniqueId && record.name != '颜色' && v.name == record.name,
          )
          if (find) {
            createMessage.error('规格名重复！')
            return
          }
        }

        record.onEdit?.(false, true)
      }

      function handleEditChange(data: Recordable) {
        const { column, record, value } = data
        if (column.dataIndex == 'pic') {
          if (Array.isArray(value)) {
            const urlObj = handleImgAfter(value)
            if (urlObj && urlObj.length) {
              record.pic = urlObj[0].url
            }
          }
        }
      }

      function handleAdd() {
        const data = getDataSource()
        const addRow: EditRecordRow = {
          ...editRow,
          editable: true,
          isNew: true,
          key: `${Date.now()}`,
        }
        if (data) {
          data.push(addRow)
        } else {
          setTableData([addRow])
        }
      }

      function handleDelete(record: Recordable) {
        const data = getDataSource()
        const index = data.findIndex((item) => item.key === record.key)
        data.splice(index, 1)
      }

      function createActions(record: EditRecordRow): ActionItem[] {
        if (!record.editable) {
          return [
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              label: '删除',
              popConfirm: {
                title: '是否确认删除',
                placement: 'left',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]
        }
        return [
          {
            label: '保存',
            onClick: handleSave.bind(null, record),
          },
          {
            label: '取消',
            popConfirm: {
              title: '是否取消编辑',
              confirm: handleCancel.bind(null, record),
            },
          },
        ]
      }

      return {
        registerTable,
        handleEdit,
        createActions,
        handleAdd,
        getDataSource,
        handleEditChange,
        name,
        isTitle,
      }
    },
  })
</script>
