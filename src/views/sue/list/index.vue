<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <BasicTable :canResize="true" @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate" v-if="hasPermission('SueContarctdd')">
          新增
        </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('SueContarctUpdate'),
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            // {
            //   ifShow: hasPermission('SueContarctDel'),
            //   label: '删除',
            //   popConfirm: {
            //     title: '是否确认删除',
            //     placement: 'left',
            //     confirm: handleDel.bind(null, record),
            //   },
            // },
          ]"
        />
      </template>
    </BasicTable>
    <Modal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { PageWrapper } from '/@/components/Page'
  import { useModal } from '/@/components/Modal'
  import Modal from './Modal.vue'
  import { columns } from './data'
  import { Recordable } from 'vite-plugin-mock'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { delMangerItem, getMangerList } from '/@/api/sue/index'
  import { usePermission } from '/@/hooks/web/usePermission'

  export default defineComponent({
    name: 'SueListPage',
    components: { BasicTable, PageWrapper, Modal, TableAction },
    setup() {
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const [registerModal, { openModal }] = useModal()
      const [registerTable, { reload }] = useTable({
        title: '',
        beforeFetch,
        api: getMangerList,
        columns,
        scroll: { y: 600 },
        // formConfig: {
        //   labelWidth: 80,
        //   schemas: searchFormSchema,
        //   autoSubmitOnEnter: true,
        // },
        showIndexColumn: true,
        useSearchForm: false,
        bordered: true,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      })

      function beforeFetch(data) {
        data['pageIndex'] = data.cursor
        data['pageSize'] = data.limit
      }

      const helpArticleCategoryId = ref()

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
          helpArticleCategoryId,
        })
      }

      function handleEdit(record: Recordable) {
        openModal(true, {
          record,
          helpArticleCategoryId,
          isUpdate: true,
        })
      }

      async function handleDel(record: Recordable) {
        await delMangerItem(record.id)
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
