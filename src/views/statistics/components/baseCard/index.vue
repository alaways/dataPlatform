<template>
  <Card :bordered="false">
    <div class="updateTime" v-if="!isHideTitle">{{ title }}</div>
    <div class="topChilds">
      <Card
        v-for="item in cardList"
        :key="item?.id"
        class="cardmrItem"
        :style="{ backgroundColor: item?.color }"
      >
        <div class="baseT">
          {{ item?.label }}
          <Tooltip placement="bottom" v-if="item?.titple">
            <template #title>{{ item?.titple }}</template>
            <ExclamationCircleOutlined />
          </Tooltip>
        </div>
        <div class="desc">{{ item?.amount }}</div>
      </Card>
    </div>
  </Card>
</template>
<script lang="ts">
  import { defineComponent, ref, watch } from 'vue'
  import { Card, Tooltip } from 'ant-design-vue'
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
  import dayjs from 'dayjs'
  interface listItem {
    id: string | number
    color: string
    label: string
    titple: string | undefined
    amount: string | number
  }
  const props = {
    list: Array<listItem>,
    res: Object,
    title: String,
    hideTitle: Boolean,
  }
  export default defineComponent({
    name: 'StoreList',
    components: { Card, ExclamationCircleOutlined, Tooltip },
    props,
    setup(props) {
      const _props = props
      const cardList = ref(_props?.list || [])
      const cutRes = ref(_props?.res)
      const title = ref(_props?.title || '更新时间：每日9点')
      const isHideTitle = ref(_props?.hideTitle)
      watch(
        () => _props?.res,
        (res) => {
          if (res) {
            cutRes.value = res
            getDetailInfo()
          }
        },
      )
      // 是否百分比
      const addLvHanld = (item: any, type = false) => {
        if (type) {
          const num = item.toFixed(2)
          return `${num}%`
        }
        const num = (item * 100).toFixed(3)
        return `${String(num)?.slice(0, 4)}%`
      }
      const getDetailInfo = async () => {
        const contentList = cardList.value
        console.log(cardList.value, contentList, 'cardList.valueSHow')
        Object.keys(cutRes.value).forEach((Ritem) => {
          cardList.value = contentList.map((item: any) => {
            if (item.id === Ritem) {
              item.amount = `${cutRes.value?.[Ritem]?.toLocaleString()}`
              if (item.isAddLv) {
                console.log(item.amount, 'itemAmount')
                item.amount = addLvHanld(cutRes.value?.[Ritem])
              }
            }
            return item
          })
        })
      }

      const getContentArrs = () => {
        let list = cardList.value
        list = list.map((item: any) => {
          item.children = item.children?.filter((citem: any) => citem.isShow)
          return item
        })
        return list
      }
      return {
        cardList: getContentArrs(),
        dayjs,
        title,
        isHideTitle,
      }
    },
  })
</script>
<style scoped>
  .topCont,
  .topChilds {
    display: flex;
  }

  .cardItem {
    flex: 1;
    border-radius: 12px;
    margin: 16px;
    max-width: 290px;
  }

  .bottomCard .ant-card-head {
    padding: 0px;
  }

  .cardmrItem {
    border-radius: 12px;
  }

  .descr {
    color: #999;
  }

  .bold {
    font-size: 20px;
    font-weight: bold;
  }

  .bigTit {
    font-size: 16px;

    span {
      font-size: 12px;
    }
  }

  .baseT {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
  }

  .bottomCard .desc {
    font-size: 18px;
    font-weight: bold;
  }

  .bottomCard .cardItem {
    max-width: 24%;
    min-width: 24%;
  }

  .topChilds {
    display: flex;
    flex-flow: wrap;
    flex-wrap: wrap;
  }

  .topChilds .desc {
    font-size: 18px;
    font-weight: bold;
  }

  .topChilds .cardmrItem {
    max-width: 290px;
    min-width: 24%;
    margin-right: 1%;
    margin-bottom: 16px;
  }

  .updateTime {
    position: relative;
    top: -86px;
    left: 120px;
  }
</style>
