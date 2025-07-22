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

  import { columns } from './data'
  import { delExpireSetting, getExpireSetting } from '/@/api/collection/commission'
  import { Recordable } from 'vite-plugin-mock'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { usePermission } from '/@/hooks/web/usePermission'
  const props = {
    currentDataSource: String,
  }
  export default defineComponent({
    name: 'CollectionCommission',
    components: { BasicTable, Modal, TableAction },
    props,
    setup(props) {
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const [registerModal, { openModal }] = useModal()
      const beforeFetch = (data) => {
        data.dataSources = props.currentDataSource
        console.log(props,'beforeFetch')
        return data
      }
      const [registerTable, { reload }] = useTable({
        title: '催收提成设置',
        beforeFetch,
        api: getExpireSetting,
        afterFetch,
        columns,
        showIndexColumn: false,
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

      function afterFetch(data) {
        return data
      }

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
        await delExpireSetting(record.id, record.dataSources)
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
