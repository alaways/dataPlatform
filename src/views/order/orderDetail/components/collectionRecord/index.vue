<template>
  <div class="p-4">
    <div
      class="flex items-center justify-end"
      v-if="hasPermission('CollectionTaskRecordAdd') || hasPermission('CollectionTaskNewRecordAdd')"
    >
      <Button class="mr-6" type="primary" @click="handleAdd">新增</Button>
    </div>

    <Spin tip="正在加载..." size="large" :spinning="loading">
      <div class="card" v-for="item in list" :key="item.id">
        <div class="time">{{ item.createTime }}</div>
        <div class="flex flex-row">
          <div class="hr"></div>
          <Row class="flex flex-1">
            <Col :span="8" v-if="type == 1">
              <div class="flex flex-row items-center">
                <div class="title">催收状态:</div>
                <Tag :color="item.collectsStatusColor">{{ item.collectsStatusName }}</Tag>
              </div>
            </Col>
            <Col :span="8">
              <div class="flex flex-row items-center">
                <div class="title">跟进人:</div>
                <div class="txt">{{ item.followByName || '-' }}</div>
              </div>
            </Col>
            <Col :span="24">
              <div class="flex flex-row">
                <div class="title">{{ type == 1 ? '催收记录:' : '备注记录:' }}</div>
                <div class="txt">{{ item.remark || '-' }}</div>
              </div>
            </Col>
            <Col :span="24">
              <div class="flex flex-row">
                <div class="title">协商还款时间:</div>
                <div class="txt">{{ item.repayDate || '-' }}</div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Spin>
    <RecordAddModal @register="recordAddModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { useModal } from '/@/components/Modal'
  import { Button, Col, Row, Tag } from 'ant-design-vue'
  import { getTaskRecordList } from '/@/api/collection/task'
  import { usePermission } from '/@/hooks/web/usePermission'
  import RecordAddModal from '/@/views/collection/components/recordAddModal.vue'
  const props = {
    detailInfo: { type: Object },
  }

  RecordAddModal
  export default defineComponent({
    name: 'CollectionRecord',
    components: { Button, Tag, RecordAddModal, Row, Col },
    props,
    setup(props) {
      const type = ref(1) // 1-催收 2-订单"
      const loading = ref<boolean>(false)
      const list = ref<any>([])
      const { hasPermission } = usePermission()
      const [recordAddModal, { openModal }] = useModal()

      init()
      async function init() {
        try {
          loading.value = true
          const res = await getTaskRecordList({
            orderId: props.detailInfo?.id,
            limit: 999999,
            type: type.value,
          })
          list.value = res.list
          loading.value = false
        } finally {
        }
      }

      function handleAdd() {
        openModal(true, {
          isUpdate: true,
          type,
          orderId: props.detailInfo?.id,
          uid: props.detailInfo?.uid,
        })
      }

      function handleSuccess() {
        init()
      }

      return {
        handleAdd,
        list,
        recordAddModal,
        handleSuccess,
        hasPermission,
        type,
        loading,
      }
    },
  })
</script>

<style lang="less" scoped>
  .card {
    display: flex;
    flex-direction: column;
    padding: 10px 0;

    .time {
      margin-bottom: 10px;
      font-size: 14px;
      color: #e99f42;
    }

    .hr {
      margin: 0 10px;
      border: 1px solid #e1e1e1;
      border-radius: 3px;
    }

    .title {
      flex-shrink: 0;
      margin-right: 5px;
      font-size: 15px;
      line-height: 30px;
      color: #666;
    }

    .txt {
      font-size: 14px;
      line-height: 30px;
      color: #333;
      word-break: break-all;
    }
  }
</style>
