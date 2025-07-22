<template>
  <Descriptions class="mb" size="middle" title="收货地址管理">
    <template v-for="(item, index) in addressList" :key="item.id">
      <DescriptionsItem :span="8" class="itemCont" style="position: relative">
        <div class="itemT"> 收货地址信息{{ index + 1 }} </div>
        <Switch :checked="item?.ifDefault === 1" class="switchBtn" :disabled="true" />
      </DescriptionsItem>
      <DescriptionsItem label="姓名" :span="2" class="itemCont">
        <div>{{ item?.receiverName || '-' }}</div>
      </DescriptionsItem>
      <DescriptionsItem label="手机号" :span="2" class="itemCont">
        <div>{{ item?.receiverPhone || '-' }}</div>
      </DescriptionsItem>
      <DescriptionsItem label="收货地址" :span="3" class="itemCont">
        <div>{{ item?.province + item?.city + item?.detailAddress || '-' }}</div>
      </DescriptionsItem>
      <DescriptionsItem label="" :span="9">
        <div class="mh"></div>
      </DescriptionsItem>
    </template>
  </Descriptions>
</template>
<script lang="ts">
  import { defineComponent, ref, watch, nextTick } from 'vue'
  import { Descriptions, DescriptionsItem, Switch } from 'ant-design-vue'
  import { getAddressList } from '/@/api/sys/user'
  const props = {
    uid: String | Number,
  }
  export default defineComponent({
    name: 'UserAddress',
    components: { Descriptions, DescriptionsItem, Switch },
    props,
    setup(props) {
      const addressList = ref([])
      watch(
        () => props.uid,
        (uid: any) => {
          uid &&
            nextTick(() => {
              getUserAddressList(uid)
            })
        },
      )
      const getUserAddressList = async (uid) => {
        const res = await getAddressList({ uid })
        addressList.value = res
      }
      return { addressList }
    },
  })
</script>
<style scoped>
  .mb .ant-descriptions-view {
    position: relative;
  }

  .switchBtn {
    position: absolute;
    right: 0;
    top: 0;
  }

  .itemCont {
    margin-bottom: 16px;
  }

  .mh {
    width: 100%;
    height: 20px;
  }

  .itemT {
    color: #666;
  }
</style>
