<template>
  <BasicModal
    :width="600"
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    destroyOnClose
  >
    <BasicForm @register="registerForm">
      <template #spuIds>
        <div class="goods">
          <div style="margin-top: 5px">
            <a-button :disabled="disabled" size="small" @click="handleGoodsModal">
              <SelectOutlined />选择商品
            </a-button>
          </div>
          <div
            v-for="(item, index) in spuValue"
            :key="index"
            class="item"
            @mouseover="handleShowClear(item)"
            @mouseleave="handleHideClear"
          >
            <div class="txt mr-6">{{ item.name }}</div>
            <Popconfirm
              v-if="!disabled"
              placement="left"
              title="是否确认删除"
              @confirm="handleGoodsDel(item)"
            >
              <DeleteOutlined v-if="showClear" class="txt" style="color: #888" />
            </Popconfirm>
          </div>
        </div>
      </template>
      <template #uid>
        <div class="utop" v-if="!disabled">
          <Input
            v-model:value="userName"
            placeholder="请输入用户名"
            class="inputCont"
            :disabled="disabled"
          />
          <Button :loading="userLoading" @click="handleSearch" :disabled="disabled">查询</Button>
        </div>
        <div v-if="disabled">
          <div class="lookuitem" v-for="item in lookList" :key="item.uid">
            {{ item.unickname }}({{ item.uid }})，{{ item.appletName }}
          </div>
        </div>
        <div class="ucont" v-if="!disabled">
          <div v-for="(item, index) in userList" :key="item.uid" class="uitem">
            <div>
              账号信息{{ index + 1 }}
              <Checkbox
                style="margin-left: 40px"
                :checked="item.checked"
                @change="(e) => changeSelected(e, item)"
              />
            </div>
            <div>用户名称：{{ item.nickName }}</div>
            <div>手机号码：{{ item.phone }}</div>
            <div>是否存在逾期订单：{{ item.ifOverdueOrder == 1 ? '是' : '否' }}</div>
            <div>小程序名称：{{ item.appletName }}</div>
          </div>
        </div>
      </template>
    </BasicForm>
    <GoodsModal @register="registerGoodsModal" @success="handleSuccess" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { userFormSchema } from './data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { setPreferentialItem, updatePreferentialItem } from '/@/api/coupons/preferential'
  import dayjs from 'dayjs'
  import { cloneDeep } from 'lodash-es'
  import { canParseJSON, handlenAmount } from '/@/utils/tool'
  import { DeleteOutlined, SelectOutlined } from '@ant-design/icons-vue'
  import { useModal } from '/@/components/Modal'
  import GoodsModal from './goodsModal.vue'
  import { Popconfirm, Button, Input, Checkbox } from 'ant-design-vue'
  import { getUserList } from '/@/api/system/user'
  import { getReceiveList } from '/@/api/coupons/receive'

  export default defineComponent({
    name: 'PreferentialModal',
    components: {
      BasicModal,
      BasicForm,
      GoodsModal,
      SelectOutlined,
      DeleteOutlined,
      Popconfirm,
      Input,
      Button,
      Checkbox,
    },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const spuIds = ref('')
      const spuValue: any = ref([])
      const disabled = ref<boolean>(false)
      const lookList = ref([])
      const { createMessage } = useMessage()
      const [registerGoodsModal, { openModal: openGoodsModal }] = useModal()

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 150,
        schemas: userFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      })
      const userList = ref([])
      const userName = ref(null)
      const userLoading = ref(false)
      const userSelectList = ref([])
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        spuIds.value = data.record?.spuIds || ''
        // 如果类型是 3 调用查询指定的用户数据
        if (data.record?.grantType === 3) {
          const res = await getReceiveList({ couponId: data.record?.id })
          const list = res.list.reduce((acc, item) => {
            // 检查当前项的id是否已在结果数组中
            if (!acc.some((i: any) => i.uid === item.uid)) {
              acc.push(item)
            }
            return acc
          }, [])
          lookList.value = list
        }
        // 如果是查看这禁用
        disabled.value = data.disabled
        spuValue.value = []
        if (data.record?.spuValue && canParseJSON(data.record?.spuValue)) {
          spuValue.value = JSON.parse(data.record?.spuValue)
        }
        let validityTime: any = []
        validityTime = data.record.validityBeginTime
        if (data.record.validityBeginTime) {
          validityTime = [dayjs(data.record.validityBeginTime).format('YYYY-MM-DD hh:mm:ss')]
          if (data.record.validityEndTime) {
            validityTime.push(dayjs(data.record.validityEndTime).format('YYYY-MM-DD hh:mm:ss'))
          }
        }
        if (unref(isUpdate)) {
          setFieldsValue({
            disabled,
            ...data.record,
            validityTime,
            ...handlenAmount(
              {
                faceValue: data.record.faceValue,
                minPoint: data.record.minPoint,
              },
              false,
            ),
          })
        }
      })

      const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'))

      const showClear = ref('')
      function handleShowClear(id) {
        showClear.value = id
      }
      function handleHideClear() {
        showClear.value = ''
      }
      // 获取用户列表
      const getUserDataList = async (name) => {
        const params: any = { pageIndex: 1, pageSize: 500 }
        if (name && name != '') params.nickName = name
        userLoading.value = true
        const res = await getUserList(params)
        userLoading.value = false
        userList.value = res?.list || []
      }
      function handleGoodsModal() {
        openGoodsModal(true, {
          isUpdate: false,
          spuIds: spuIds.value,
          spuValue: spuValue.value,
        })
      }

      async function handleGoodsDel(item: any) {
        spuValue.value = spuValue.value.filter((v) => v.id != item.id)
        spuIds.value = spuValue.value.map((v) => v.id).join(',')
        setFieldsValue({
          spuIds: spuIds.value,
        })
      }

      function handleSuccess(data) {
        if (!data) {
          spuValue.value = []
          spuIds.value = ''
          setFieldsValue({
            spuIds: '',
          })
          return
        }
        spuValue.value = data
        spuIds.value = spuValue.value.map((v) => v.id).join(',')
        setFieldsValue({
          spuIds: spuIds.value,
        })
      }

      async function handleSubmit() {
        try {
          const values = await validate()
          let fromValue = cloneDeep(values)
          fromValue = {
            ...fromValue,
            spuValue: JSON.stringify(spuValue.value),
            validityDaysMin: Number(fromValue.validityDaysMin),
            validityDaysMax: Number(fromValue.validityDaysMax),
            ...handlenAmount(
              {
                faceValue: fromValue.faceValue,
                minPoint: fromValue.minPoint,
              },
              true,
            ),
          }
          if (userSelectList.value.length) {
            fromValue.uid = userSelectList.value.join(',')
          }
          if (fromValue.validityTime) {
            fromValue['validityBeginTime'] = fromValue.validityTime[0]
            fromValue['validityEndTime'] = fromValue.validityTime[1]
            delete fromValue.validityTime
          }
          if (fromValue.validityDaysMin > fromValue.validityDaysMax) {
            createMessage.error('时效的最大值不能小于最小值')
            return
          }
          setModalProps({ confirmLoading: true })
          // TODO custom api
          if (!unref(isUpdate)) {
            await setPreferentialItem(fromValue)
          } else {
            await updatePreferentialItem(fromValue)
          }
          createMessage.success(`${getTitle.value}成功`)
          closeModal()
          emit('success')
        } finally {
          setModalProps({ confirmLoading: false })
        }
      }
      // 搜索
      const handleSearch = () => {
        getUserDataList(userName.value)
      }
      // 选中的操作
      const changeSelected = (event, item) => {
        let nulist: any = userList.value
        let selectList = []
        const uindex = userList.value.findIndex((uitem: any) => uitem.uid == item.uid)
        nulist = nulist.map((item: any) => {
          item.checked = false
          return item
        })
        if (uindex > -1) {
          nulist[uindex].checked = event.target.checked
          if (event.target.checked) {
            selectList.push(nulist[uindex].uid)
          }
        }
        userSelectList.value = [...selectList]
        userList.value = nulist
      }
      return {
        registerModal,
        registerForm,
        getTitle,
        handleSubmit,
        showClear,
        spuIds,
        spuValue,
        handleShowClear,
        handleHideClear,
        handleGoodsModal,
        registerGoodsModal,
        handleSuccess,
        handleGoodsDel,
        disabled,
        userList,
        userName,
        handleSearch,
        userLoading,
        changeSelected,
        lookList,
      }
    },
  })
</script>

<style lang="less" scoped>
  .goods {
    display: flex;
    flex-direction: column;

    .item {
      width: 300px;
      margin-top: 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      &:hover {
        background-color: #f5f5f5;
      }

      .txt {
        font-size: 14px;
      }
    }
  }

  .utop {
    display: flex;

    .inputCont {
      max-width: 200px;
    }
  }

  .ucont {
    max-height: 300px;
    overflow-y: scroll;

    .uitem {
      padding: 10px;
      border-radius: 3px;
      border: 1px solid #ddd;
      margin-bottom: 4px;
      font-size: 12px;
    }
  }
</style>
