<template>
  <PageWrapper contentBackground contentClass="">
    <template #footer>
      <ATabs v-model:activeKey="currentKey" @change="handleTabChange">
        <ATabPane v-for="item in menuData" :tab="item.tab" :key="item.key" />
      </ATabs>
    </template>
    <div>
      <component :is="currentKey" />
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { PageWrapper } from '/@/components/Page'
  import { Tabs } from 'ant-design-vue'
  import CollectionTable from './components/CollectionTable.vue'
  import PaymentTable from './components/PaymentTable.vue'
  import { useRoute } from 'vue-router'

  export default defineComponent({
    name: 'FinanceStatisticsPage',
    components: {
      PageWrapper,
      ATabs: Tabs,
      ATabPane: Tabs.TabPane,
      CollectionTable,
      PaymentTable,
    },
    setup() {
      const currentKey = ref('CollectionTable')
      const menuData = ref<any>([
        { tab: '收款汇总统计', key: 'CollectionTable' },
        { tab: '货款汇总统计', key: 'PaymentTable' },
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
