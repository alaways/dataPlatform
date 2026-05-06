<template>
  <div class="sippageOrder">
    <ATabs v-model:activeKey="currentKey">
      <ATabPane tab="线下" key="offline">
        <iframe
          width="100%"
          height="800px"
          src="https://admin.gsrental.cn/newAdmin/assets/index.d868d603b.js#/Order_router/OrderSlippagePage?iframe=true"
        ></iframe>
      </ATabPane>
      <ATabPane tab="线上" key="online">
        <iframe
          width="100%"
          height="800px"
          src="https://admin.gsrental.cn/mayiAdmin/#/Order/OrderSlippage?iframe=true"
        ></iframe>
      </ATabPane>
      <ATabPane tab="零零享" key="llxz">
        <Llxs />
      </ATabPane>
      <ATabPane tab="俏租机" key="qzj">
        <Qzj />
      </ATabPane>
      <!-- 新增得 还未对接 -->
      <!-- <ATabPane tab="人人租" key="Rrz">
        <Rrz />
      </ATabPane>
      <ATabPane tab="商城" key="Store">
        <Store />
      </ATabPane> -->
    </ATabs>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { Tabs } from 'ant-design-vue'
  import Llxs from './llxs.vue'
  import Qzj from './qzj.vue'
  import Store from './Store.vue'
  import Rrz from './Rrz.vue'
  export default defineComponent({
    name: 'OrderSlippagePage',
    components: {
      ATabs: Tabs,
      ATabPane: Tabs.TabPane,
      Llxs,
      Qzj,
      Store,
      Rrz,
    },
    setup() {
      const currentKey = ref('offline')

      return {
        currentKey,
      }
    },
  })
</script>

<style lang="less" scoped>
  .sippageOrder {
    width: 100%;
    height: 100%;
    padding: 24px;
    .ant-tabs-content {
      display: block !important;
    }
  }
</style>
