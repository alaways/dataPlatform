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
  export default defineComponent({
    name: 'CollectionSetting',
    setup() {
      const newToken = getNewToken()
      const iframeUrl = ref(`https://admin.gsrental.cn/newAdmin/assets/index.d868d633b.js/iframe=true#/zzy?path=CollectionPage/CollectionLegalChannelsPage&iframe=true&newToken=${newToken}`)
      return {
        iframeUrl,
      }
    },
  })
</script>
