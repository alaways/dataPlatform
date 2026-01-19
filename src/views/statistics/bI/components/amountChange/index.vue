<template>
  <BaseTable :api="getVintageRemaining" :columns="columns" :searchFormSchema="searchFormSchema" />
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import BaseTable from '../baseTable/index.vue'
  import { getVintageRemaining } from '/@/api/statistics/index'
  import { columns } from './data'
  export default defineComponent({
    name: 'TotalAllPie',
    components: { BaseTable },
    setup() {
      return {
        getVintageRemaining,
        columns,
        searchFormSchema: [],
      }
    },
  })
</script>
