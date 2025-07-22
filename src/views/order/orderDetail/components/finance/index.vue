<template>
  <div>
    <!-- 已复核后不能修改 -->
    <div class="flex justify-between pr-10" v-if="financeData.reviewerStatus != 1">
      <div></div>
      <Button
        type="primary"
        v-if="ifOrder != 1 && status && hasPermission('OrderDetailQualificationsUpdate')"
        @click="handleUpdate"
      >
        修改
      </Button>
    </div>
    <Description
      v-if="
        !hasPermission('Finance.loanMoney.merchant') || hasPermission('Finance.loanMoney.platform')
      "
      size="middle"
      class="mt-3"
      :bordered="false"
      :data="financeData"
      :schema="financeSchema"
    />

    <Description
      v-if="
        hasPermission('Finance.loanMoney.platform') || hasPermission('Finance.loanMoney.merchant')
      "
      size="middle"
      class="mt-3"
      :bordered="false"
      :data="financeData"
      :schema="financeNewSchema"
    />
    <Modals @register="examinModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, inject, ref } from 'vue'
  import { Description } from '/@/components/Description/index'
  import { Button, Divider } from 'ant-design-vue'
  import { financeSchema, financeNewSchema } from './data'
  import { useModal } from '/@/components/Modal'
  import Modals from './ExamineModal.vue'
  import { usePermission } from '/@/hooks/web/usePermission'

  const props = {
    detailInfo: { type: Object },
  }
  export default defineComponent({
    components: { Description, [Divider.name]: Divider, Button, Modals },
    props,
    setup(props) {
      const parent: any = inject('init')
      const { hasPermission } = usePermission()
      const isAdmin = hasPermission('Finance.loanMoney.platform')

      const ifOrder = ref(0)

      const detailInfo: any = ref(props.detailInfo)
      ifOrder.value = detailInfo.value?.ifOrder || 0
      const status = detailInfo.value?.status >= 301

      const financeData = ref<any>({})
      const [examinModal, { openModal }] = useModal()

      // 货款信息
      financeData.value = {
        ...detailInfo.value.orderExt,
      }
      console.log(financeData.value)

      function handleUpdate() {
        openModal(true, {
          isUpdate: true,
          record: financeData.value,
        })
      }

      function handleSuccess() {
        parent()
      }

      return {
        detailInfo,
        financeSchema,
        financeNewSchema,
        financeData,
        handleUpdate,
        examinModal,
        handleSuccess,
        ifOrder,
        status,
        isAdmin,
        hasPermission,
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
