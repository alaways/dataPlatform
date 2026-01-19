<template>
  <div class="soonPage">
    <ATabs v-model:activeKey="currentKey">
      <ATabPane tab="线下" key="offline">
        <iframe width="100%" height="800px" src="https://admin.gsrental.cn/newAdmin/assets/index.d868d633b.js#/Order_router/OrderSoonPage?iframe=true"></iframe>
      </ATabPane>
      <ATabPane tab="线上" key="online">
        <iframe width="100%" height="800px" src="https://admin.gsrental.cn/mayiAdmin/#/Order/OrderSoon?iframe=true"></iframe>
      </ATabPane>
      <ATabPane tab="零零享用租" key="llxz">
        <Llxz />
      </ATabPane>
      <ATabPane tab="俏租机" key="qzj">
        <Qzj />
      </ATabPane>
    </ATabs>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { Tabs } from 'ant-design-vue'
  import Llxz from './llxz.vue'
  import Qzj from './qzj.vue'

  export default defineComponent({
    name: 'OrderSoonPage',
    components: {
      ATabs: Tabs,
      ATabPane: Tabs.TabPane,
      Llxz,
      Qzj,
    },
    setup() {
      const currentKey = ref('offline')
      return {
        currentKey,
      }
    },
  })
</script>
<style>
  .soonPage {
    padding: 24px;
  }
</style>

