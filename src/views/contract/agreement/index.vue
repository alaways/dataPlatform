<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <BasicTable :canResize="true" @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate" v-if="hasPermission('ContractAgreementAdd')">
          新增
        </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('ContractAgreementUpdate'),
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('ContractAgreementDel'),
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
    </BasicTable>
    <Modal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { PageWrapper } from '/@/components/Page'
  import { useModal } from '/@/components/Modal'
  import Modal from './Modal.vue'

  import { agreementColumns, searchFormSchema } from './data'
  import { delContractItem, getAgreementList } from '/@/api/contract/agreement'
  import { Recordable } from 'vite-plugin-mock'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { usePermission } from '/@/hooks/web/usePermission'

  export default defineComponent({
    name: 'ContractAgreementPage',
    components: { BasicTable, PageWrapper, Modal, TableAction },
    setup() {
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const [registerModal, { openModal }] = useModal()
      const [registerTable, { reload }] = useTable({
        title: '协议列表',
        scroll: { y: 600 },
        api: getAgreementList,
        columns: agreementColumns,
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        showIndexColumn: false,
        useSearchForm: false,
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

      async function handleDelete(record: Recordable) {
        await delContractItem(record.id)
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
        handleSuccess,
        handleDelete,
        hasPermission,
      }
    },
  })
</script>
