<template>
  <div>
    <Description
      size="middle"
      title="风控信息"
      :bordered="false"
      :column="3"
      :data="baseInfo"
      :schema="riskSchema"
    />
    <div class="mt-6"></div>
    <div v-for="(item, index) in riskControlData" :key="index">
      <template v-if="!item.hide">
        <div class="title mb-2">
          <div class="hrs"></div>
          <div class="name">{{ item.name }}</div>
          <div class="hrs"></div>
        </div>

        <template v-if="item.name == '逾期报告'">
          <SlippageTable :pdata="riskControlData" />
        </template>

        <template v-else-if="item.name == '行为报告'">
          <BehaviorTable :pdata="riskControlData" />
          <CommonTable class="mt-6" :list="item.children" :span="item.span" />
        </template>

        <template v-else-if="item.name == '租机行为报告'">
          <BehaviorRentTable :pdata="riskControlData" />
          <CommonTable class="mt-6" :list="item.children" :span="item.span" />
        </template>

        <template v-else-if="item.name == '法院信息-个人'">
          <ExecutionTable :pdata="item.children" />
          <CommonTable class="mt-6" :list="item.children" :span="item.span" />
        </template>

        <template v-else>
          <CommonTable :list="item.children" :span="item.span" />
        </template>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { riskSchema, riskControlList } from './data'
  import { handleNewData } from './handle'
  import { cloneDeep } from 'lodash-es'
  import CommonTable from './components/CommonTable.vue'
  import SlippageTable from './components/SlippageTable.vue'
  import BehaviorTable from './components/BehaviorTable.vue'
  import BehaviorRentTable from './components/BehaviorRentTable.vue'
  import ExecutionTable from './components/ExecutionTable.vue'
  import { Description } from '/@/components/Description/index'

  const props = {
    detailInfo: { type: Object },
  }

  export default defineComponent({
    name: '随心系风控',
    components: {
      Description,
      CommonTable,
      SlippageTable,
      BehaviorTable,
      BehaviorRentTable,
      ExecutionTable,
    },
    props,
    setup(props) {
      /**
       * 表格整体数据
       * 放js文件中有缓存
       */
      let riskControlData: any = ref([])
      riskControlData = cloneDeep(riskControlList)

      const detailInfo: any = ref(props.detailInfo)

      const baseInfo = handleNewData(props.detailInfo, riskControlData)

      handleNewData(props.detailInfo, riskControlData, 'reports')

      return {
        detailInfo,
        riskSchema,
        riskControlData,
        baseInfo,
      }
    },
  })
</script>
<style lang="less" scoped>
  .desc-wrap {
    padding: 16px;
    background-color: @component-background;
  }

  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 30px 0 20px;

    .hr {
      width: 5px;
      height: 15px;
      margin-right: 5px;
      background-color: #528eda;
      border-radius: 4px;
    }

    .hrs {
      height: 1px;
      background-color: #e8e8e8;
      flex: 1;
    }

    .name {
      width: 300px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
    }
  }

  .box {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    min-height: 50px;
  }

  .bg {
    background: #dce9f8;
  }
</style>
