<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate" v-if="hasPermission('MenuAdd')">
          新增菜单
        </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('MenuCopy'),
              label: '复制',
              onClick: handleCopy.bind(null, record),
            },
            {
              ifShow: hasPermission('MenuUpdate'),
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('MenuDel'),
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
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'

  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { addMenuItem, delMenuItem, getMenuList } from '/@/api/system/menu'

  import { useDrawer } from '/@/components/Drawer'
  import MenuDrawer from './MenuDrawer.vue'

  import { columns } from './menu.data'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { cloneDeep } from 'lodash-es'
  import { useMessage } from '/@/hooks/web/useMessage'

  export default defineComponent({
    name: 'MenuPage',
    components: { BasicTable, MenuDrawer, TableAction },
    setup() {
      const { hasPermission } = usePermission()
      const { createMessage } = useMessage()

      const [registerDrawer, { openDrawer }] = useDrawer()
      const [registerTable, { reload }] = useTable({
        title: '菜单列表',
        api: getMenuList,
        afterFetch,
        columns,
        pagination: false,
        striped: false,
        useSearchForm: false,
        bordered: true,
        showIndexColumn: false,
        canResize: false,
        actionColumn: {
          width: 180,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      })

      const parentList = ref([])
      function afterFetch(data: any) {
        const menuList = data.filter((v) => !v.parentId || v.parentId == 0)

        function filterTree(children: any) {
          return children.map((v) => {
            return {
              ...v,
              label: v.menuName,
              value: v.menuId,
              children: filterTree(data.filter((ch) => ch.parentId == v.menuId)),
            }
          })
        }
        const dlist = filterTree(menuList)
        parentList.value = cloneDeep(dlist)
        return dlist
      }

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
          parentList,
        })
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record,
          isUpdate: true,
          parentList,
        })
      }

      async function handleDelete(record: Recordable) {
        await delMenuItem(record.menuId)
        createMessage.success(`删除成功`)
        handleSuccess()
      }

      function handleSuccess() {
        reload()
      }

      async function handleCopy(record: Recordable) {
        delete record.menuId
        await addMenuItem(record)
        createMessage.success(`复制成功`)
        handleSuccess()
      }

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleSuccess,
        hasPermission,
        handleDelete,
        handleCopy,
      }
    },
  })
</script>
