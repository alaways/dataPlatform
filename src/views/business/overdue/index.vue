<template>
  <PageWrapper title="" contentBackground>
    <template #footer>
      <ATabs v-model:activeKey="currentKey" @change="handleTabs">
        <ATabPane v-for="item in menuData" :key="item.key" :tab="item.tab" />
      </ATabs>
    </template>
    <component
      v-for="item in componentsList"
      :key="item"
      v-show="item == currentKey"
      :is="item"
      :currentKey="item"
    />
  </PageWrapper>
</template>
<script lang="ts">
  import { Tabs } from 'ant-design-vue'
  import { defineComponent, ref } from 'vue'

  import { PageWrapper } from '/@/components/Page'
  import SalespersonTable from './salespersonTable.vue'
  import StoreTable from './storeTable.vue'
  import OrderTable from './orderTable.vue'
  import CityTable from './CityTable.vue'
  import ProvinceTable from './ProvinceTable.vue'

  export default defineComponent({
    name: 'BusinessOverduePage',
    components: {
      PageWrapper,
      ATabs: Tabs,
      ATabPane: Tabs.TabPane,
      SalespersonTable,
      CityTable,
      ProvinceTable,
      StoreTable,
      OrderTable,
    },
    setup() {
      const currentKey = ref('SalespersonTable') // 菜单key
      const componentsList = ref(['SalespersonTable'])
      const menuData = [
        {
          tab: '业务员统计',
          key: 'SalespersonTable', // 对应组件名
        },
        {
          tab: '门店统计',
          key: 'StoreTable', // 对应组件名
        },
        {
          tab: '市统计汇总',
          key: 'CityTable', // 对应组件名
        },
        {
          tab: '省统计汇总',
          key: 'ProvinceTable', // 对应组件名
        },
        {
          tab: '订单汇总',
          key: 'OrderTable', // 对应组件名
        },
      ]

      function handleTabs(e) {
        if (!componentsList.value.includes(e)) {
          componentsList.value.push(e)
          console.log(componentsList.value)
        }
      }
      return {
        currentKey,
        menuData,
        componentsList,
        handleTabs,
      }
    },
  })
</script>
