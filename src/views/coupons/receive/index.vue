<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <BasicTable :canResize="true" @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('CouponsReceiveDel') && record.status == 0,
              label: '回收',
              popConfirm: {
                title:
                  '回收将会收回用户账户内待使用的优惠券，已使用的将无法回收，确定要回收所选优惠券吗？',
                placement: 'left',
                confirm: handleRecovery.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { PageWrapper } from '/@/components/Page'
  import { columns, searchFormSchema } from './data'
  import { recycleReceiveItem, getReceiveList } from '/@/api/coupons/receive'
  import { Recordable } from 'vite-plugin-mock'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { cloneDeep } from 'lodash-es'

  export default defineComponent({
    name: 'CouponsReceive',
    components: { BasicTable, PageWrapper, TableAction },
    setup() {
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const [registerTable, { reload }] = useTable({
        title: '领取列表',
        beforeFetch,
        api: getReceiveList,
        columns,
        scroll: { y: 600 },
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        showIndexColumn: false,
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
        const pdata = cloneDeep(data)
        pdata['pageIndex'] = pdata.cursor
        pdata['pageSize'] = pdata.limit
        if (pdata.time) {
          pdata['validityBeginTime'] = `${pdata.time[0]}`
          pdata['validityEndTime'] = `${pdata.time[1]}`
        }
        delete pdata.time
        return pdata
      }

      async function handleRecovery(record: Recordable) {
        await recycleReceiveItem(record.id)
        createMessage.success(`回收成功`)
        handleSuccess()
      }

      function handleSuccess() {
        reload()
      }

      return {
        registerTable,
        handleRecovery,
        handleSuccess,
        hasPermission,
      }
    },
  })
</script>
