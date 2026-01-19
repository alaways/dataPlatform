<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    :width="800"
    :footer="null"
    maskClosable
    destroyOnClose
    @cancel="handleCancel"
  >
    <div
      class="flex items-center justify-end"
      v-if="
        (isTask &&
          (hasPermission('CollectionTaskRecordAdd') ||
            hasPermission('CollectionTaskNewRecordAdd'))) ||
        type == 2
      "
    >
      <Button class="mr-6" type="primary" @click="handleAdd">新增</Button>
    </div>

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
    <RecordAddModal @register="recordAddModal" @success="handleSuccess" :dataSource="dataSource" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, computed, ref } from 'vue'
  import { BasicModal, useModal, useModalInner } from '/@/components/Modal'
  import { Button, Col, Row, Tag } from 'ant-design-vue'
  import { getTaskRecordList } from '/@/api/collection/task'
  import RecordAddModal from './recordAddModal.vue'
  import { usePermission } from '/@/hooks/web/usePermission'
  const props = {
    dataSource: String,
  }
  export default defineComponent({
    name: 'RecordModal',
    components: { BasicModal, Button, Tag, RecordAddModal, Row, Col },
    emits: ['success', 'register'],
    props,
    setup(props, { emit }) {
      const isTask = ref(false) // 只有催收任务才有的新增
      const isRefresh = ref(false) // 判断是否需要刷新
      const orderId = ref('')
      const dataSource = ref()
      const type = ref(1) // 1-催收 2-订单"
      const uid = ref('')
      const list = ref<any>([])
      const { hasPermission } = usePermission()
      const [recordAddModal, { openModal }] = useModal()
      const [registerModal, { setModalProps }] = useModalInner(async (data) => {
        orderId.value = data.record.orderId
        uid.value = data.record.uid
        isTask.value = data.isTask || false
        type.value = data.type || 1
        dataSource.value = props.dataSource
        init()
      })

      async function init() {
        const res = await getTaskRecordList({
          orderId: orderId.value,
          limit: 999999,
          type: type.value,
          dataSource: props.dataSource,
        })
        list.value = res.list
        setModalProps({ confirmLoading: false })
      }

      const getTitle = computed(() => (type.value == 1 ? '催收记录' : '备注记录'))

      function handleAdd() {
        openModal(true, {
          isUpdate: true,
          type,
          orderId,
          uid,
          dataSource: dataSource.value,
        })
      }

      function handleSuccess() {
        init()
        isRefresh.value = true
      }

      function handleCancel() {
        if (isRefresh.value) {
          emit('success')
        }
        isRefresh.value = false
        list.value = []
      }

      return {
        registerModal,
        getTitle,
        handleAdd,
        list,
        recordAddModal,
        handleSuccess,
        isTask,
        hasPermission,
        handleCancel,
        type,
        dataSource,
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
