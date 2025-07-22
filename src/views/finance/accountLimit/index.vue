<template>
  <PageWrapper contentBackground contentClass="p-4">
    <template #footer>
      <ATabs v-model:activeKey="currentKey" @change="handleTabChange">
        <ATabPane v-for="item in menuData" :tab="item.tab" :key="item.key" />
      </ATabs>
    </template>
    <div class="m-4">
      <component :is="currentKey" />
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { PageWrapper } from '/@/components/Page'
  import { Tabs } from 'ant-design-vue'
  import AvailableBalanceTable from './AvailableBalanceTable.vue'
  import UsageAmountTable from './UsageAmountTable.vue'
  import { useRoute } from 'vue-router'

  export default defineComponent({
    name: 'FinanceAccountPage',
    components: {
      PageWrapper,
      ATabs: Tabs,
      ATabPane: Tabs.TabPane,
      AvailableBalanceTable,
      UsageAmountTable,
    },
    setup() {
      const currentKey = ref('AvailableBalanceTable')
      const menuData = ref<any>([
        { tab: '账户充值记录', key: 'AvailableBalanceTable' },
        { tab: '已使用额度', key: 'UsageAmountTable' },
      ])

      const { query } = useRoute()
      if (query && query.type) {
        currentKey.value = String(query.type)
      }

      function handleTabChange(e) {
        currentKey.value = e
      }

      return { menuData, currentKey, handleTabChange }
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
