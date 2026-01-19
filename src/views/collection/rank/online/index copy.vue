<template>
  <!-- <div>
    <div class="card">
      <div class="t1">
        <div class="w1">{{ rankTime.currentYearMonth }} 到期订单总数: {{ rankCount[0] || 0 }} </div>
        <div>{{ rankTime.nextYearMonth }} 到期订单总数: {{ rankCount[1] || 0 }} </div>
      </div>
      <div>更新日期: {{ rankTime.currentDate }}</div>
    </div>
    <BasicTable @register="registerTable" />
  </div> -->
  <iframe
      width="100%"
      height="800px"
      :src="iframeUrl" 
    ></iframe>
</template>
<script lang="ts">
  import { defineComponent, nextTick, onMounted, ref } from 'vue'
  import { BasicTable, useTable } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import { getCollectionRankCount, getCollectionRankList2 } from '/@/api/collection/rank'
  import { cloneDeep } from 'lodash-es'
  import dayjs from 'dayjs'
  import { getMayiToken } from '/@/utils/index'

  export default defineComponent({
    name: 'CollectionRank',
    components: { BasicTable },
    setup() {
      const rankCount = ref<any>([0, 0])
      const rankTime = ref<any>({
        currentDate: '',
        currentYearMonth: '',
        nextYearMonth: '',
      })
      const mayiToken = getMayiToken()
      const iframeUrl = ref(`https://admin.gsrental.cn/mayiAdmin/assets/index.d868d633b.js/iframe=true#/zzy?path=Collection/CollectionRank&iframe=true&mayiToken=${mayiToken}`)
      const [registerTable, { getForm }] = useTable({
        title: '排行榜',
        scroll: { y: 600 },
        beforeFetch,
        api: getCollectionRankList2,
        columns,
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
          autoAdvancedLine: 10,
          showActionButtonGroup: false,
        },
        indexColumnProps: {
          title: '排名',
          width: 130,
        },
        useSearchForm: true,
        bordered: true,
      })

      function beforeFetch(data) {
        const pdata = cloneDeep(data)
        // 排序
        if (pdata.field) {
          const order = pdata.order == 'ascend' ? 'asc' : 'desc'
          pdata['orderBy'] = `${pdata.field} ${order}`
          delete pdata.field
          delete pdata.order
        }
        if (pdata.time) {
          const time = String(pdata.time).split('~')
          pdata['createTimeBegin'] = `${time[0]}`
          pdata['createTimeEnd'] = `${time[1]}`
        }
        delete pdata.time
        return pdata
      }

      function handleTime() {
        rankTime.value.currentDate = dayjs().format('YYYY/MM/DD')
        rankTime.value.currentYearMonth = dayjs().format('YYYY/MM')
        rankTime.value.nextYearMonth = dayjs().add(1, 'month').format('YYYY/MM')
      }

      async function init() {
        handleTime()
        getCollectionRankCount().then((res) => {
          rankCount.value = res.expList
        })

        const form = await getForm()
        form.updateSchema({
          field: 'time',
          componentProps: {
            onChange: () => {
              form.submit()
            },
          },
        })
      }

      onMounted(() => {
        nextTick(() => {
          init()
        })
      })

      return {
        registerTable,
        rankCount,
        rankTime,
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
