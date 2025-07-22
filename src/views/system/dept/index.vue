<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate" v-if="hasPermission('DeptAdd')">
          新增部门
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                ifShow: hasPermission('DeptUpdate'),
                label: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                ifShow: hasPermission('DeptDel'),
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
      </template>
    </BasicTable>
    <DeptModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, TableAction } from '/@/components/Table'

  import { useModal } from '/@/components/Modal'
  import DeptModal from './DeptModal.vue'

  import { columns, searchFormSchema } from './dept.data'
  import { delDeptItem, getDeptList } from '/@/api/system/dept'
  import { Recordable } from 'vite-plugin-mock'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { nextTick } from 'vue'

  const { createMessage } = useMessage()
  const { hasPermission } = usePermission()
  const [registerModal, { openModal }] = useModal()
  const [registerTable, { reload, expandAll }] = useTable({
    title: '部门列表',
    api: getDeptList,
    columns,
    scroll: { y: 600 },
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
    },
    isTreeTable: true,
    pagination: false,
    striped: false,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    canResize: false,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
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
    await delDeptItem(record.deptId)
    createMessage.success(`删除成功`)
    handleSuccess()
  }

  function handleSuccess() {
    reload()
  }

  function onFetchSuccess() {
    nextTick(expandAll)
  }
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
