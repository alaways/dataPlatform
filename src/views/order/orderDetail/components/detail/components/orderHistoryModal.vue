<template>
  <BasicModal :width="700" v-bind="$attrs" @register="registerModal" destroyOnClose :footer="null">
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '详情',
              onClick: handleDetail.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicTable, TableAction, useTable } from '/@/components/Table'
  import { orderHistoryColumns } from '../data'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { Recordable } from 'vite-plugin-mock'
  import { useGo } from '/@/hooks/web/usePage'
  import { getOrderList } from '/@/api/order'

  export default defineComponent({
    name: 'OrderHistory',
    components: { BasicTable, BasicModal, TableAction },
    setup() {
      const go = useGo()

      const recordInfo = ref<any>({})
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false })
        recordInfo.value = data.record
      })

      function beforeFetch(data) {
        data['idCard'] = recordInfo.value.idCard
        data['nickName'] = recordInfo.value.nickName
        data['orderIds'] = [recordInfo.value.orderId].join(',')
        data['statusList'] = [801, 901, 1101, 1201].join(',')
      }

      const [registerTable] = useTable({
        beforeFetch,
        api: getOrderList,
        columns: orderHistoryColumns,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      })

      function handleDetail(record: Recordable) {
        go(
          `/Order_router/orderDetail/${record.id}?uid=${record.uid}&name=${record.nickName}&back=/order/orderList`,
        )
        closeModal()
      }

      return {
        registerModal,
        registerTable,
        handleDetail,
      }
    },
  })
</script>
