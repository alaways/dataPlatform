<template>
  <div>
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          class="TableAction"
          :actions="[
            {
              // ifShow: hasPermission('CollectionCommissionPage'),
              label: '催收配置',
              onClick: gotoPage.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { pageColumns } from './data'
  import { useGo } from '/@/hooks/web/usePage'
  import { cloneDeep } from 'lodash-es'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { Recordable } from 'vite-plugin-mock'
  import { getCollectsPage } from '/@/api/collection/commission'
  const props = {
    detailInfo: { type: Object },
    ifStore: { type: String },
    isAllocation: { type: Boolean },
  }
  export default defineComponent({
    name: 'CollectionSetting',
    props,
    components: { BasicTable, TableAction },
    setup() {
      const go = useGo()
      const { hasPermission } = usePermission()
      const [registerTable, { reload, getForm, getPaginationRef, clearSelectedRowKeys} ] = useTable(
        {
          title: '催收任务',
          scroll: { y: 600 },
          api: getCollectsPage,
          columns: pageColumns,
          useSearchForm: false,
          bordered: true,
          canResize: false,
          showIndexColumn: false,
          actionColumn: {
            width: 120,
            title: '操作',
            dataIndex: 'action',
            slots: { customRender: 'action' },
            fixed: 'right',
          },
        },
      )
      function gotoPage(record: Recordable) {
        go(`/CollectionPage/CollectionCommissionPage?dataSources=${record.dataSources}&back=/CollectionPage/CollectionSetting`)
      }
      return {
        registerTable,
        gotoPage,
        hasPermission,
      }
    },
  })
</script>
