<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <BasicTable :canResize="true" @register="registerTable">
      <template #toolbar>
        <a-button
          type="primary"
          @click="handleCreate"
          v-if="hasPermission('CouponsPreferentialAdd')"
        >
          新增
        </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          class="TableAction"
          :actions="[
            {
              label: '查看',
              onClick: handleQuery.bind(null, record),
            },
            {
              ifShow: hasPermission('CouponsPreferentialUpdate'),
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('CouponsPreferentialDel'),
              label: '删除',
              popConfirm: {
                title: '是否确认删除',
                placement: 'left',
                confirm: handleDel.bind(null, record),
              },
            },
            // {
            //   label: '领取记录',
            //   onClick: handleCheck.bind(null, record),
            // },
          ]"
        />
      </template>
    </BasicTable>
    <Modal @register="registerModal" @success="handleSuccess" />
    <CheckModal @register="registerCheckModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { PageWrapper } from '/@/components/Page'
  import { useModal } from '/@/components/Modal'
  import Modal from './Modal.vue'
  import CheckModal from './checkModal.vue'

  import { columns, searchFormSchema } from './data'
  import { delPreferentialItem, getPreferentialList } from '/@/api/coupons/preferential'
  import { Recordable } from 'vite-plugin-mock'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { cloneDeep } from 'lodash-es'

  export default defineComponent({
    name: 'CouponsPreferentialPage',
    components: { BasicTable, PageWrapper, Modal, TableAction, CheckModal },
    setup() {
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const [registerModal, { openModal }] = useModal()
      const [registerCheckModal, { openModal: openCheckModal }] = useModal()
      const [registerTable, { reload }] = useTable({
        title: '优惠券列表',
        beforeFetch,
        api: getPreferentialList,
        scroll: { y: 600 },
        columns,
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        showIndexColumn: false,
        useSearchForm: true,
        bordered: true,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      })

      function beforeFetch(data) {
        const pdata = cloneDeep(data)
        pdata['pageIndex'] = pdata.cursor
        pdata['pageSize'] = pdata.limit
        if (pdata.time) {
          pdata['beginCreateTime'] = `${pdata.time[0]}`
          pdata['endCreateTime'] = `${pdata.time[1]}`
        }
        delete pdata.time
        return pdata
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

      function handleQuery(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
          disabled: true,
        })
      }

      async function handleDel(record: Recordable) {
        await delPreferentialItem(record.id)
        createMessage.success(`删除成功`)
        handleSuccess()
      }

      function handleCheck(record: Recordable) {
        openCheckModal(true, {
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
        registerCheckModal,
        handleCreate,
        handleEdit,
        handleQuery,
        handleDel,
        handleSuccess,
        handleCheck,
        hasPermission,
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
