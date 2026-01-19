<template>
  <iframe
    width="100%"
    height="800px"
    :src="iframeUrl" 
  ></iframe>
</template>
<script lang="tsx">
  import { defineComponent, ref } from 'vue'

  import { getNewToken } from '/@/utils'

  export default defineComponent({
    name: 'CollectionTaskNewPage',
    setup() {
      const newToken = getNewToken()
      const iframeUrl = ref(`https://admin.gsrental.cn/newAdmin/assets/index.d868d633b.js/iframe=true#/zzy?path=CollectionPage/CollectionTaskNewPage&iframe=true&newToken=${newToken}`)
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

  ::v-deep(.ant-table-expanded-row-fixed) {
    padding: 10px 0 !important;
    background: #fff;
  }

  .BasicTableItem {
    ::v-deep(.ant-table-wrapper) {
      padding: 0 !important;
    }

    ::v-deep(.ant-table) {
      margin: 0 !important;
    }
  }

  ::v-deep(.ant-tabs) {
    .ant-tabs-nav::before {
      border-width: 0 !important;
    }
  }

  .batchBtn {
    margin-right: 10px;
  }
</style>
