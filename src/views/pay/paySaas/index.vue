<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="createActions(record)" />
        </template>
      </template>
    </BasicTable>
    <Button block class="mt-5" type="dashed" @click="handleAdd"> 新增平台类型 </Button>
  </div>
</template>
<script lang="ts">
  import { Recordable } from 'vite-plugin-mock'
  import { defineComponent, ref } from 'vue'
  import { BasicTable, useTable, TableAction, ActionItem, EditRecordRow } from '/@/components/Table'
  import { getConfigList, updateConfigItem } from '/@/api/system/config'
  import { canParseJSON } from '/@/utils/tool'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { cloneDeep } from 'lodash-es'
  import { columns } from './data'
  import { Button } from 'ant-design-vue'

  export default defineComponent({
    components: {
      BasicTable,
      TableAction,
      Button,
    },
    setup() {
      const currentKey = ref()
      const { createMessage } = useMessage()
      const reqData = ref<any>({})

      const [registerTable, { getDataSource, setTableData }] = useTable({
        columns,
        scroll: { y: 600 },
        showIndexColumn: false,
        actionColumn: {
          width: 160,
          title: '操作',
          dataIndex: 'action',
        },
        scroll: { y: '100%' },
        pagination: false,
      })

      function handleEdit(record: EditRecordRow) {
        record.onEdit?.(true)
      }

      function handleCancel(record: EditRecordRow) {
        record.onEdit?.(false)
        if (record.isNew) {
          const data = getDataSource()
          const index = data.findIndex((item) => item.key === record.key)
          data.splice(index, 1)
        }
      }

      async function handleSave(record: EditRecordRow) {
        record.onEdit?.(false, true)
        handleSubmit()
      }

      function handleAdd() {
        const data = getDataSource()
        console.log(data)

        const addRow: EditRecordRow = {
          label: '',
          field: '',
          applet: '',
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
        handleSubmit()
      }

      async function handleSubmit() {
        try {
          const formParams = cloneDeep(getDataSource())
          const values = formParams.map((v) => {
            return {
              id: v.id || `${Date.now()}`,
              label: v.label,
              tab: v.label,
              key: v.field,
              field: v.field,
              applet: v.applet,
              component: 'Input',
              colProps: { span: 24 },
              list: v.list || [],
            }
          })
          await updateConfigItem({
            ...reqData.value,
            value: JSON.stringify(values),
          })
          createMessage.success('修改成功！')
        } catch (error) {
          createMessage.error('修改失败')
        }
      }

      init()
      async function init() {
        // 获取菜单
        getConfigList({ label: 'sysConf.saas' }).then((res: any) => {
          res = res[0]
          reqData.value = res
          if (canParseJSON(res.value)) {
            const data = JSON.parse(String(res.value))
            console.log(data)
            setTableData(data)
          }
        })
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
        currentKey,
        handleEdit,
        createActions,
        handleAdd,
        getDataSource,
        setTableData,
      }
    },
  })
</script>
