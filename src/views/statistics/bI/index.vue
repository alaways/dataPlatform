<template>
  <Tabs v-model:activeKey="activeKey" class="biTabs">
    <TabPane key="online" tab="线上数据" v-if="hasPermission('onlineAdmin')">
      <Online />
    </TabPane>
    <!-- -->
    <TabPane key="onlineOrder" tab="订单统计" v-if="hasPermission('onlineOrderTotal')">
      <Order />
    </TabPane>
    <!-- <TabPane key="timeOrder" tab="时间维度" v-if="hasPermission('timerOrder')">
      <TimeOrder />
    </TabPane>
    <TabPane key="projectOrder" tab="产品类型" v-if="hasPermission('projectOrder')">
      <ProjectOrder />
    </TabPane>
    <TabPane key="channel" tab="渠道类型" v-if="hasPermission('channelOrder')">
      <ChannelOrder />
    </TabPane>
    <TabPane key="mianya" tab="免押类型" v-if="hasPermission('mianyaOrder')">
      <MianYaOrder />
    </TabPane>
    <TabPane key="taocan" tab="套餐类型" v-if="hasPermission('taocanOrder')">
      <TaocanOrder />
    </TabPane>
    <TabPane key="sex" tab="性别类型" v-if="hasPermission('sexOrder')">
      <SexOrder />
    </TabPane>
    <TabPane key="age" tab="年龄类型" v-if="hasPermission('ageOrder')">
      <AgeOrder />
    </TabPane>
    <TabPane key="level" tab="细化风险等级类型" v-if="hasPermission('levelOrder')">
      <LevelOrder />
    </TabPane>
    <TabPane key="userLevel" tab="用户等级类型" v-if="hasPermission('userLevelOrder')">
      <UserLevelOrder />
    </TabPane> -->
    <TabPane key="orderEnd" tab="订单成熟度" v-if="hasPermission('orderEnd')">
      <OrderEnd />
    </TabPane>
    <TabPane key="amountLv" tab="金额逾期率" v-if="hasPermission('amountLvOrder')">
      <AmountLv />
    </TabPane>
    
    <!-- v-if="hasPermission('vistageOrder')" -->
    <TabPane key="vintage" tab="Vintage" >
      <Vintage />
    </TabPane>
    <!-- 余额衰减表 -->
    <TabPane key="amoutchange" tab="余额衰减表" >
      <AmountChange />
    </TabPane>
    
  </Tabs>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { Tabs } from 'ant-design-vue'
  import Online from './online.vue'
  import Order from './components/order/index.vue'
  import { usePermission } from '/@/hooks/web/usePermission'
  import TimeOrder from './components/time/index.vue'
  import ProjectOrder from './components/project/index.vue'
  import ChannelOrder from './components/channel/index.vue'
  import MianYaOrder from './components/mianya/index.vue'
  import TaocanOrder from './components/taocan/index.vue'
  import SexOrder from './components/sex/index.vue'
  import AgeOrder from './components/age/index.vue'
  import LevelOrder from './components/level/index.vue'
  import UserLevelOrder from './components/userLvel/index.vue'
  import OrderEnd from './components/orderEnd/index.vue'
  import AmountLv from './components/amountLv/index.vue'
  import Vintage from './components/vintage/index.vue'
  import AmountChange from './components/amountChange/index.vue'
  const TabPane = Tabs.TabPane
  export default defineComponent({
    name: 'BIDataTotal',
    components: {
      Tabs,
      TabPane,
      Online,
      Order,
      TimeOrder,
      ProjectOrder,
      MianYaOrder,
      ChannelOrder,
      TaocanOrder,
      SexOrder,
      AgeOrder,
      LevelOrder,
      UserLevelOrder,
      OrderEnd,
      AmountLv,
      Vintage,
      AmountChange,
    },
    setup() {
      const { hasPermission } = usePermission()
      // || 'online'
      const activeKey = ref('onlineOrder')
      return {
        activeKey,
        hasPermission,
      }
    },
  })
</script>
<style lang="less">
  .loadingCont {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      margin-left: 10px;
    }
  }
  .biTabs {
    .ant-tabs-nav-wrap {
      padding-left: 24px;
    }
  }
</style>
