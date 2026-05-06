<template>
  <BaseTable :api="getOrderTest14" :columns="columns" />
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import BaseTable from '/@/views/statistics/bI/components/baseTable/index.vue'
  import { getOrderTest14, getOrderTest15 } from '/@/api/statistics/index'
  import { columns, searchFormSchema } from './data'
  export default defineComponent({
    name: 'TotalAllPie',
    components: { BaseTable },
    setup() {
      return {
        getOrderTest14,
        getOrderTest15,
        columns,
        searchFormSchema,
      }
    },
  })
</script>
