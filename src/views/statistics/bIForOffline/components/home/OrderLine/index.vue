<script setup lang="ts">
  import { ref, defineProps, watch } from 'vue'
  import Line from './Line.vue'
  import { Col, Row, Card } from 'ant-design-vue'
  import { getOrderDataLineChart } from '/@/api/statistics/index'
  const props = defineProps({
    type: String,
    params: Object || {},
  })
  const loading = ref<boolean>(true)
  const dlist = ref([])
  const notHas = ref<any>()
  init()
  watch(
    () => props.params,
    () => {
      init()
    },
  )
  // function chunkArray(array, chunkSize) {
  //   let chunks = []
  //   if (!chunks.length) {
  //     chunks.push(array[0])
  //   }
  //   for (let i = 0; i < array.length; i += chunkSize) {
  //     const sliceItems = array.slice(i, i + chunkSize)
  //     chunks.push(sliceItems[sliceItems.length - 1])
  //   }
  //   return chunks
  // }
  async function init() {
    console.log(props.params, 'paramsShowList')
    const res = await getOrderDataLineChart({ ...props.params })
    const pdata = JSON.parse(JSON.stringify(res.data))
    let xlist = pdata?.xlist
    // chunkArray(pdata?.xlist, 7) // 分成两个部分，每部分两个元素
    let ylist = pdata?.ylist
    // chunkArray(pdata?.ylist, 7) // 分成两个部分，每部分两个元素
    dlist.value = {
      xlist,
      ylist,
    }
    loading.value = !loading.value
  }
</script>

<template>
  <Card shadow="hover" style="margin-top: 20px">
    <Row class="pb-3 mb-2 border-b-2 border-slate-100">
      <Col :span="14" class="text-base font-semibold">
        未到期待收账单总金额
        <!-- <Tooltip
          placement="topLeft"
          title="订单状态：租赁生效中；减去部分还款金额；取值未到期账单的剩余待还租金总金额；"
          arrow-point-at-center
        >
          <ExclamationCircleOutlined />
        </Tooltip> -->
      </Col>
    </Row>
    <Line :pdata="dlist" v-show="!notHas" />
    <div v-show="notHas">当前查询条件，暂无数据</div>
  </Card>
</template>
