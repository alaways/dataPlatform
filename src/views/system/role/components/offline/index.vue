<template>
  <iframe
    width="100%"
    height="800px"
    :src="iframeUrl" 
  ></iframe>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { getNewToken } from '/@/utils/index'
  const props = {
    dataSource: { type: String, default: 'xx'}
  }
  export default defineComponent({
    name: 'CollectionRemitPage',
    props,
    setup() {
      const newToken = getNewToken()
      const iframeUrl = ref(`https://admin.gsrental.cn/newAdmin/assets/index.d868d633b.js/iframe=true#/zzy?path=System/RolePage&iframe=true&newToken=${newToken}`)
      return {
        iframeUrl,
      }
    },
  })
</script>

<style lang="less" scoped>
  .TableAction {
    flex-direction: column;

    ::v-deep.vben-basic-table-action {
      button {
        margin-bottom: 2px;
      }

      .action-divider {
        display: none !important;
      }
    }
  }
</style>
