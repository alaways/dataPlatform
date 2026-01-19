<template>
  <div class="mt-8">
    <div class="text-base font-bold mb-3" size="large">
      <span>当天到期账单【即:第3期及以上】</span>
      <Tips />
    </div>
    <BasicForm @register="register3Form" />
    <Spin tip="正在加载..." size="large" :spinning="loading3">
      <div class="flex mb-3">
        <div>
          日期时间: <span class="text-[#e11d48]">{{ table3Count.date }}</span>
        </div>
        <div class="ml-5">
          已到期账单数: <span class="text-[#e11d48]">{{ table3Count.paid_bill_count }}</span>
        </div>
        <div class="ml-5">
          已到期账单金额: <span class="text-[#e11d48]">{{ table3Count.exp_bill_amount }}</span>
        </div>
      </div>
      <Table ref="table3Ref" key="table3" />
    </Spin>
    <div class="text-base font-bold mt-8 mb-3" size="large">
      <span>当天到期账单【即:第2期账单】</span>
      <Tips />
    </div>
    <BasicForm @register="registerForm" />
    <Spin tip="正在加载..." size="large" :spinning="loading">
      <div class="flex mb-3">
        <div>
          日期时间: <span class="text-[#e11d48]">{{ table2Count.date }}</span>
        </div>
        <div class="ml-5">
          已到期账单数: <span class="text-[#e11d48]">{{ table2Count.paid_bill_count }}</span>
        </div>
        <div class="ml-5">
          已到期账单金额: <span class="text-[#e11d48]">{{ table2Count.exp_bill_amount }}</span>
        </div>
      </div>
      <Table ref="table2Ref" key="table2" />
    </Spin>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { getExpireBillsRepay } from '/@/api/statistics'
  import { searchFormSchema } from './data'
  import { Spin } from 'ant-design-vue'
  import Table from './table.vue'
  import dayjs from 'dayjs'
  import { handleTableData } from './handle'
  import { cloneDeep } from 'lodash-es'
  import { formatNumber } from '/@/utils/tool'
  import Tips from './tips.vue'

  const [registerForm, { updateSchema, validate }] = useForm({
    labelWidth: 100,
    schemas: cloneDeep(searchFormSchema),
    showActionButtonGroup: false,
  })

  const [register3Form, { updateSchema: update3Schema, validate: validate3 }] = useForm({
    labelWidth: 100,
    schemas: cloneDeep(searchFormSchema),
    showActionButtonGroup: false,
  })

  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  const table2Count = ref<any>({
    date: yesterday,
    paid_bill_count: 0,
    exp_bill_amount: 0,
  })
  const table3Count = ref<any>({
    date: yesterday,
    paid_bill_count: 0,
    exp_bill_amount: 0,
  })
  const table2Ref = ref<any>()
  const table3Ref = ref<any>()
  const loading = ref<any>(false)
  const loading3 = ref<any>(false)

  async function init() {
    loading.value = true
    const values = await validate()
    const res: any = await getExpireBillsRepay({ ...values, date: yesterday })
    const total = res.find((v) => v.period_no == '2-1')
    table2Count.value.paid_bill_count = total.paid_bill_count
    table2Count.value.exp_bill_amount = formatNumber(total.exp_bill_amount, 2)
    const table2Data = handleTableData(res, 2, total)

    if (table2Ref.value) {
      table2Ref.value.setTableData(table2Data)
    }

    loading.value = false
  }
  async function init3() {
    loading3.value = true
    const values = await validate3()
    const res: any = await getExpireBillsRepay({ ...values, date: yesterday })
    const total = res.find((v) => v.period_no == '3-1')
    table3Count.value.paid_bill_count = total.paid_bill_count
    table3Count.value.exp_bill_amount = formatNumber(total.exp_bill_amount, 2)
    const table3Data = handleTableData(res, 3, total)

    if (table3Ref.value) {
      table3Ref.value.setTableData(table3Data)
    }

    loading3.value = false
  }

  onMounted(() => {
    init()
    init3()
    updateSchema([
      {
        field: 'spuType',
        componentProps: { onChange: () => init() },
      },
      {
        field: 'rentType',
        componentProps: { onChange: () => init() },
      },
      {
        field: 'goodsLeaseType',
        componentProps: { onChange: () => init() },
      },
    ])
    update3Schema([
      {
        field: 'spuType',
        componentProps: { onChange: () => init3() },
      },
      {
        field: 'rentType',
        componentProps: { onChange: () => init3() },
      },
      {
        field: 'goodsLeaseType',
        componentProps: { onChange: () => init3() },
      },
    ])
  })
</script>
