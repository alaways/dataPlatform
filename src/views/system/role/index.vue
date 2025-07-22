<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate" v-if="hasPermission('RoleAdd')">
          新增角色
        </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          class="TableAction"
          v-if="record.roleKey != 'super_admin'"
          :actions="[
            {
              ifShow: hasPermission('RoleUpdate'),
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('RoleMenu'),
              label: '菜单权限',
              onClick: handleMenu.bind(null, record),
            },
            {
              ifShow: hasPermission('RoleData'),
              label: '数据权限',
              onClick: handleData.bind(null, record),
            },
            {
              ifShow: hasPermission('RoleDel'),
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
    <RoleModal @register="registerModal" @success="handleSuccess" />
    <RoleMenuModal @register="registerMenuModal" @success="handleSuccess" />
    <RoleDataModal @register="registerDataModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { useModal } from '/@/components/Modal'
  import RoleModal from './RoleModal.vue'
  import RoleMenuModal from './MenuModal.vue'
  import RoleDataModal from './DataModal.vue'
  import { columns, searchFormSchema } from './role.data'
  import { delRoleItem, getRoleList } from '/@/api/system/role'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { usePermission } from '/@/hooks/web/usePermission'

  export default defineComponent({
    name: 'RolePage',
    components: { BasicTable, RoleModal, TableAction, RoleMenuModal, RoleDataModal },
    setup() {
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const [registerModal, { openModal }] = useModal()
      const [registerMenuModal, { openModal: openMenuModal }] = useModal()
      const [registerDataModal, { openModal: openDataModal }] = useModal()
      const [registerTable, { reload }] = useTable({
        title: '角色列表',
        api: getRoleList,
        afterFetch,
        columns,
        scroll: { y: 600 },
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      })

      function afterFetch(data) {
        data.forEach((item) => {
          item['menuIds'] = item.menuInfoList.map((v) => `${v.id}`)
          item['dataScopeDeptIds'] = item.deptInfoList.map((v) => `${v.id}`)
        })
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

      async function handleDelete(record: Recordable) {
        await delRoleItem(record.roleId)
        createMessage.success(`删除成功`)
        handleSuccess()
      }

      function handleMenu(record: Recordable) {
        openMenuModal(true, {
          record,
          isUpdate: true,
        })
      }
      function handleData(record: Recordable) {
        openDataModal(true, {
          record,
          isUpdate: true,
        })
      }

      function handleSuccess() {
        reload()
      }

      return {
        hasPermission,
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleSuccess,
        handleDelete,
        handleMenu,
        handleData,
        openMenuModal,
        registerMenuModal,
        registerDataModal,
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
