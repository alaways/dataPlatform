<template>
  <Tooltip
    trigger="click"
    overlayClassName="expiredBillsTableTooltip"
    placement="bottom"
    class="ml-3"
  >
    <template #title>
      <div>
        <div>每日0点统计前一天的到期账单还款情况。</div>
        <div class="mt-3">取值口径：</div>

        <div class="mt-3">
          1、 当天到期账单【即：第3期及以上】 取值：剔除第2期到期账单，统计第3期及以上账单
        </div>
        <div>2、当天到期账单【即：第2期账单】取值：仅统计第2期到期账单 </div>
        <div>3、需区分「当天还款」（取值：到期当天内还款的数据） </div>
        <div>4、需区分「提前还款」（取值：提前还款，根据支付记录时间取值区分） </div>
        <div>
          5、剔除首付已还金额 例：总期数12期，首付已还2.4期，在第11期到期时，应还0.6期，
          即：已还账单金额取值该0.6期的账单金额；
          <div>
            已到期账单金额取值该0.6期的账单金额 已到期账单数取整；已还账单数（部分）取值归到部分内
          </div>
        </div>
        <div>6、剔除罚金 </div>

        <div class="mt-3">字段定义：</div>
        <div>已到期账单数：取当天已到期账单数量 </div>
        <div>已到期账单数（整单）：取当天已还账单「整单」还款的数量</div>
        <div>已到期账单数（部分）：取当天已还账单「部分」还款的数量</div>
        <div>账单还款率：到期已还账单数（取当天已还账单「整单」还款的数量）/当天已到期账单数量</div>

        <div class="mt-3">已到期账单金额：取当天已到期账单金额</div>
        <div>已到期账单金额（整单+部分）：取当天已还账单「整单+部分」还款金额</div>
        <div>
          金额还款率：到期已还账单金额（取当天已还账单「整单+部分」还款金额）/当天已到期账单金额
        </div>

        <div class="mt-3">
          用户主动还款账单：取用户主动还款的（注：整单+部分）账单数量（根据是否带有跟进人进行区分；即：无跟进人）
        </div>
        <div>
          用户主动还款金额：取用户主动还款的（注：整单+部分）账单金额（根据是否带有跟进人进行区分；即：无跟进人）
        </div>
        <div>
          催收还款账单：取催收还款的（注：整单+部分）账单数量（根据是否带有跟进人进行区分；即：有跟进人）
        </div>
        <div>
          催收还款金额：取催收还款的（注：整单+部分）账单金额（根据是否带有跟进人进行区分；即：有跟进人）
        </div>

        <div class="mt-3"> 计算公式： </div>
        <div> 当天还款 </div>
        <div> ① 账单还款率 = 到期已还账单数（取当天还款数据「整单」）/到期账单数 </div>
        <div> ② 金额还款率 = 到期已还账单金额（取当天还款数据「整单+部分」）/到期账单金额 </div>
        <div> 提前还款 </div>
        <div> ① 账单还款率 = 到期已还账单数（取提前还款数据「整单」）/到期账单数 </div>
        <div> ② 金额还款率 = 到期已还账单金额（取提前还款数据「整单+部分」）/到期账单金额 </div>

        <div class="mt-3"> 合计说明： </div>
        <div> ①已到期账单数=当天还款+提前还款 </div>
        <div> ②已还账单数（整单）=当天还款+提前还款 </div>
        <div> ③已还账单数（部分）=当天还款+提前还款 </div>
        <div> ④账单还款率=②/① 后面合计以此类推 </div>
        <div> ⑤已还账单金额（取提前还款数据「整单+部分」）=当天还款金额+提前还款金额 </div>
        <div> ⑥账单金额还款率=已还账单金额（取提前还款数据「整单+部分」）/已到期账单金额</div>
      </div>
    </template>
    <InfoCircleOutlined :style="{ color: '#999', fontSize: '17px' }" />
  </Tooltip>
</template>

<script setup lang="ts">
  import { InfoCircleOutlined } from '@ant-design/icons-vue'
  import { Tooltip } from 'ant-design-vue'
</script>

<style lang="less">
  .expiredBillsTableTooltip {
    .ant-tooltip-content {
      .ant-tooltip-inner {
        width: 850px !important;
      }
    }
  }
</style>
