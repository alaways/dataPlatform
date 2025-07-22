<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <BasicTable :canResize="true" @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate" v-if="hasPermission('newCalculatorListAdd')">
          新增
        </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          class="TableAction"
          :actions="[
            {
              ifShow: hasPermission('newCalculatorListUpdate'),
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('newCalculatorListQRCode'),
              label: '生成二维码',
              onClick: handleQRcode.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
    <Modal @register="registerModal" @success="handleSuccess" />
    <QRcodeModal @register="qrCodeModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { PageWrapper } from '/@/components/Page'
  import { useModal } from '/@/components/Modal'
  import Modal from './Modal.vue'
  import QRcodeModal from './QRcodeModal.vue'

  import { columns } from './data'
  import { Recordable } from 'vite-plugin-mock'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { getNewCalculatorList } from '/@/api/calculator/newCalculator'

  export default defineComponent({
    name: 'NewCalculatorListPage',
    components: { BasicTable, PageWrapper, Modal, TableAction, QRcodeModal },
    setup() {
      const { hasPermission } = usePermission()
      const [registerModal, { openModal }] = useModal()
      const [qrCodeModal, { openModal: openQrCodeModal }] = useModal()
      const [registerTable, { reload }] = useTable({
        title: '新计算器列表',
        api: getNewCalculatorList,
        columns,
        showIndexColumn: false,
        useSearchForm: false,
        bordered: true,
        scroll: { y: 600 },
        actionColumn: {
          width: 100,
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

      function handleSuccess() {
        reload()
      }

      async function handleQRcode(record: Recordable) {
        openQrCodeModal(true, {
          isUpdate: true,
          record: {
            ...record,
          },
        })
      }

      return {
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleSuccess,
        hasPermission,
        qrCodeModal,
        handleQRcode,
      }
    },
  })
</script>

<style lang="less" scoped>
  .TableAction {
    flex-direction: column;

    ::v-deep.vben-basic-table-action {
      button {
        margin-bottom: 2px;
      }

      .action-divider {
        display: none !important;
      }
    }
  }
</style>
