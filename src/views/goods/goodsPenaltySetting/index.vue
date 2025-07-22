<template>
  <BasicTable @register="registerTable">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <TableAction :actions="createActions(record)" />
      </template>
    </template>
  </BasicTable>
  <Button
    v-if="hasPermission('GoodsPenaltySettingAdd')"
    block
    class="mt-5"
    type="dashed"
    @click="handleAdd"
  >
    新增
  </Button>
</template>
<script lang="ts">
  import { Recordable } from 'vite-plugin-mock'
  import { defineComponent, onMounted, ref } from 'vue'
  import { BasicTable, useTable, TableAction, ActionItem, EditRecordRow } from '/@/components/Table'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { cloneDeep, uniq } from 'lodash-es'
  import { columns } from './data'
  import { Button } from 'ant-design-vue'
  import { getPenaltyList, setPenaltyItem } from '/@/api/goods/goodsPenaltySetting'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { canParseJSON } from '/@/utils/tool'

  export default defineComponent({
    components: {
      BasicTable,
      TableAction,
      Button,
    },
    setup() {
      const currentKey = ref()
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()

      const [registerTable, { getDataSource, setTableData }] = useTable({
        title: '罚息设置',
        columns,
        scroll: { y: 600 },
        showIndexColumn: false,
        actionColumn: {
          width: 160,
          title: '操作',
          dataIndex: 'action',
        },
        pagination: false,
      })

      async function init() {
        // 获取菜单
        getPenaltyList({ label: 'penaltyRate.confg' }).then((res: any) => {
          if (canParseJSON(res)) {
            const data = JSON.parse(String(res))
            if (data.penaltyRateInfoList && data.penaltyRateInfoList.length) {
              const list = data.penaltyRateInfoList.map((v) => {
                return {
                  ...v,
                  penaltyRate: Number(v.penaltyRate) * 100,
                }
              })
              setTableData(list)
            }
          }
        })
      }

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
        const formParams = cloneDeep(getDataSource())
        const unList = formParams.map((v) => v.rentType)
        const unSet = uniq(unList)
        if (unSet.length != formParams.length) {
          createMessage.error('租赁类型设置不能重复！')
          return
        }
        record.onEdit?.(false, true)
        handleSubmit()
      }

      function handleAdd() {
        const data = getDataSource()
        const addRow: EditRecordRow = {
          rentType: '',
          value: '',
          editable: true,
          isNew: true,
          key: `${Date.now()}`,
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
          const values = cloneDeep(getDataSource())
          const formParams = values.map((v) => {
            const penaltyRate = Number((Number(v.penaltyRate) / 100).toFixed(4))
            return { rentType: v.rentType, penaltyRate }
          })
          await setPenaltyItem({
            penaltyRateInfoList: formParams,
          })
          createMessage.success('修改成功！')
        } catch (error) {
          createMessage.error('修改失败')
        }
      }

      function createActions(record: EditRecordRow): ActionItem[] {
        if (!record.editable) {
          return [
            {
              ifShow: hasPermission('GoodsPenaltySettingUpdate'),
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('GoodsPenaltySettingDel'),
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

      onMounted(() => {
        init()
      })

      return {
        hasPermission,
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
