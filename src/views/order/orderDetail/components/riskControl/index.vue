<template>
  <div>
    <Description
      size="middle"
      title="风控信息"
      :bordered="false"
      :column="4"
      :data="riskInfo"
      :schema="riskSchema"
    />
    <BasicTable @register="registerRefundTable" />
    <!-- <Description
      class="mt-5"
      size="middle"
      :bordered="false"
      :column="1"
      :data="riskInfo"
      :schema="esSchema"
    /> -->
    <!-- <a-divider /> -->
    <div class="mt-6"></div>
    <div v-for="(item, index) in riskControlData" :key="index">
      <template v-if="!item.hide">
        <div class="title mb-2">
          <!-- <div class="hr"></div>
        <div class="text-base">{{ item.name }}</div> -->
          <div class="hrs"></div>
          <div class="name">{{ item.name }}</div>
          <div class="hrs"></div>
        </div>

        <template v-if="item.title == '法院信息详情'">
          <PersonalDetails v-if="CourtDetailPro && CourtDetailPro.length" :pdata="CourtDetailPro" />
          <div v-else class="mb-6">无相关信息</div>
        </template>

        <template v-if="item.title == '限高明细'">
          <ExecutionTable v-if="ExecutionXg && ExecutionXg.length" :pdata="ExecutionXg" />
          <div v-else class="mb-6">无相关信息</div>
        </template>

        <template v-else-if="item.title == '失信明细'">
          <ExecutionTable v-if="ExecutionSx && ExecutionSx.length" :pdata="ExecutionSx" />
          <div v-else class="mb-6">无相关信息</div>
        </template>

        <template v-else-if="item.title == '法院裁判文书'">
          <JudgmentDocumentsTable
            v-if="ExecutionJud && ExecutionJud.length"
            :pdata="ExecutionJud"
          />
          <div v-else class="mb-6">无相关信息</div>
        </template>

        <template v-else-if="item.title == '反欺诈规则'">
          <AntiFraudUserTable v-if="AntiFraudUser && AntiFraudUser.length" :pdata="AntiFraudUser" />
          <div v-else class="mb-6">无相关信息</div>
        </template>

        <template v-else-if="item.title == '法院被执行人—高级版'">
          <ExecutionProTable v-if="ExecutionPro && ExecutionPro.length" :pdata="ExecutionPro" />
          <div v-else class="mb-6">无相关信息</div>
        </template>

        <template v-else-if="item.name == '逾期报告'">
          <SlippageTable :pdata="riskControlData" />
        </template>

        <template v-else-if="item.name == '行为报告'">
          <BehaviorTable :pdata="riskControlData" />
          <CommonTable class="mt-6" :list="item.children" :span="item.span" />
        </template>

        <template v-else-if="item.name == '借贷多头'">
          <BullBorrowTable title="身份证命中" name="借贷多头" :pdata="BullBorrow" />

          <BullBorrowTable class="mt-3" title="手机号命中" name="借贷多头" :pdata="BullBorrow" />
        </template>

        <template v-else-if="item.name == '当天借贷多头'">
          <BehaviorTable :pdata="riskControlData" />
        </template>

        <template v-else-if="item.name == '租赁多头'">
          <BullBorrowTable title="身份证命中" name="租赁多头" :pdata="BullLease" />

          <BullBorrowTable class="mt-3" title="手机号命中" name="租赁多头" :pdata="BullLease" />
        </template>

        <!-- 其他表格数据 -->
        <template v-else>
          <CommonTable :list="item.children" :span="item.span" />
        </template>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { Description } from '/@/components/Description/index'
  import { BasicTable, useTable } from '/@/components/Table'
  import { Divider } from 'ant-design-vue'
  import { esSchema, tableSchema, riskSchema, riskControlList } from './data'
  import { getRiskMap } from '/@/api/riskControl'
  import {
    handleBaiRong,
    handleBaiRongBullBorrow,
    handleBaiRongBullLease,
    handleBaiRongCourtDetailPro,
    handleBaiRongExecution,
    handleBaiRongExecutionJud,
    handleBaiRongExecutionPro,
    handleBaiRongRule,
    handleExecution,
    handleXinYan,
    handleXinYanBehavior,
    handleXinYuDian2,
    handleXinYuDian3,
  } from './handle'
  import ExecutionTable from './components/ExecutionTable.vue'
  import CommonTable from './components/CommonTable.vue'
  import SlippageTable from './components/SlippageTable.vue'
  import BehaviorTable from './components/BehaviorTable.vue'
  import AntiFraudUserTable from './components/AntiFraudUserTable.vue'
  import ExecutionProTable from './components/ExecutionProTable.vue'
  import JudgmentDocumentsTable from './components/JudgmentDocumentsTable.vue'
  import PersonalDetails from './components/PersonalDetails.vue'
  import BullBorrowTable from './components/BullBorrowTable.vue'
  import { cloneDeep } from 'lodash-es'

  const props = {
    detailInfo: { type: Object },
  }

  export default defineComponent({
    components: {
      Description,
      BasicTable,
      [Divider.name]: Divider,
      ExecutionTable,
      CommonTable,
      SlippageTable,
      BehaviorTable,
      AntiFraudUserTable,
      ExecutionProTable,
      JudgmentDocumentsTable,
      PersonalDetails,
      BullBorrowTable,
    },
    props,
    setup(props) {
      /**
       * 表格整体数据
       * 放js文件中有缓存
       */
      let riskControlData: any = []
      riskControlData = cloneDeep(riskControlList)

      const detailInfo: any = ref(props.detailInfo)
      const riskInfo = ref<any>({})
      const ruleTableData = ref<any>([])
      const riskMaps = ref<any>({})
      // 用户基本信息
      riskInfo.value = detailInfo.value?.riskVO
      // 兼容订单详情的字段
      if (!riskInfo.value.riskProposalStatus) {
        riskInfo.value.riskProposalStatus = detailInfo.value?.riskProposalStatus
      }

      // 风控规则
      ruleTableData.value =
        riskInfo.value?.rsRejectCodeList.map((m) => {
          return {
            rejectCodeToStr: m,
          }
        }) || []

      const [registerRefundTable] = useTable({
        title: '',
        dataSource: ruleTableData,
        columns: tableSchema,
        pagination: false,
      })

      getRiskMaps()
      async function getRiskMaps() {
        riskMaps.value = await getRiskMap()
      }

      /**
       * 处理新颜数据
       */
      handleXinYan(riskInfo.value, riskControlData)

      /**
       * 处理新颜探针C数据
       */
      handleXinYanBehavior(riskInfo.value, riskControlData)

      /**
       * 处理百融数据
       */
      handleBaiRong(riskInfo.value, riskControlData)

      /**
       * 处理小雨点数据2
       */
      handleXinYuDian2(riskInfo.value, riskControlData)
      /**
       * 处理小雨点数据3
       */
      handleXinYuDian3(riskInfo.value, riskControlData)

      /**
       * 处理 百融 - 法院 数据
       */
      const ExecutionXg = ref() // 法院限高
      const ExecutionSx = ref() // 法院失信
      const ExecutionData = handleExecution(riskInfo.value)
      ExecutionXg.value = ExecutionData.xg // 限高明细
      ExecutionSx.value = ExecutionData.sx // 失信人明细

      /**
       * 处理百融数据 - 非银类型 数据
       */
      handleBaiRongRule(riskInfo.value, riskControlData)

      /**
       * 处理百融数据 - 法院信息详情-个人高级版
       */
      const CourtDetailPro = ref()
      CourtDetailPro.value = handleBaiRongCourtDetailPro(riskInfo.value)

      /**
       * 处理百融数据 - 法院裁判文书
       */
      const ExecutionJud = ref()
      ExecutionJud.value = handleBaiRongExecutionJud(riskInfo.value)

      /**
       * 处理百融数据 - 反欺诈规则-法院被执行人
       */
      const AntiFraudUser = ref()
      AntiFraudUser.value = handleBaiRongExecution(riskInfo.value)

      /**
       * 处理百融数据 - 法院被执行人—高级版
       */
      const ExecutionPro = ref()
      ExecutionPro.value = handleBaiRongExecutionPro(riskInfo.value)

      /**
       * 处理百融数据 - 借贷多头
       */
      const BullBorrow = ref()
      BullBorrow.value = handleBaiRongBullBorrow(riskInfo.value)

      // /**
      //  * 处理百融数据 - 当天借贷多头 -暂无
      //  */
      //  const ExecutionPro = ref()
      // ExecutionPro.value = handleBaiRongExecutionPro(riskInfo.value)

      /**
       * 处理百融数据 - 租赁多头
       */
      const BullLease = ref()
      BullLease.value = handleBaiRongBullLease(riskInfo.value)

      return {
        registerRefundTable,
        esSchema,
        riskSchema,
        riskInfo,
        detailInfo,
        riskControlData,
        riskMaps,
        ExecutionXg,
        ExecutionSx,
        ExecutionJud,
        ExecutionPro,
        AntiFraudUser,
        CourtDetailPro,
        BullBorrow,
        BullLease,
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
