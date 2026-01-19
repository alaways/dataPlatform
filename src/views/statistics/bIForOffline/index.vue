<template>
  <PageWrapper title="" contentBackground>
    <template #footer>
      <ATabs v-model:activeKey="currentKey">
        <ATabPane v-for="item in menuData" :tab="item.tab" :key="item.key" />
      </ATabs>
    </template>
    <div class="m-4">
      <component v-if="menuData" :is="currentKey" />
      <Skeleton v-else :active="true" :loading="loading" :paragraph="{ rows: 16 }" />
    </div>
  </PageWrapper>
</template>

<script lang="tsx">
  import { defineComponent, ref } from 'vue'
  import { PageWrapper } from '/@/components/Page'
  import { Tabs } from 'ant-design-vue'
  import { menuList } from './data'
  import ZijinTongJi from './components/finance/index.vue'
  import YuQiTongJi from './components/slippage/index.vue'
  import OrderTongJi from './components/order/index.vue'
  import VintageTarget from './components/vintage/index.vue'
  import HomeTotal from './components/home/index.vue'
  import orderBI from './components/orderBi/index.vue'
  import orderLevel from './components/orderLevel/index.vue'
  export default defineComponent({
    name: 'OfflineStatistics',
    components: {
      PageWrapper,
      ATabs: Tabs,
      ATabPane: Tabs.TabPane,
      ZijinTongJi,
      YuQiTongJi,
      OrderTongJi,
      VintageTarget,
      HomeTotal,
      orderBI,
      orderLevel,
    },

    setup() {
      const menuData = ref<any>(menuList || [])
      const loading = ref(false)
      const currentKey = ref('orderBI' || menuList[0]?.key)
      return {
        menuData,
        currentKey,
        loading,
      }
    },
  })
</script>
