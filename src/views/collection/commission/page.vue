<template>
  <div class="taskCont">
    <ATabs v-model:activeKey="currentKey">
      <ATabPane tab="线下" key="offline">
        <Offline />
      </ATabPane>
      <ATabPane tab="线上" key="online">
        <Online />
        <!--  -->
      </ATabPane>
    </ATabs>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import Online from './online.vue'
  import Offline from './offline.vue'
  import { Tabs } from 'ant-design-vue'
  export default defineComponent({
    name: 'CollectionSetting',
    components: { ATabs: Tabs, ATabPane: Tabs.TabPane, Online, Offline },
    setup() {
      const currentKey = ref('offline')
      setTimeout(() => {
        // 使用querySelector选择元素
        var myDiv = document.querySelector('.taskCont .ant-tabs-top .ant-tabs-nav')
        // 修改样式
        if (myDiv) {
          myDiv.style.padding = '0 24px'
          myDiv.style.margin = '0'
        }
      }, 1000)
      return { currentKey }
    },
  })
</script>
