<template>
  <PageWrapper title="数据总览" contentBackground>
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
  // import ForWaiTotal from './components/forWaiTotalPage/index.vue'
  import ZijinTongJi from './components/finance/index.vue'
  import YuQiTongJi from './components/slippage/index.vue'
  import YunYingTongJi from './components/operation/index.vue'
  import OrderTongJi from './components/order/index.vue'
  import UserTongJi from './components/user/index.vue'
  import VintageTarget from './components/vintage/index.vue'
  import HomeTotal from './components/home/index.vue'
  export default defineComponent({
    name: 'OfflineStatistics',
    components: {
      PageWrapper,
      ATabs: Tabs,
      ATabPane: Tabs.TabPane,
      // ForWaiTotal,
      ZijinTongJi,
      YuQiTongJi,
      YunYingTongJi,
      OrderTongJi,
      UserTongJi,
      VintageTarget,
      HomeTotal,
    },

    setup() {
      // 此处可以得到用户ID
      const menuData = ref<any>(menuList || [])
      console.log(menuData, 'menuDataShow')
      const loading = ref(false)
      const currentKey = ref(menuList[0].key)
      return {
        menuData,
        currentKey,
        loading,
      }
    },
  })
</script>

<style lang="less" scoped>
  .floatButton {
    position: fixed;
    cursor: pointer;
    bottom: 200px;
    right: 100px;
    z-index: 10;
    border: 1px solid #f0f0f0;
    background: #fff;
    box-shadow: 3px 5px 5px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    min-height: 40px;
    min-width: 40px;
    padding: 0;

    .floatItem {
      height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #f0f0f0;
      padding: 0 10px;

      div {
        margin-left: 6px;
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }
</style>
