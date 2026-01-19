<template>
  <div class="rank">
    <ATabs v-model:activeKey="currentKey">
      <ATabPane tab="线下" key="offline">
        <!-- 测试环境的催收任务 -->
        <Offline />
        <!-- <iframe
          width="100%"
          height="800px"
          src="https://test.gsrental.cn/newAdmin/assets/index.d868d633b.js#/CollectionPage/CollectionRankPage?iframe=true"
        ></iframe> -->
      </ATabPane>
      <ATabPane tab="线上" key="online">
        <Online />
        <!--  -->
      </ATabPane>
      <ATabPane tab="零零享租" key="llsz">
        <LLXz />
      </ATabPane>
      <ATabPane tab="俏租机" key="qzj">
        <Qzj />
      </ATabPane>
    </ATabs>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { Tabs } from 'ant-design-vue'
  import LLXz from './llxz.vue'
  import Qzj from './qzj.vue'
  import Online from './online/index.vue'
  import Offline from './offline.vue'
  export default defineComponent({
    name: 'CollectionRankPage',
    components: { ATabs: Tabs, ATabPane: Tabs.TabPane, LLXz, Qzj, Online, Offline },
    setup() {
      const currentKey = ref('online')
      const init = () => {
        setTimeout(() => {
          // 使用querySelector选择元素
          var myDiv = document.querySelector('.rank .ant-tabs-top .ant-tabs-nav')
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
