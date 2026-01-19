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
    name: 'CollectionRankPage',
    setup() {
      const newToken = getNewToken()
      const iframeUrl = ref(`https://admin.gsrental.cn/newAdmin/assets/index.d868d633b.js/iframe=true#/zzy?path=CollectionPage/CollectionRankPage&iframe=true&newToken=${newToken}`)
      return {
        iframeUrl,
      }
    },
  })
</script>

<style lang="less" scoped>
  .card {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: #555;
    margin: 16px 16px 0;
    padding: 16px;
    background: #fff;
    border-radius: 3px;

    .t1 {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex: 1;

      .w1 {
        width: 280px;
      }
    }
  }

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
