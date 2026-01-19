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
    name: 'CollectionSetting',
    setup() {
      const mayiToken = getMayiToken()
      const iframeUrl = ref(`https://admin.gsrental.cn/mayiAdmin/assets/index.d868d633b.js/iframe=true#/zzy?path=Collection/CollectionCommission&iframe=true&mayiToken=${mayiToken}`)
      return {
        iframeUrl,
      }
    },
  })
</script>
