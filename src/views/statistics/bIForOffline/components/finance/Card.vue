<template>
  <Card
    shadow="never"
    :body-style="{ padding: '12px 12px 12px 12px' }"
    style="background-color: rgb(251 251 251); border: none"
  >
    <div class="flex items-center">
      <div class="text-base">{{ pdata.name }}</div>
      <Tooltip placement="bottom" class="ml-3" v-if="pdata.tooltip">
        <template #title>{{ pdata.tooltip }}</template>
        <InfoCircleOutlined :style="{ color: '#999', fontSize: '17px' }" />
      </Tooltip>
    </div>

    <div
      class="flex items-center justify-center h-20 text-3xl font-semibold"
      style="word-break: break-all"
    >
      {{ pdata?.type != 4 ? '￥' : null }}
      {{ pdata.value }}
      {{ pdata?.type == 4 ? '%' : null }}
    </div>
    <div class="flex flex-col items-center justify-center" style="height: 40px"></div>
    <!-- <component :is="temps" />   -->

    <!-- 显示-比上周增 -->
    <!-- <template v-if="temps == 'template1'">
      <div class="flex flex-col items-end justify-center" style="height: 80px">
        <div class="text-center">
          <div class="text-sm text-semibold text-[#67C23A]"> {{ item.scale }}% </div>
          <div class="mt-2 text-xs">{{ item.content }}</div>
        </div>
      </div>
    </template> -->

    <!-- 显示-进度条 -->
    <!-- <template v-else-if="temps == 'template2'">
      <div class="flex items-center justify-end" style="height: 80px">
        <div class="mr-3 text-xs">{{ item.content }}</div>
        <el-progress
          width="80"
          color="#67C23A"
          type="circle"
          :percentage="item.scale"
          :stroke-width="14"
        />
      </div>
    </template> -->

    <!-- 显示-坏账率 -->
    <!-- <template v-else>
      <div class="flex flex-col items-center justify-center" style="height: 80px">
        <div class="flex flex-col items-center justify-center bg-red-600 w-20 h-20 text-[#fff]">
          <div class="text-xl font-semibold">{{ item.scale }}%</div>
          <div class="text-sm">{{ item.content }}</div>
        </div>
      </div>
    </template> -->
  </Card>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { Card, Tooltip } from 'ant-design-vue'
  import { InfoCircleOutlined } from '@ant-design/icons-vue'

  type itemType = {
    name: string
    content: string
    value: number
    scale: number
    type: number
    tooltip: number
  }

  const props = defineProps<{
    item: itemType
  }>()

  const pdata = ref(props.item)
  // const temps = `template${pdata.value.type}`
</script>
