<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <BasicTable :canResize="true" @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate" v-if="hasPermission('AccountAdd')">
          新增账号
        </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('AccountUpdate'),
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              label: '重置密码',
              onClick: handleReset.bind(null, record),
            },
            {
              ifShow: hasPermission('AccountDel'),
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
    <AccountModal @register="registerModal" @success="handleSuccess" />
    <PasswordModal @register="registerPasswordModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'

  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { PageWrapper } from '/@/components/Page'

  import { useModal } from '/@/components/Modal'
  import AccountModal from './AccountModal.vue'
  import PasswordModal from './PasswordModal.vue'

  import { columns, searchFormSchema } from './account.data'
  import { delUserItem, getUserList } from '/@/api/system/account'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { useMessage } from '/@/hooks/web/useMessage'

  export default defineComponent({
    name: 'AccountPage',
    components: { BasicTable, PageWrapper, AccountModal, PasswordModal, TableAction },
    setup() {
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const [registerModal, { openModal }] = useModal()
      const [registerPasswordModal, { openModal: openPasswordModal }] = useModal()
      const [registerTable, { reload }] = useTable({
        title: '员工列表',
        beforeFetch,
        api: getUserList,
        columns,
        scroll: { y: 600 },
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        showIndexColumn: false,
        useSearchForm: true,
        bordered: true,
        actionColumn: {
          width: 180,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      })
      // 处理参数
      function beforeFetch(data: any) {
        if (data.time) {
          data['createTimeMin'] = `${data.time[0]} 00:00:00`
          data['createTimeMax'] = `${data.time[1]} 23:59:59`
        }
        delete data.time
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

      function handleSuccess() {
        reload()
      }

      async function handleDelete(record: Recordable) {
        await delUserItem(record.id)
        createMessage.success(`删除成功`)
        handleSuccess()
      }

      function handleReset(record: Recordable) {
        openPasswordModal(true, {
          record,
          isUpdate: true,
        })
      }

      return {
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleSuccess,
        hasPermission,
        handleReset,
        handleDelete,
        registerPasswordModal,
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
