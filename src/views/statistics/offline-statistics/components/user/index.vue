<template>
  <div class="p-3">
    <!-- <Card shadow="never">
      <div>
        <el-radio-group v-model="platformCur">
          <el-radio-button
            v-for="(item, index) in platform"
            :key="index"
            :label="item"
          />
        </el-radio-group>
      </div>
      <div class="mt-3">
        <el-radio-group v-model="channelCur">
          <el-radio-button
            v-for="(item, index) in channel"
            :key="index"
            :label="item"
          />
        </el-radio-group>
      </div>

      <div class="flex items-center mt-3">
        <el-radio-group v-model="dateTimeCur">
          <el-radio-button
            v-for="(item, index) in dateTime"
            :key="index"
            :label="item"
          />
        </el-radio-group>
        <el-date-picker
          class="ml-3"
          v-model="chooseTime"
          type="date"
          placeholder="请选择时间"
        />
      </div>
    </Card> -->

    <Card shadow="never" class="mt-3" :body-style="{ 'padding-top': 0 }">
      <!-- 用户数量、注册、实名认证、完成认证 -->
      <Row :gutter="20" class="bg-[#fff] text-[#fff]">
        <Col :span="1" />
        <Col :span="5" v-for="(item, index) in userData" :key="index">
          <div
            :style="{ 'background-color': item.color }"
            class="flex flex-col h-40 p-5 rounded-b-xl"
          >
            <div class="text-2xl">{{ item.showCount }}</div>
            <div class="flex flex-1 mt-2 text-sm">{{ item.title }}</div>
            <div class="flex items-center text-base" v-if="!index">
              <Icon icon="heroicons:arrow-trending-up" width="20px" height="20px" class="mr-3" />
              {{ item.scale }}%
            </div>
            <div class="text-base" v-else>
              <span class="mr-2 text-sm">{{ item.content }}</span>
              <span class="text-2xl">{{ item.scale }}%</span>
            </div>
          </div>
        </Col>
        <Col :span="1" />
      </Row>

      <!-- / 用户数量、注册、实名认证、完成认证 -->

      <!-- 用户统计 -->
      <Row class="mt-16" style="height: 480px">
        <Col :span="16">
          <Stacked />
        </Col>
        <Col :span="8">
          <div class="w-full h-full rounded shadow" style="border: 1px solid #f1f1f1">
            <Funnel />
          </div>
        </Col>
      </Row>
      <!-- / 用户统计 -->
    </Card>

    <Card shadow="never" class="mt-3">
      <!-- 客服评分分布 -->
      <div class="text-base font-bold" size="large">客服评分分布</div>
      <Row :gutter="16">
        <Col :span="7" v-for="(item, index) in scoreData" :key="index">
          <div class="flex flex-col h-36 p-4 rounded-xl bg-[#4d8fe5] text-[#fff] mt-3">
            <div class="mt-2 text-sm">{{ item.title }}</div>
            <div class="mt-1 mb-2 text-xl">{{ item.showCount }}</div>
            <div class="flex items-center justify-between flex-1 text-center">
              <div class="flex flex-col" v-if="item.show">
                <div>订单通过率</div>
                <div>{{ item.order }}%</div>
              </div>
              <div class="flex-1 text-xl" :class="[item.show ? 'text-end' : 'items-center']">
                占比{{ item.scale }}%
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <!-- / 客服评分分布 -->

      <Bar class="mt-10" :pdata="rankData" />
    </Card>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  // import { platform, channel, dateTime } from "../data.d";
  import { userList, scoreList } from './data.d'
  import Stacked from './components/Stacked.vue'
  import Funnel from './components/Funnel.vue'
  import Bar from './components/Bar.vue'
  import { getUserCountInfo, getUserRank } from '/@/api/statistics'
  import { Col, Row, Card } from 'ant-design-vue'
  import Icon from '/@/components/Icon/index'
  import { formatNumber } from '/@/utils/tool'

  // const userData = ref<any>();
  const scoreData = ref<any>()
  const rankData = ref<any>()
  const userData = ref<any>([])
  userData.value = userList
  init()
  async function init() {
    // 用户认证
    getUserCountInfo().then((res: any) => {
      res = res.data
      userData.value.forEach((u, i) => {
        Object.keys(res).forEach((o) => {
          if (u.key == o) {
            u.count = res[o]
            if (i != 0) {
              u.scale = ((u.count / userData.value[i - 1].count) * 100).toFixed(2)
            }
            u.showCount = formatNumber(u.count * 100 || 0)
          }
        })
      })
    })

    // 用户等级
    const res: any = await getUserRank()
    let rdata = res.data.ylist[0]
    rdata = rdata.map((v) => Number(v))
    // 获取总数
    const sum = rdata.reduce((accumulator, v) => accumulator + v, 0)
    rdata.unshift(sum)
    rankData.value = rdata
    scoreData.value = scoreList.map((v, i) => {
      v.count = rdata[i + 1]
      v.scale = Number(((rdata[i + 1] / sum) * 100).toFixed(2))
      v.showCount = formatNumber(v.count * 100 || 0)
      return v
    })
  }
  // const platformCur = ref<string>("全平台");
  // const channelCur = ref<string>("全渠道");
  // // const dateTimeCur = ref<string>("过去7天");
  // const dateTimeCur = ref<string>("全部");
  // const chooseTime = ref();
</script>
