<template>
  <div>
    <Description
      size="middle"
      title="风控信息"
      :bordered="false"
      :column="4"
      :data="baseInfo"
      :schema="riskSchema"
    />
    <div class="mt-6"></div>
    <div v-for="(item, index) in baseInfo.list" :key="index">
      <template v-if="!item.hide && item.children && item.children.length">
        <div class="title mb-2">
          <div class="hrs"></div>
          <div class="name">{{ item.name }}</div>
          <div class="hrs"></div>
        </div>

        <template v-if="item.name == '逾期报告'">
          <SlippageTable :pdata="riskControlData" />
        </template>

        <!-- 其他表格数据 -->
        <CommonTable :list="item.children" :span="item.span" />
      </template>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { riskSchema, riskControlList } from './data'
  import { handleNewData } from './handle'
  import { cloneDeep } from 'lodash-es'
  import { Description } from '/@/components/Description/index'
  import { getOrangeRiskControl } from '/@/api/riskControl'
  import CommonTable from './components/CommonTable.vue'
  import SlippageTable from './components/SlippageTable.vue'

  export default defineComponent({
    name: '有橙风控',
    components: {
      Description,
      CommonTable,
      SlippageTable,
    },
    props: {
      detailInfo: { type: Object },
      isRiskEnter: { type: Boolean, default: false }, // 是否从风控搜索进入
    },
    setup(props) {
      /**
       * 表格整体数据
       * 放js文件中有缓存
       */
      const riskControlData: any = ref([])
      riskControlData.value = cloneDeep(riskControlList)
      const baseInfo: any = ref<any>({
        list: [],
      })
      init()

      function init() {
        if (props.isRiskEnter) {
          baseInfo.value = handleNewData(props.detailInfo)
        } else {
          const params = {
            resultType: 'orderSn',
            resultId: props.detailInfo?.orderSn,
          }
          getOrangeRiskControl(params).then((res: any) => {
            baseInfo.value = handleNewData(res)
          })
        }
      }

      return {
        riskSchema,
        riskControlData,
        baseInfo,
      }
    },
  })
</script>
<style lang="less" scoped>
  .desc-wrap {
    padding: 16px;
    background-color: @component-background;
  }

  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 30px 0 20px;

    .hr {
      width: 5px;
      height: 15px;
      margin-right: 5px;
      background-color: #528eda;
      border-radius: 4px;
    }

    .hrs {
      height: 1px;
      background-color: #e8e8e8;
      flex: 1;
    }

    .name {
      width: 300px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
    }
  }

  .box {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    min-height: 50px;
  }

  .bg {
    background: #dce9f8;
  }
</style>
