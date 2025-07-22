<template>
  <PageWrapper title="支付类型配置" contentBackground contentClass="p-4">
    <template #footer>
      <ATabs v-model:activeKey="currentKey" @change="handleTabChange">
        <ATabPane v-for="item in menuData" :tab="item.tab" :key="item.key" />
      </ATabs>
    </template>
    <div class="m-4">
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction :actions="createActions(record)" />
          </template>
        </template>
      </BasicTable>
      <Button block class="mt-5" type="dashed" @click="handleAdd"> 新增支付项 </Button>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { Recordable } from 'vite-plugin-mock'
  import { defineComponent, ref } from 'vue'
  import { BasicTable, useTable, TableAction, ActionItem, EditRecordRow } from '/@/components/Table'
  import { getConfigList, updateConfigItem } from '/@/api/system/config'
  import { canParseJSON } from '/@/utils/tool'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { cloneDeep, uniq } from 'lodash-es'
  import { columns } from './data'
  import { PageWrapper } from '/@/components/Page'
  import { Tabs, Button } from 'ant-design-vue'

  export default defineComponent({
    components: {
      BasicTable,
      TableAction,
      ATabs: Tabs,
      ATabPane: Tabs.TabPane,
      Button,
      PageWrapper,
    },
    setup() {
      const currentKey = ref()
      const menuData = ref<any>([])
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
        const formParams = cloneDeep(getDataSource())
        const unList = formParams.map((v) => v.value)
        const unSet = uniq(unList)
        if (unSet.length != formParams.length) {
          createMessage.error('英文名(唯一标识) 重复!')
          return
        }
        record.onEdit?.(false, true)
        handleSubmit()
      }

      function handleAdd() {
        const data = getDataSource()
        const addRow: EditRecordRow = {
          label: '',
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
          // 将值转为 menuData 里
          const formParams = cloneDeep(getDataSource())
          const values = formParams.map((v) => {
            return { label: v.label, value: v.value, id: v.key }
          })
          menuData.value = menuData.value.map((v) => {
            if (v.key == currentKey.value) {
              v.list = values
            }
            return v
          })
          await updateConfigItem({
            ...reqData.value,
            value: JSON.stringify(menuData.value),
          })
          createMessage.success('修改成功！')
        } catch (error) {
          createMessage.error('修改失败')
        }
      }

      init()
      async function init() {
        // 获取菜单
        getConfigList({ label: 'sysConf.paySchemas' }).then((res: any) => {
          res = res[0]
          reqData.value = res
          if (canParseJSON(res.value)) {
            const data = JSON.parse(String(res.value))
            menuData.value = data.map((v) => {
              return {
                ...v,
                key: v.field,
                tab: v.label,
              }
            })
            if (menuData.value && menuData.value.length) {
              currentKey.value = menuData.value[0].key
              handleTabChange(currentKey.value)
            }
          }
        })
      }

      function handleTabChange(e) {
        const index = menuData.value.findIndex((v) => v.key == e)

        const list = menuData.value[index]?.list || []
        setTableData(list)
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
        menuData,
        currentKey,
        handleEdit,
        createActions,
        handleAdd,
        getDataSource,
        setTableData,
        handleTabChange,
      }
    },
  })
</script>
