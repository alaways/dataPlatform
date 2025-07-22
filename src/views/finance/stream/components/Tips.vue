<template>
  <div>
    <span style="color: red">
      温馨提示: 1、单次提现总金额须大于{{ balance }}元。2、发起提现后,财务打款将在T+2日内完成。
    </span>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent } from 'vue'
  import { formatNumber } from '/@/utils/tool'

  const props = {
    withdrawData: { type: Object },
    userInfo: { type: Object },
  }

  export default defineComponent({
    name: 'StreamTips',
    props,
    setup(props) {
      const balance = computed(() => {
        // return formatNumber(props.withdrawData?.settleAmount || 0, 2)
        return formatNumber(props.userInfo?.withdrawLimit || 0, 2)
      })

      return {
        balance,
      }
    },
  })
</script>
