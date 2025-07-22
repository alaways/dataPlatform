<template>
  <div>
    <Description
      size="middle"
      title="审核信息"
      :bordered="false"
      :column="3"
      :data="examineData"
      :schema="examineSchema"
    />
    <a-divider />
    <Description
      size="middle"
      title="线下付款"
      :bordered="false"
      :column="3"
      :data="paymentsData"
      :schema="paymentsSchema"
    />
    <a-divider />
    <Description
      size="middle"
      title="发货信息"
      :bordered="false"
      :column="3"
      :data="deliveryData"
      :schema="deliverySchema"
    />
    <a-divider />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { Description } from '/@/components/Description/index'
  import { Divider } from 'ant-design-vue'

  import { examineSchema, paymentsSchema, deliverySchema } from './data'
  const props = {
    detailInfo: { type: Object },
  }
  export default defineComponent({
    components: { Description, [Divider.name]: Divider },
    props,
    setup(props) {
      const detailInfo: any = ref(props.detailInfo)
      const examineData = ref<any>({})
      const paymentsData = ref<any>({})
      const deliveryData = ref<any>({})

      // 审核信息
      examineData.value = {
        ...detailInfo.value?.orderAuditList[0],
        state: detailInfo.value.status,
      }

      // 线下付款
      paymentsData.value = {
        ...detailInfo.value,
      }

      // 发货信息
      deliveryData.value = {
        ...detailInfo.value?.orderDeliveryRecordVO,
      }

      return {
        detailInfo,
        examineSchema,
        examineData,
        paymentsSchema,
        paymentsData,
        deliverySchema,
        deliveryData,
      }
    },
  })
</script>
<style lang="less" scoped>
  .desc-wrap {
    padding: 16px;
    background-color: @component-background;
  }
</style>
