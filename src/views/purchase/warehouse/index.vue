<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <BasicTable :canResize="true" @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate" v-if="hasPermission('PurchaseWarehouseAdd')">
          新增
        </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('PurchaseWarehouseUpdate'),
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('PurchaseWarehouseDel'),
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
  import { delWarehouseItem, getWarehouseList } from '/@/api/purchase/warehouse'
  import { Recordable } from 'vite-plugin-mock'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { useRoute } from 'vue-router'

  export default defineComponent({
    name: 'PurchaseWarehouse',
    components: { BasicTable, PageWrapper, Modal, TableAction },
    setup() {
      const route = useRoute()

      const supplierNo = route.params?.id

      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const [registerModal, { openModal }] = useModal()
      const [registerTable, { reload }] = useTable({
        title: '仓库管理',
        beforeFetch,
        api: getWarehouseList,
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

      function beforeFetch(data) {
        data['supplierNo'] = supplierNo
        return data
      }

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
          supplierNo,
        })
      }

      function handleEdit(record: Recordable) {
        openModal(true, {
          supplierNo,
          record,
          isUpdate: true,
        })
      }

      async function handleDel(record: Recordable) {
        await delWarehouseItem(record.id)
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
