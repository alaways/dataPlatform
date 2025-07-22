<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :footer="null">
    <div class="py-3">
      <Description
        size="middle"
        :bordered="false"
        :column="2"
        :data="descriptionData"
        :schema="descriptionSchema"
        :labelStyle="{ fontWeight: 'bold' }"
      />
    </div>
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
  import { modalColumns, descriptionSchema } from './contactsTable'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { getQueryEmergent } from '/@/api/order'
  import { Description } from '/@/components/Description/index'

  export default defineComponent({
    name: 'ContactsModals',
    components: { BasicTable, BasicModal, Description, TableAction },
    setup() {
      const descriptionData = ref<any>({})
      const [registerTable, { setTableData }] = useTable({
        title: '联系人查重结果',
        columns: modalColumns,
        bordered: true,
        showIndexColumn: false,
        pagination: {
          pageSize: 5,
          showQuickJumper: false,
        },
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      })

      const [registerModal, { setModalProps }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false })
        descriptionData.value = data.record
        const tableData = await getQueryEmergent({
          uid: data.record.uid,
          phone: data.record.mobile,
        })
        setTableData(tableData)
      })

      function handleDetail(record: Recordable) {
        const location = window.location.href
        const http = location.split('#')[0]
        window.open(
          `${http}#/Order_router/orderDetail/${record.id}?uid=${record.uid}&name=${record.nick_name}`,
          '_blank',
        )
      }

      return {
        registerModal,
        registerTable,
        descriptionSchema,
        descriptionData,
        handleDetail,
      }
    },
  })
</script>
