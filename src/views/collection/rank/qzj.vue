<template>
  <div>
    <div class="card">
      <div class="t1">
        <div class="w1">{{ rankTime.currentYearMonth }} 到期订单总数: {{ rankCount[0] || 0 }} </div>
        <div>{{ rankTime.nextYearMonth }} 到期订单总数: {{ rankCount[1] || 0 }} </div>
      </div>
      <div>更新日期: {{ rankTime.currentDate }}</div>
    </div>
    <BasicTable @register="registerTable" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick, onMounted, ref } from 'vue'
  import { BasicTable, useTable } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import { getCollectionRankCount, getCollectionRankList2 } from '/@/api/collection/rank'
  import { cloneDeep } from 'lodash-es'
  import dayjs from 'dayjs'

  export default defineComponent({
    name: 'CollectionRankPage',
    components: { BasicTable },
    setup() {
      const rankCount = ref<any>([0, 0])
      const rankTime = ref<any>({
        currentDate: '',
        currentYearMonth: '',
        nextYearMonth: '',
      })
      const initDate = ref()
      const getInitDate = (date) => {
        initDate.value = date
      }
      const [registerTable, { getForm }] = useTable({
        title: '排行榜',
        scroll: { y: 600 },
        beforeFetch,
        api: getCollectionRankList2,
        columns,
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema(getInitDate),
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
        } else {
          const time = String(initDate.value).split('~')
          pdata['createTimeBegin'] = `${time[0]}`
          pdata['createTimeEnd'] = `${time[1]}`
        }
        pdata.dataSources = 'qzj'
        delete pdata.time
        return pdata
      }

      function handleTime() {
        rankTime.value.currentDate = dayjs().format('YYYY/MM/DD')
        rankTime.value.currentYearMonth = dayjs().format('YYYY/MM')
        rankTime.value.nextYearMonth = dayjs().add(1, 'month').format('YYYY/MM')
      }
      const getRankCount = async () => {
        const form = await getForm()
        const res = await getCollectionRankCount({ dataSources : 'qzj'})
        rankCount.value = res?.expList
      }
      async function init() {
        handleTime()
        getRankCount()
        const form = await getForm()
        form.updateSchema({
          field: 'time',
          componentProps: {
            onChange: () => {
              form.submit()
              getRankCount()
            },
          },
        })
        form.updateSchema({
          field: 'dataSources',
          componentProps: {
            onChange: () => {
              form.submit()
              getRankCount()
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
