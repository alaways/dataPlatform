<template>
  <div class="box">
    <table class="table">
      <tr class="tr">
        <th
          class="cell"
          v-for="(item, index) in tableTitleColumns()"
          :key="item.key"
          :style="{ backgroundColor: colors[index] }"
        >
          <div :class="{ time: !index }">{{ item.title }}</div>
          <div v-if="item.description">{{ item.description }}</div>
        </th>
      </tr>
      <tr v-for="(item, index) in tableData" :key="index">
        <td
          class="cell"
          v-for="(its, idx) in tableTitleColumns()"
          :key="its.key"
          :style="{ backgroundColor: colors[idx] }"
        >
          {{ item[its.key] }}
        </td>
      </tr>
    </table>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import { colors, tableTitleColumns } from './data'

  defineExpose({ setTableData })

  const tableData = ref<any>([])
  function setTableData(data: any) {
    tableData.value = data
  }
</script>
<style lang="less" scoped>
  .box {
    width: 100%;
    overflow-x: scroll;
    border-right: 1px solid #d8d8d8;
    border-bottom: 1px solid #d8d8d8;
    display: block;

    .table {
      width: max-content;
      min-width: 100%;
    }

    .tr {
      white-space: nowrap;
    }

    .cell {
      padding: 10px;
      width: 150px;
      height: 60px;
      box-sizing: border-box;
      border-top: 1px solid #d8d8d8;
      border-left: 1px solid #d8d8d8;
      text-align: center;
    }

    .time {
      color: #de868f;
    }

    .txt {
      font-size: 14px;
      font-size: #333;
    }
  }
</style>
