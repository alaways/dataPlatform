<template>
  <PageWrapper contentBackground contentClass="p-4">
    <template #footer>
      <ATabs v-model:activeKey="currentKey" @change="handleTabChange">
        <ATabPane v-for="item in menuData" :tab="item.tab" :key="item.key" />
      </ATabs>
    </template>
    <div>
      <component :is="currentKey" :currentDataSource="currentDataSource"/>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { PageWrapper } from '/@/components/Page'
  import { Tabs } from 'ant-design-vue'
  import CommissionSetting from './components/CommissionSetting.vue'
  import CommissionSettingNew from './components/CommissionSettingNew/index.vue'
  import ExpireSetting from './components/ExpireSetting.vue'
  import RuleSetting from './components/RuleSetting.vue'
  import RuleSettingNew from './components/RuleSettingNew/index.vue'
  import { useRoute } from 'vue-router'

  export default defineComponent({
    name: 'CollectionCommissionPage',
    components: {
      PageWrapper,
      ATabs: Tabs,
      ATabPane: Tabs.TabPane,
      CommissionSetting,
      CommissionSettingNew,
      ExpireSetting,
      RuleSetting,
      RuleSettingNew,
    },
    setup() {
      const currentKey = ref('CommissionSettingNew')
      const menuData = ref<any>([
        { tab: '催收提成设置', key: 'CommissionSettingNew' },
        { tab: '规则设置', key: 'RuleSettingNew' },
      ])
      const currentDataSource = ref()
      const { query } = useRoute()
      if (query && query.type) {
        currentKey.value = String(query.type)
      }
      if (query && query.dataSources) {
        currentDataSource.value = String(query.dataSources)
      }
      function handleTabChange(e) {
        currentKey.value = e
      }

      return { menuData, currentKey, handleTabChange, currentDataSource }
    },
  })
</script>
