<template>
  <div>
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          class="TableAction"
          :actions="[
            {
              label: '详情',
              onClick: handleDetail.bind(null, record),
            },
            {
              label: '下载保单',
              onClick: handleDownload.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import { useGo } from '/@/hooks/web/usePage'
  import { Recordable } from 'vite-plugin-mock'
  import { downloadByUrl } from '/@/utils/file/download'
  import { getIsurancePreviewList } from '/@/api/store/insure'

  export default defineComponent({
    name: 'InsureList',
    components: { BasicTable, TableAction },
    setup() {
      const go = useGo()
      const [registerTable] = useTable({
        title: '投保列表',
        beforeFetch,
        api: getIsurancePreviewList,
        columns,
        scroll: { y: 600 },
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          autoAdvancedLine: 10,
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      })
      function beforeFetch(data) {
        data['pageIndex'] = data.cursor
        data['pageSize'] = data.limit
        if (data.time) {
          data['beginCreateTime'] = `${data.time[0]}`
          data['endCreateTime'] = `${data.time[1]}`
        }
        delete data.time
      }

      function handleDetail(record: Recordable) {
        go(
          `/Order_router/orderDetail/${record.orderId}?uid=${record.uid}&name=${record.nickName}&back=/store/insureStore`,
        )
      }

      function handleDownload(record: Recordable) {
        downloadByUrl({ url: record.elecPolicyUrl })
      }

      return {
        registerTable,
        handleDetail,
        handleDownload,
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
