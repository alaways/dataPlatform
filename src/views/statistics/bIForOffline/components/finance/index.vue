<template>
  <div class="p-3">
    <Card shadow="hover" class="mt-3">
      <BasicForm @register="registerForm" />

      <div class="mt-3"></div>

      <Pie ref="pieRef" />

      <Row :gutter="16" class="mt-6">
        <Col :span="6" class="mb-3" v-for="(item, index) in moneyData" :key="index">
          <Cards v-if="!item.hide" :item="item" />
        </Col>
      </Row>
    </Card>
    <Spin v-if="loading" class="spinLoading" />
  </div>
</template>

<script lang="ts" setup>
  import { moneyList, searchFormSchema } from './data'
  import Pie from './Pie.vue'
  import Cards from './Card.vue'
  import { nextTick, onMounted, ref } from 'vue'
  import { getRentFunding, getRentFundingTotal } from '/@/api/statistics'
  import { Col, Row, Card, Spin } from 'ant-design-vue'
  import { cloneDeep } from 'lodash-es'
  import { formatNumber, isValidISO8601 } from '/@/utils/tool'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { getMainCard } from '/@/api/statistics'
  // OfflineStatistics
  const { hasPermission } = usePermission()

  const moneyData = ref<any>([])
  const pieRef = ref<any>()
  const loading = ref(false)
  const [registerForm, { validate, clearValidate, setProps }] = useForm({
    labelWidth: 100,
    schemas: searchFormSchema,
    actionColOptions: { span: 5 },
    resetFunc,
    submitFunc,
  })
  // 重置
  async function resetFunc() {
    clearValidate()
    submitFunc()
  }

  // 提交
  async function submitFunc() {
    setProps({
      submitButtonOptions: {
        loading: true,
      },
    })
    await init()

    setProps({
      submitButtonOptions: {
        loading: false,
      },
    })
  }

  moneyData.value = cloneDeep(moneyList)
  if (hasPermission('StatisticsFinanceMoneyShow')) {
    moneyData.value = moneyData.value.map((v) => {
      v.hide = false
      return v
    })
  }

  function handleData(res: any, list) {
    res = res.data
    list.forEach((v) => {
      if (v.key == 'settleAmount') {
        return
      }
      Object.keys(res).forEach((o) => {
        if (v.key == o) {
          if (v.key == 'repayAmount') {
            const repay = Number(res['repayAmount']) - Number(res['overdueAmount'])
            v.value = Number(repay / 100) || 0
          } else {
            v.value = Number(res[o] / 100) || 0
          }
          v.value = formatNumber(v.value * 100, 2)
        }
      })
    })
  }

  async function init() {
    loading.value = true
    const values = await validate()
    const formValues = cloneDeep(values)
    if (formValues.time) {
      formValues['startTime'] = `${isValidISO8601(formValues.time[0], 'YYYY-MM-DD')}`
      formValues['endTime'] = `${isValidISO8601(formValues.time[1], 'YYYY-MM-DD')}`
    }
    delete formValues.time

    const res = await getRentFunding(formValues)
    await handleData(res, moneyData.value)

    const req = await getRentFundingTotal(formValues)
    const mainRes = await getMainCard()
    moneyData.value.forEach((v) => {
      if (v.key == 'settleAmount') {
        v.value = Number(req.data['settleAmount'] / 100).toLocaleString() || 0
      }
      if (v.key == 'otherSettleAmount') {
        v.value = Number(req.data['otherSettleAmount'] / 100).toLocaleString() || 0
      }
      if (v.key == 'repayAmountTotal') {
        v.value = Number(req.data['repayAmount'] / 100).toLocaleString() || 0
      }
      if (v.key == 'amountLv') {
        v.value = (Number(res.data['overdueAmount'] / mainRes?.data?.totalAmount) * 100).toFixed(2)
      }
    })
    loading.value = false

    nextTick(() => {
      if (pieRef.value) {
        pieRef.value.init(res.data, req.data)
      }
    })
  }

  onMounted(() => {
    init()
  })
</script>
<style scoped>
  .spinLoading {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9;
    right: 0;
    bottom: 0;
    margin: auto;
    height: 30px;
  }
</style>
