<template>
  <BasicTable :canResize="true" @register="registerTable">
    <template #toolbar>
      <a-button
        type="primary"
        @click="handleCreate"
        v-if="hasPermission('CollectionCommissionAdd')"
      >
        新增
      </a-button>
    </template>
    <template #action="{ record }">
      <TableAction
        :actions="[
          {
            ifShow: hasPermission('CollectionCommissionUpdate'),
            label: '编辑',
            onClick: handleEdit.bind(null, record),
          },
          {
            ifShow: hasPermission('CollectionCommissionDel'),
            label: '删除',
            popConfirm: {
              title: '是否确认删除',
              placement: 'left',
              confirm: handleDel.bind(null, record),
            },
          },
        ]"
      />
    </template>
  </BasicTable>
  <Modal @register="registerModal" @success="handleSuccess" />
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { useModal } from '/@/components/Modal'
  import Modal from './Modal.vue'
  import { columns } from '../data'
  import { delCommissionItem, getCommissionList } from '/@/api/collection/commission'
  import { Recordable } from 'vite-plugin-mock'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { usePermission } from '/@/hooks/web/usePermission'

  export default defineComponent({
    name: 'CollectionCommission',
    components: { BasicTable, Modal, TableAction },
    setup() {
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const [registerModal, { openModal }] = useModal()
      
      const [registerTable, { reload }] = useTable({
        title: '催收提成设置',
        api: getCommissionList,
        columns,
        showIndexColumn: true,
        useSearchForm: false,
        showTableSetting: true,
        bordered: true,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      })

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        })
      }

      function handleEdit(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        })
      }

      async function handleDel(record: Recordable) {
        await delCommissionItem(record.id)
        createMessage.success(`删除成功`)
        handleSuccess()
      }

      function handleSuccess() {
        reload()
      }

      return {
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleDel,
        handleSuccess,
        hasPermission,
      }
    },
  })
</script>
