<template>
  <div class="remit">
    <ATabs v-model:activeKey="currentKey">
      <ATabPane tab="线下" key="offline">
        <!-- 测试环境的催收任务 -->
        <Offline dataSource="xx" />
        <!-- <iframe
          width="100%"
          height="800px"
          src="https://admin.gsrental.cn/newAdmin/assets/index.d868d633b.js#/CollectionPage/CollectionRemitPage?iframe=true"
        ></iframe> -->
      </ATabPane>
      <ATabPane tab="线上" key="online">
        <Online dataSource="xs" />
        <!-- <iframe
          width="100%"
          height="800px"
          src="https://admin.gsrental.cn/mayiAdmin/assets/index.d868d633b.js#/Collection/CollectionRemit?iframe=true"
        ></iframe> -->
      </ATabPane>
      <ATabPane tab="零零享租" key="llsz">
        <LLXz dataSource="llxz" />
      </ATabPane>
      <ATabPane tab="俏租机" key="qzj">
        <Qzj dataSource="qzj" />
      </ATabPane>
    </ATabs>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { Tabs } from 'ant-design-vue'
  import LLXz from './llxz.vue'
  import Qzj from './qzj.vue'
  import Online from './online.vue'
  import Offline from './offline.vue'
  export default defineComponent({
    name: 'CollectionRemitPage',
    components: { ATabs: Tabs, ATabPane: Tabs.TabPane, LLXz, Qzj, Offline, Online },
    setup() {
      const currentKey = ref('offline')
      const init = () => {
        setTimeout(() => {
          // 使用querySelector选择元素
          var myDiv = document.querySelector('.remit .ant-tabs-top .ant-tabs-nav')
          // 修改样式
          if (myDiv) {
            myDiv.style.padding = '0 24px'
            myDiv.style.margin = '0'
          }
        }, 1000)
      }
      init()
      return {
        currentKey,
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
