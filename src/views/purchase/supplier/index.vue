<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <BasicTable :canResize="true" @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate" v-if="hasPermission('PurchaseSupplierAdd')">
          新增
        </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('PurchaseSupplierWarehouse'),
              label: '仓库',
              onClick: handleWarehouse.bind(null, record),
            },
            {
              ifShow: hasPermission('PurchaseSupplierUpdate'),
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: !!0 && hasPermission('PurchaseSupplierWarehouse'),
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
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { PageWrapper } from '/@/components/Page'
  import { useModal } from '/@/components/Modal'
  import Modal from './Modal.vue'

  import { columns, searchFormSchema } from './data'
  import { delSupplierItem, getSupplierList } from '/@/api/purchase/supplier'
  import { Recordable } from 'vite-plugin-mock'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { useGo } from '/@/hooks/web/usePage'

  export default defineComponent({
    name: 'PurchaseSupplierPage',
    components: { BasicTable, PageWrapper, Modal, TableAction },
    setup() {
      const go = useGo()
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const [registerModal, { openModal }] = useModal()
      const [registerTable, { reload }] = useTable({
        title: '供应商列表',
        api: getSupplierList,
        columns,
        scroll: { y: 600 },
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        showIndexColumn: true,
        useSearchForm: true,
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
        await delSupplierItem(record.id)
        createMessage.success(`删除成功`)
        handleSuccess()
      }

      function handleSuccess() {
        reload()
      }

      function handleWarehouse(record: Recordable) {
        go(`/Purchase_router/PurchaseWarehouse/${record.supplierNo}`)
      }

      return {
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleDel,
        handleSuccess,
        hasPermission,
        handleWarehouse,
      }
    },
  })
</script>
