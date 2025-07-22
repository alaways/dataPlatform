<template>
  <BasicModal
    :width="1200"
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    :footer="null"
    destroyOnClose
  >
    <BasicTable @register="registerTable" />
    <div class="mt-3 pb-3 mb-2 text-base font-semibold">
      <span>已付总金额: </span>
      <span style="color: red">{{ repaidAmount }}</span>
    </div>
    <BasicTable @register="paidRegisterTable" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicTable, useTable } from '/@/components/Table'
  import { paidColumns, paidCountColumns } from './data'
  import { formatNumber } from '/@/utils/tool'

  export default defineComponent({
    name: 'Modal',
    components: { BasicModal, BasicTable },
    emits: ['success', 'register'],
    setup() {
      const isUpdate = ref(true)
      const paidCountSource: any = ref([])
      const paidSource = ref([])
      const repaidAmount = ref(0)

      const [registerModal, { setModalProps }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate

        if (data.record?.orderBillItemList) {
          paidSource.value = data.record?.orderBillItemList.filter(
            (v) => [2, 3, 4].includes(v.status) || v.repaidAmount,
          )
        }

        repaidAmount.value = Number(formatNumber(data.record?.repaidAmount, 2)) || 0

        const periodNo = paidSource.value
          .filter((v: any) => v.sourceType == 0 && v.periodNo)
          .map((v: any) => v.periodNo)
          .join('、')

        paidCountSource.value = [
          {
            ...data.record,
            periodNo,
          },
        ]
      })

      const getTitle = computed(() => '租金明细')

      const [registerTable] = useTable({
        columns: paidCountColumns,
        dataSource: paidCountSource,
        useSearchForm: false,
        pagination: false,
        showTableSetting: false,
        bordered: true,
        showIndexColumn: false,
      })

      const [paidRegisterTable] = useTable({
        columns: paidColumns,
        dataSource: paidSource,
        useSearchForm: false,
        pagination: false,
        showTableSetting: false,
        bordered: true,
        showIndexColumn: false,
      })

      return { registerModal, getTitle, registerTable, paidRegisterTable, repaidAmount }
    },
  })
</script>
