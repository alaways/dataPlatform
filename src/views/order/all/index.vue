<template>
  <div class="taskCont">
    <Tabs v-model:activeKey="activeKey" class="biTabs">
      <TabPane key="offlineOrder" tab="线下">
        <Offline dataSource="xx" />
      </TabPane>
      <TabPane key="onlineOrder" tab="线上">
        <Online dataSource="xs" />
      </TabPane>
      <!-- <TabPane key="llx" tab="零零享">
        <LLXZ dataSource="llx" />
      </TabPane>
      <TabPane key="rrz" tab="人人租">
        <RRZ dataSource="rrz" />
      </TabPane>
      <TabPane key="store" tab="商城">
        <Store dataSource="store" />
      </TabPane> -->
    </Tabs>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { Tabs } from 'ant-design-vue'
  import Offline from './offline.vue'
  import Online from './online.vue'
  import LLXZ from './llxz.vue'
  import RRZ from './rrz.vue'
  import Store from './store.vue'
  import { usePermission } from '/@/hooks/web/usePermission'
  const TabPane = Tabs.TabPane
  export default defineComponent({
    name: 'OrderListPage',
    components: {
      Tabs,
      TabPane,
      Online,
      Offline,
      LLXZ,
      RRZ,
      Store,
    },
    setup() {
      const activeKey = ref('offlineOrder')
      const { hasPermission } = usePermission()
      setTimeout(() => {
        // 使用querySelector选择元素
        var myDiv = document.querySelector('.taskCont .ant-tabs-top .ant-tabs-nav')
        // 修改样式
        if (myDiv) {
          myDiv.style.padding = '0 24px'
          myDiv.style.margin = '0'
        }
      }, 1000)
      return {
        activeKey,
        hasPermission,
      }
    },
  })
</script>

<style lang="less" scoped>
  .biTabs {
    .ant-tabs-nav-wrap {
      padding-left: 24px;
    }
  }
</style>
