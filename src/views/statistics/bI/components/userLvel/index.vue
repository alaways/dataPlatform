<template>
  <BaseTable :api="getOrderTest09" :columns="columns" :searchFormSchema="searchFormSchema" />
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import BaseTable from '../baseTable/index.vue'
  import { getOrderTest09 } from '/@/api/statistics/index'
  import { columns, searchFormSchema } from './data'
  export default defineComponent({
    name: 'TotalAllPie',
    components: { BaseTable },
    setup() {
      return {
        getOrderTest09,
        columns,
        searchFormSchema,
      }
    },
  })
</script>