<template>
  <BaseTable :api="getOrderTest11" :api2="getOrderTest12" :columns="columns" :columns1="columns1" :searchFormSchema="searchFormSchema" />
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import BaseTable from '../baseTable/index.vue'
  import { getOrderTest11, getOrderTest12 } from '/@/api/statistics/index'
  import { columns, columns1, searchFormSchema } from './data'
  export default defineComponent({
    name: 'TotalAllPie',
    components: { BaseTable },
    setup() {
      return {
        getOrderTest11,
        columns,
        columns1,
        searchFormSchema,
        getOrderTest12,
      }
    },
  })
</script>
