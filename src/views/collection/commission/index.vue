<template>
  <ATabs v-model:activeKey="currentKey">
    <ATabPane tab="线下" key="offline">
      <Offline />
    </ATabPane>
    <ATabPane tab="线上" key="online">
      <Online />
      <!--  -->
    </ATabPane>
  </ATabs>
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
      return { currentKey }
    },
  })
</script>
