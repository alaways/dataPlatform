<template>
  <PageWrapper contentBackground contentClass="p-0 m-0" title="Vintage数据指标">
    <template #footer>
      <ATabs v-model:activeKey="currentKey">
        <ATabPane v-for="item in menuData" :tab="item.tab" :key="item.key" />
      </ATabs>
    </template>
    <component :is="`Table${currentKey}`" :currentKey="currentKey" />
    <p class="p-5 text-base">
      说明： <br />
      1.统计时点: MOB1(第一个账单日所在月月末);MOB2(第二个账单日所在月月末)以此类推<br />
      2.上述表格分别按照月末逾期状态3+/30+/60+/90+,金额口径和订单口径统计,共6张表<br />
      3.金额口径分子：剩余租金 + 买断价 金额口径分母: 总租金 + 买断价<br />
      4.订单口径分子：满足逾期条件订单数；订单口径分母：总订单数<br />
    </p>

    <div class="mt-3">
      <SummaryTable search />
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { computed, defineComponent, ref } from 'vue'
  import { PageWrapper } from '/@/components/Page'
  import { Tabs } from 'ant-design-vue'
  import Table1 from './Table.vue'
  import Table2 from './TableAmount.vue'
  import SummaryTable from '../slippage/summaryTable/index.vue'

  export default defineComponent({
    name: 'Vintage',
    components: {
      PageWrapper,
      ATabs: Tabs,
      ATabPane: Tabs.TabPane,
      Table1,
      Table2,
      SummaryTable,
    },
    setup() {
      const currentKey = ref('1')
      const menuData = ref<any>([
        { tab: '订单', key: '1' },
        { tab: '金额', key: '2' },
      ])

      const content = computed(() => {
        if (currentKey.value == '1') {
          return '提示: 逾期订单数 / 总订单数'
        } else {
          return '提示: 逾期金额 / 总订单租金'
        }
      })

      return { menuData, currentKey, content }
    },
  })
</script>
<style lang="less" scoped>
  ::v-deep(.vben-page-wrapper-content) {
    margin: 10px !important;
  }
</style>
