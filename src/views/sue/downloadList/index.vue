<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <BasicTable :canResize="true" @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('SueDownload') && record.contractStatus == 1,
              label: '下载',
              onClick: handleDown.bind(null, record),
            },
          ]"
        />
        <!--  -->
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { PageWrapper } from '/@/components/Page'
  import { useModal } from '/@/components/Modal'
  import { columns, searchFormSchema } from './data'
  import { Recordable } from 'vite-plugin-mock'
  import { getDownLoadMangerList } from '/@/api/sue/index'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { saveAs } from 'file-saver'
  import { downloadForUrl } from '/@/api/creditReportMan/index'
  export default defineComponent({
    name: 'SueListPage',
    components: { BasicTable, PageWrapper, TableAction },
    setup() {
      const { hasPermission } = usePermission()
      const [registerModal, { openModal }] = useModal()
      const [registerTable, { reload }] = useTable({
        title: '',
        beforeFetch,
        api: getDownLoadMangerList,
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

      const donwloadInit = async (url: string, record: any) => {
        const res = await downloadForUrl(url)
        saveAs(res.data, `${record.userName}（${record.uid}）材料.zip`)
      }

      function handleDown(record: Recordable) {
        donwloadInit(record.contractUrl, record)
      }
      function handleSuccess() {
        reload()
      }

      return {
        registerTable,
        registerModal,
        handleCreate,
        handleDown,
        handleSuccess,
        hasPermission,
      }
    },
  })
</script>
