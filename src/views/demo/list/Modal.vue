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
      <template #toolbar>
        <div class="mt-3 pb-3 mb-2 text-base font-semibold flex flex-1 justify-items-start">
          <span>共计: &nbsp;</span>
          <span style="color: red">{{ repaidAmount || 0 }}</span>
          <span>单</span>
        </div>
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, toRefs } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicTable, useTable } from '/@/components/Table'
  import { paidColumns, searchPaidFormSchema } from './data'
  import { getOrderStoreList } from '/@/api/store'

  export default defineComponent({
    name: 'Modal',
    components: { BasicModal, BasicTable },
    emits: ['success', 'register'],
    setup() {
      const isUpdate = ref(true)
      const repaidAmount = ref(0)

      const params = {
        ifOrder: 2,
        merchantCode: '',
      }

      const [registerModal, { setModalProps }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        params.merchantCode = data?.record.merchantCode
      })

      const getTitle = computed(() => '订单列表')

      const [registerTable, { getRawDataSource }] = useTable({
        columns: paidColumns,
        scroll: { y: 600 },
        beforeFetch,
        api: getOrderStoreList,
        afterFetch,
        formConfig: {
          labelWidth: 80,
          schemas: searchPaidFormSchema,
        },
        useSearchForm: true,
        showTableSetting: false,
        bordered: true,
        showIndexColumn: false,
      })

      function beforeFetch(data) {
        const dataRef = toRefs(data)
        const pdata = {
          ...params,
          ...data,
          cursor: data.pageIndex,
          limit: data.pageSize,
        }
        const timeValue = dataRef.timeSelect.value

        if (pdata.time) {
          if (timeValue == '创建时间') {
            pdata['beginCreateTime'] = `${pdata.time[0]}`
            pdata['endCreateTime'] = `${pdata.time[1]}`
          } else if (timeValue == '分配时间') {
            pdata['beginAllocatTime'] = `${pdata.time[0]}`
            pdata['endAllocatTime'] = `${pdata.time[1]}`
          } else if (timeValue == '接单时间') {
            pdata['beginReceivtTime'] = `${pdata.time[0]}`
            pdata['endReceivtTime'] = `${pdata.time[1]}`
          }
        }
        delete pdata.timeSelect
        delete pdata.time
        return pdata
      }

      function afterFetch(data) {
        const pdata = getRawDataSource()
        repaidAmount.value = pdata.total
        return data
      }

      return { registerModal, getTitle, registerTable, repaidAmount }
    },
  })
</script>
