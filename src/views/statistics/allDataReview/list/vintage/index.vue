<template>
  <BaseTable :api="selectLLXZMob" :columns="columns" />
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import BaseTable from '/@/views/statistics/bI/components/baseTable/index.vue'
  import { selectLLXZMob } from '/@/api/statistics/index'
  import { columns } from './data'
  export default defineComponent({
    name: 'TotalAllPie',
    components: { BaseTable },
    setup() {
      return {
        selectLLXZMob,
        columns,
      }
    },
  })
</script>
