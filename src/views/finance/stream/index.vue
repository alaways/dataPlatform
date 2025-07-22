<template>
  <PageWrapper contentBackground>
    <template #footer>
      <ATabs v-model:activeKey="currentKey" @change="handleTabChange">
        <ATabPane v-for="item in menuData" :tab="item.tab" :key="item.key" />
      </ATabs>
    </template>
    <div>
      <component :is="currentKey" :withdrawData="withdrawData" :userInfo="userInfo" />
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, provide, ref } from 'vue'
  import { PageWrapper } from '/@/components/Page'
  import { Tabs } from 'ant-design-vue'
  import { useRoute } from 'vue-router'
  import All from './components/All.vue'
  import Review from './components/Review.vue'
  import Withdrawal from './components/Withdrawal.vue'
  import Settled from './components/Settled.vue'
  import Auditing from './components/Auditing.vue'
  import { getMerchantAccount, getWithdrawAmount } from '/@/api/finance/stream'

  export default defineComponent({
    name: 'FinanceStreamPage',
    components: {
      PageWrapper,
      ATabs: Tabs,
      ATabPane: Tabs.TabPane,
      All,
      Review,
      Withdrawal,
      Auditing,
      Settled,
    },
    setup() {
      provide('init', init)
      const currentKey = ref('All')

      const menuData = ref<any>([
        { tab: '全部', key: 'All' },
        { tab: '待复核收款', key: 'Review' },
        { tab: '待商家提现', key: 'Withdrawal' },
        { tab: '待提现审核中', key: 'Auditing' },
        { tab: '已结算', key: 'Settled' },
      ])

      const { query } = useRoute()
      if (query && query.type) {
        currentKey.value = String(query.type)
      }

      function handleTabChange(e) {
        currentKey.value = e
      }
      // 获取总数据和id
      init()
      const withdrawData: any = ref({})
      const userInfo: any = ref({})
      async function init() {
        getWithdrawAmount({}).then((res: any) => {
          withdrawData.value = res
        })
        getMerchantAccount({}).then((res: any) => {
          userInfo.value = res
        })
      }

      return { menuData, currentKey, handleTabChange, withdrawData, userInfo }
    },
  })
</script>
<style lang="less" scoped>
  .form-wrap {
    background-color: @component-background;
    width: 450px;
    margin: 0 auto;
  }
</style>
