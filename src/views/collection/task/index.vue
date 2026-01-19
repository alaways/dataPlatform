<template>
  <div class="taskCont">
    <!-- 头部筛选 -->
    <ATabs v-model:activeKey="currentKey">
      <ATabPane v-for="item in menuList" :tab="item.tab" :key="item.key" />
    </ATabs>
    <div>
      <component v-if="detailInfo" :is="currentKey" :detailInfo="detailInfo" :payload="payload" />
      <Skeleton v-else :active="true" :loading="loading" :paragraph="{ rows: 16 }" />
    </div>
  </div>
</template>

<script lang="tsx">
  import { defineComponent, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { PageWrapper } from '/@/components/Page'
  import { Tabs, Select } from 'ant-design-vue'
  import { menuList } from './data.jsx'
  import { useGo } from '/@/hooks/web/usePage'
  import OfflineCom from './components/OfflineCom/index.vue'
  import OnlineCom from './components/OnlineCom/index.vue'
  import Linglingxiang from './components/Linglingxiang/index.vue'
  import Qiaozuji from './components/Qiaozuji/index.vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { searchFormSchema } from './data'
  import { getCollectsStatusList } from '/@/api/collection/task'

  export default defineComponent({
    name: 'CollectionTaskPage',
    components: {
      PageWrapper,
      ATabs: Tabs,
      ATabPane: Tabs.TabPane,
      OfflineCom,
      OnlineCom,
      Linglingxiang,
      Qiaozuji,
      BasicTable,
      TableAction,
      Select,
    },

    setup() {
      const route = useRoute()
      const go = useGo()
      const orderId = ref(route.params?.id)
      const currentKey = ref(menuList[0]?.key)
      const back = ref(route.query?.back)
      const detailInfo = ref({ currentKey })
      const isAllocation = ref(false)
      const loading = ref(false)
      const searchLoading = ref(false)
      const tableMenus = ref<any>([])
      const tabsList = [
        { tab: '诉讼中', key: '1' },
        { tab: '新派单', key: '2' },
      ]
      const tabsActiveKyes = ref('1')
      if (route.query.isAllocation) {
        isAllocation.value = route.query.isAllocation == '1'
      }
      const payload = ref({ tabCode: '2' })
      // 返回上一页
      function goBack() {
        go(String(back.value))
      }
      const handleSearchInfoChange = (data) => {
        payload.value = data
        setLoading(true)
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      }
      const [registerTable, { setLoading, getForm }] = useTable({
        scroll: { y: 0 },
        emptyDataIsShowTable: false,
        columns: [],
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
          autoAdvancedLine: 10,
        },
        useSearchForm: true,
        bordered: true,
        canResize: false,
        showIndexColumn: false,
        pagination: false,
        loading: searchLoading.value,
        handleSearchInfoFn: handleSearchInfoChange,
      })
      const init = () => {
        // payload.value = getForm()
        console.log(getForm(), 'getFormShow')
        getCollectsStatusList({ cursor: 999999, status: 1, isNew: 1 }).then((res) => {
          res = res.map((v) => {
            return { tab: v.name, key: `${v.code}` }
          })
          console.log(res, tabsList, 'resShow')
          tableMenus.value = [...tabsList, ...res]
        })
        setTimeout(() => {
          // 使用querySelector选择元素
          var myDiv = document.querySelector('.taskCont .ant-tabs-top .ant-tabs-nav')
          // 修改样式
          if (myDiv) {
            myDiv.style.padding = '0 24px'
            myDiv.style.margin = '0'
          }
        }, 1000)
      }
      init()
      return {
        menuList,
        currentKey,
        orderId,
        goBack,
        detailInfo,
        loading,
        registerTable,
        payload,
        tableMenus,
        tabsActiveKyes,
      }
    },
  })
</script>

<style lang="less" scoped>
  .ant-page-header.has-footer {
    padding-top: 0 !important;
  }
  ::deep .taskCont {
    // margin-top: -48px;
    padding: 0;
    // background-color: red;
    ::v-deep .ant-tabs-top {
      padding: 0 30px !important;
    }
  }
</style>
