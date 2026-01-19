<template>
  <iframe
    width="100%"
    height="800px"
    :src="iframeUrl" 
  ></iframe>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { getMayiToken } from '/@/utils/index'
  export default defineComponent({
    name: 'CollectionRemitPage',
    setup() {
      const mayiToken = getMayiToken()
      const iframeUrl = ref(`https://admin.gsrental.cn/mayiAdmin/assets/index.d868d633b.js/iframe=true#/zzy?path=Collection/CollectionRemit&iframe=true&mayiToken=${mayiToken}`)
      
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
