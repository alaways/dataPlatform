<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <div>
      <div class="title">休息时间</div>

      <div class="userInfo">
        <div class="name">人员：{{ currentUser }}</div>
        <div class="rowItem">
          <div
            v-for="item in selectedList"
            :key="item"
            :class="{ colItem: true, red: checkDate(item) }"
          >
            {{ item }}
            <CloseOutlined @click="() => onClearDateItem(item)" />
          </div>
        </div>
      </div>
      <Calendar mode="month" @select="changeCalendar" :fullscreen="false" />
      <div>注：休息时间内，该人员不再参与订单分配；在结束日期后继续参与订单分配</div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { Calendar } from 'ant-design-vue'
  import dayjs from 'dayjs'
  import { CloseOutlined } from '@ant-design/icons-vue'
  import { getUserList } from '/@/api/system/account'
  export default defineComponent({
    name: 'UserModal',
    components: { BasicModal, Calendar, CloseOutlined },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const { createMessage } = useMessage()

      const recordItem = ref(null)
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        recordItem.value = data.record
        if (data.record?.restDayList) {
          selectedList.value = data.record?.restDayList || []
        }
        await getAccountList(data.record)
      })
      const checkDate = (day) => {
        const dday = dayjs(new Date()).format('YYYY-MM-DD')
        const today = dayjs(dday).valueOf()
        const itemday = dayjs(day).valueOf()
        if (itemday < today) {
          return true
        } else {
          return false
        }
      }
      const selectedList = ref<any>([])
      const userList = ref([])
      const currentUser = ref(null)
      const getTitle = computed(() => '排班设置')
      //提交数据
      async function handleSubmit() {
        let flag = false
        const dday = dayjs(new Date()).format('YYYY-MM-DD')
        const today = dayjs(dday).valueOf()
        selectedList.value.map((item: any) => {
          const itemDay = dayjs(item).valueOf()
          if (today > itemDay) {
            flag = true
          }
        })
        if (flag) {
          return createMessage.warn('当前日期中存在今天之前的日期，请检查后再保存')
        }
        emit('success', { uid: recordItem.value?.uid, selectedList: selectedList.value })
        closeModal()
        selectedList.value = []
      }
      // 获取账号列表
      const getAccountList = async (data: any) => {
        const res = await getUserList({ limit: 99999, roleKey: 'kefu', status: 1 })
        userList.value = res.list
        const uitem = res.list.find((item: any) => Number(item.uid) == data.uid)
        if (uitem) {
          currentUser.value = `${uitem.userName} (${uitem.uid})`
        }
      }
      // 修改日历数据
      const changeCalendar = async (data: any) => {
        console.log(data, 'changeCalendar')
        const ndate: String = dayjs(data).format('YYYY-MM-DD')
        const nlist: any = []
        nlist.push(ndate)
        const sitem = selectedList.value.find((item: any) => item === ndate)
        if (!sitem) {
          selectedList.value = [...selectedList.value, ...nlist] || []
        }
      }
      // 清除数据
      const onClearDateItem = (date: any) => {
        const findex = selectedList.value.findIndex((item: any) => item === date)
        if (findex > -1) {
          selectedList.value.splice(findex, 1)
          selectedList.value = selectedList.value
        }
      }
      return {
        checkDate,
        registerModal,
        onClearDateItem,
        recordItem,
        currentUser,
        getTitle,
        handleSubmit,
        changeCalendar,
        selectedList,
      }
    },
  })
</script>
<style>
  .rowItem {
    display: flex;
    align-items: center;
    /* justify-content: space-between; */
    flex-wrap: wrap;
  }

  .colItem {
    background: skyblue;
    margin-bottom: 4px;
    box-sizing: border-box;
    width: 24%;
    margin-right: 1%;
    flex-shrink: 0;
    padding-left: 10px;
  }

  .colItem.red {
    background: orange;
  }
</style>
