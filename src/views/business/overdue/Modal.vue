<template>
  <BasicModal
    :width="1200"
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    :footer="null"
    destroyOnClose
  >
    <BasicTable @register="registerTable" style="padding: 0">
      <template #action="{ record }">
        <TableAction
          class="TableAction"
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
  import { defineComponent, ref, computed } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicTable, TableAction, useTable } from '/@/components/Table'
  import { columnsModel, columnsModel2, searchFormSchemaModal } from './data'
  import {
    getOverdueProvinceAndCityList,
    getOverdueSalesPersonList,
    getOverdueStoreMerchantNameList,
  } from '/@/api/business/overdue'
  import { useGo } from '/@/hooks/web/usePage'

  export default defineComponent({
    name: 'Modal',
    components: { BasicModal, BasicTable, TableAction },
    emits: ['success', 'register'],
    setup() {
      const go = useGo()
      const entryType = ref()
      const isUpdate = ref(true)
      let params: any = {
        ipProvince: '',
      }

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        const entry = data?.record.entry
        entryType.value = data?.entryType
        params = { ...params, ...data?.values, type: data?.entryType }

        let api: any
        // 处理来源
        if (entry == 'city') {
          api = getOverdueProvinceAndCityList
          if (data?.isProvince) {
            delete params?.ipCity
          } else {
            params.ipCity = data?.record.ipCity
          }
          params.ipProvince = data?.record.ipProvince
        } else if (entry == 'store') {
          api = getOverdueStoreMerchantNameList
          params['storeMerchantName'] = data?.record?.storeMerchantName
        } else if (entry == 'salesPerson') {
          api = getOverdueSalesPersonList
          params['salespersonId'] = data?.record?.salespersonId
        }
        setProps({
          api,
        })

        const columns = data?.entryType == 2 ? columnsModel : columnsModel2
        setColumns(columns)
      })

      const getTitle = computed(() => {
        if (entryType.value == 1) {
          return '总到期订单'
        } else if (entryType.value == 2) {
          return '逾期订单'
        } else {
          return '订单数'
        }
      })

      const [registerTable, { setProps, setColumns }] = useTable({
        beforeFetch,
        scroll: { y: 600 },
        showTableSetting: false,
        bordered: true,
        showIndexColumn: false,
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchemaModal,
          autoAdvancedLine: 10,
        },
        useSearchForm: true,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      })

      function beforeFetch(data) {
        const pdata = {
          ...data,
          cursor: data.pageIndex,
          limit: data.pageSize,
          ...params,
        }

        return pdata
      }

      function handleDetail(record: Recordable) {
        go(
          `/Order_router/orderDetail/${record.id}?uid=${record.uid}&name=${record.nickName}&back=/Business/BusinessOverdue`,
        )
        closeModal()
      }

      return { registerModal, getTitle, registerTable, handleDetail }
    },
  })
</script>
