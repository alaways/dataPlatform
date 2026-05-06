<template>
  <div>
    统计时间：{{ timer }}
    <Button @click="onResetHanlder" class="ml" type="primary" size="small">重新统计</Button>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, watch } from 'vue'
  import { Button } from 'ant-design-vue'
  import { usePermission } from '/@/hooks/web/usePermission'
  import dayjs from 'dayjs'
  const props: any = {
    timer: String,
  }
  export default defineComponent({
    name: 'TotalAllPie',
    components: { Button },
    emits: ['resetHanlder'],
    props,
    setup(_, { emit }) {
      const { hasPermission } = usePermission()
      const timer = ref(dayjs(props?.time).format('YYYY-MM-DD HH:mm:ss'))
      // 重新统计操作
      const onResetHanlder = () => {
        emit('resetHanlder')
      }
      watch(
        () => props.timer,
        (value) => {
          timer.value = value
        },
      )
      return {
        timer,
        hasPermission,
        onResetHanlder,
      }
    },
  })
</script>
<style>
  .ml {
    margin-left: 20px;
  }
</style>
