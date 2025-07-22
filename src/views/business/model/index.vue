<template>
  <div>
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('businessModelUpdate'),
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
    <Modals @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import { cloneDeep } from 'lodash-es'
  import { getModelList } from '/@/api/business/model'
  import { useModal } from '/@/components/Modal'
  import { Recordable } from 'vite-plugin-mock'
  import Modals from './Modal.vue'
  import { usePermission } from '/@/hooks/web/usePermission'

  export default defineComponent({
    name: 'BusinessModelPage',
    components: { BasicTable, TableAction, Modals },
    setup() {
      const { hasPermission } = usePermission()
      const [registerModal, { openModal }] = useModal()
      const [registerTable, { reload }] = useTable({
        scroll: { y: 600 },
        beforeFetch,
        api: getModelList,
        columns,
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
          autoAdvancedLine: 10,
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      })

      // 处理参数
      async function beforeFetch(data) {
        const pdata = cloneDeep(data)
        pdata['pageIndex'] = pdata.cursor
        pdata['pageSize'] = pdata.limit

        return pdata
      }

      function handleEdit(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        })
      }
      function handleSuccess() {
        reload()
      }

      return {
        registerTable,
        registerModal,
        handleEdit,
        handleSuccess,
        hasPermission,
      }
    },
  })
</script>
