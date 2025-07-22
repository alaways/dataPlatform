<template>
  <Select
    ref="selectRef"
    :open="open"
    allowClear
    :options="options"
    @focus="() => (open = true)"
    @blur="handleBlur"
    @change="handleChange"
  >
    <template #dropdownRender>
      <div class="box">
        <div class="days">
          <div class="left">
            <div class="title" v-for="item in header" :key="item">{{ item }}</div>
          </div>
          <div class="right">
            <div
              v-for="(item, index) in list"
              :key="item"
              class="txt"
              :class="{ active: dIndex == index }"
              @click="handleDateSelect(index)"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <Divider style="margin: 10px 3px 3px" />
        <div class="title">自定义</div>
        <RangePicker
          v-model:value="dateArr"
          allowClear
          valueFormat="YYYY-MM-DD"
          @focus="() => (open = true)"
          @blur="() => (open = true)"
          @openChange="handleDateOpen"
          @change="handleDateChange"
          :placeholder="['开始日期', '结束日期']"
        />
        <Divider style="margin: 10px 3px 8px" />
        <Button class="footer" type="primary">确认</Button>
      </div>
    </template>
  </Select>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { DatePicker, Divider, Select, Button } from 'ant-design-vue'
  import { handleDatePickerSelect } from '../helper'

  export default defineComponent({
    name: 'DatePickerSelect',
    components: {
      Select,
      Divider,
      Button,
      RangePicker: DatePicker.RangePicker,
    },
    emits: ['options-change', 'change'],
    setup(_, { emit }) {
      const options = ref<any>([])
      const selectRef = ref()
      const open = ref(false)
      const dateOpen = ref(false)
      const dIndex = ref(-1)
      const dateArr = ref([])
      const header = ['天', '周', '月', '季度', '年度']
      const list = [
        '今天',
        '昨天',
        '明天',
        '本周',
        '上周',
        '下周',
        '本月',
        '上月',
        '下月',
        '本季度',
        '上一季度',
        '下一季度',
        '本年度',
        '上一年度',
        '下一年度',
      ]

      // 注意，select 的 value 只是接受 string/number不接受数组
      // 所以 change 后，要使用要转成数组
      function handleSubmit() {
        let label = ''
        if (dIndex.value == -1) {
          label = dateArr.value.join('~')
          if (!label) return
          const find = options.value.find((v) => v.value == label)
          if (!find) {
            options.value.push({ label, value: label })
          }
          emit('change', label)
        } else {
          const label = list[dIndex.value]
          const value = handleDatePickerSelect(list[dIndex.value])
          const find = options.value.find((v) => v.value == value)
          if (!find) {
            options.value.push({ label, value })
          }
          emit('change', value)
        }
      }

      function handleDateChange() {
        dIndex.value = -1
      }

      function handleChange(e) {
        if (!e) {
          dIndex.value = -1
          dateArr.value = []
          open.value = false
          dateOpen.value = false
          emit('change', '')
          handleBlur(1)
        }
      }

      // 选择
      function handleDateSelect(index) {
        dIndex.value = index
        dateArr.value = []
      }

      // 处理失焦
      function handleBlur(active) {
        if (dateOpen.value) return
        open.value = false
        if (active != 1) {
          handleSubmit()
        }
      }

      // 监听打开日期
      function handleDateOpen(e) {
        dateOpen.value = e
        if (!e) {
          selectRef.value.focus()
        }
      }

      return {
        open,
        dIndex,
        header,
        list,
        options,
        dateArr,
        selectRef,
        handleBlur,
        handleDateSelect,
        handleDateChange,
        handleDateOpen,
        handleSubmit,
        handleChange,
      }
    },
  })
</script>

<style lang="less" scoped>
  ::v-deep(.ant-select-dropdown) {
    width: 330px !important;
    min-width: auto !important;
  }

  .box {
    width: 330px;
    display: flex;
    flex-direction: column;
    padding: 10px 15px;
    border-radius: 6px;
    background-color: #fff;
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 9px 28px 8px rgba(0, 0, 0, 0.05);

    .title {
      line-height: 30px;
      font-size: 12px;
      color: #777;
    }

    .days {
      display: flex;
      flex-direction: row;

      .left {
        width: 20%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .right {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        flex: 1;

        .txt {
          width: 30%;
          text-align: center;
          line-height: 30px;
          font-size: 14px;
          color: #344562;
          cursor: pointer;
        }

        .active {
          background-color: #344562;
          color: #fff;
          height: 30px;
          border-radius: 6px;
        }
      }
    }

    .footer {
      height: 30px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      background: #4190f7;
      color: #fff;
      border-radius: 5px;
    }
  }
</style>
