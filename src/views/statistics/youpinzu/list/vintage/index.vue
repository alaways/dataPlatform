<template>
  <BaseTable
    :api="getYpzVintageCount"
    :searchFormSchema="searchFormSchema"
    :columns="columns"
    :ParamsNotTime="true"
  />
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import BaseTable from '/@/views/statistics/bI/components/baseTable/index.vue'
  import { getYpzVintageCount } from '/@/api/statistics/index'
  import { columns, searchFormSchema } from './data'
  export default defineComponent({
    name: 'TotalAllPie',
    components: { BaseTable },
    setup() {
      return {
        getYpzVintageCount,
        columns,
        searchFormSchema,
      }
    },
  })
</script>
