<script setup lang="ts">
  import { ref, defineProps } from 'vue'
  import Line from './Line.vue'
  import { Col, Row, Card, Skeleton } from 'ant-design-vue'
  import { orderDataLineChart } from '/@/api/statistics/index'
  const props = defineProps({
    type: String,
  })
  const loading = ref<boolean>(true)
  const dlist = ref([])
  init()
  async function init() {
    const res = await orderDataLineChart({ type: props.type })
    dlist.value = res.data
    loading.value = !loading.value
  }
</script>

<template>
  <Card shadow="hover">
    <Row class="pb-3 mb-2 border-b-2 border-slate-100">
      <Col :span="14" class="text-base font-semibold">近30天新增订单数</Col>
    </Row>
    <Skeleton animated :rows="6" :loading="loading">
      <Line :pdata="dlist" />
    </Skeleton>
  </Card>
</template>
