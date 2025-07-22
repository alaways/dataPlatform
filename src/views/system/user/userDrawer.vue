<template>
  <BasicDrawer
    width="70%"
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    showFooter
    :parentClass="{ userDrawerCont: true }"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #contacts="{ model, field }">
        <ContactsTable
          v-if="model[field]"
          :pdata="model[field]"
          isEmit
          key="user"
          @contacts="handleContactsChange"
        />
      </template>
      <template #cardFrontImage>
        <div class="baseImg">
          <label for="uploadFront" class="uploadBtn">
            <PlusOutlined />
            上传图片
            <Input
              placeholder="请选择"
              type="file"
              @change="(evnet) => onChangeImgs(evnet, 'front')"
              id="uploadFront"
              style="display: none"
            />
          </label>
          <Image :width="200" :src="cardFrontImage" v-if="cardFrontImage" />
        </div>
      </template>
      <template #cardBackImage>
        <div class="baseImg">
          <label for="uploadback" class="uploadBtn">
            <PlusOutlined />
            上传图片
            <Input
              placeholder="请选择"
              type="file"
              id="uploadback"
              @change="(evnet) => onChangeImgs(evnet, 'back')"
              style="display: none"
            />
          </label>
          <Image :width="200" :src="cardBackImage" v-if="cardBackImage" />
        </div>
      </template>
    </BasicForm>
    <!-- 验证码弹窗 -->
    <CaptchaA
      text="提交"
      :captchaResult="isSccues"
      :beforeCheck="beforeCheck"
      @captchaVerifyParam="getCaptchaCode"
    />
    <!-- :key="isSccues" -->
    <UserAddressInfo :uid="userInfo?.uid" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref, reactive, provide } from 'vue'
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { userUpdateSchemas } from './data'
  // import { updateUserItem } from '/@/api/system/user'
  import CaptchaA from './CaptchaA.vue'
  import { updateOrderUser } from '/@/api/order'
  import ContactsTable from '/@/views/order/orderDetail/components/detail/components/contacts/contactsTable.vue'
  import UserAddressInfo from './userAddressInfo.vue'
  import { Input, Image, message } from 'ant-design-vue'
  import { PlusOutlined } from '@ant-design/icons-vue'
  import { uploadOCRApiNew } from '/@/api/sys/upload'

  export default defineComponent({
    name: 'UserModal',
    components: {
      BasicDrawer,
      BasicForm,
      ContactsTable,
      UserAddressInfo,
      Input,
      Image,
      PlusOutlined,
      CaptchaA,
    },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const cardFrontImage = ref(null)
      const cardBackImage = ref(null)
      const userInfo = ref(null)
      const oldCardFrontImg = ref(null)
      const oldCardBackImg = ref(null)
      const isChange = ref(false)
      const isSccues = ref<any>()
      const captchaVerify = ref('')
      const [registerForm, { setFieldsValue, updateSchema, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: userUpdateSchemas,
        // schemas: userFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      })
      const [registerDrawer, { closeDrawer, setDrawerProps }] = useDrawerInner(async (data) => {
        resetFields()
        setDrawerProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        const pdata: any = reactive(data.record?.userIdentify)
        cardFrontImage.value = pdata.cardFrontImage
        cardBackImage.value = pdata.cardBackImage
        userInfo.value = data.record?.userIdentify
        oldCardFrontImg.value = JSON.parse(JSON.stringify(pdata.cardFrontImage))
        oldCardBackImg.value = JSON.parse(JSON.stringify(pdata.cardBackImage))
        console.log(pdata.cardBackImage, 'cardBackImageSHow')
        if (unref(isUpdate)) {
          setFieldsValue({
            ...pdata,
            contacts: pdata,
          })
        }

        updateSchema([
          {
            field: 'channelCode',
            componentProps: { options: data.channelList },
          },
          {
            field: 'emergentRelation1',
            componentProps: { options: data.options },
          },
          {
            field: 'emergentRelation2',
            componentProps: { options: data.options },
          },
        ])
      })

      const getTitle = computed(() => (!unref(isUpdate) ? '新增用户' : '编辑用户'))

      function handleImage(img: any) {
        if (!img) return ''
        if (typeof img != 'string') {
          return img.join()
        }
      }
      function handleContactsChange(data: any) {
        setFieldsValue({
          emergentName1: data.emergentName1,
          emergentPhone1: data.emergentPhone1,
          emergentRelation1: data.emergentRelation1,
          emergentName2: data.emergentName2,
          emergentPhone2: data.emergentPhone2,
          emergentRelation2: data.emergentRelation2,
          emergents: data.emergents,
        })
      }
      async function uploadImgs() {
        return new Promise(async (resolve) => {
          const values = await validate()
          //如果没有验证码 显示验证码弹窗
          const dtoList = []
          if (
            cardFrontImage.value &&
            cardFrontImage.value?.indexOf('guangsu-v2.oss-cn-shanghai.aliyuncs.com') == -1
          ) {
            dtoList.push({
              uid: values.uid,
              code: 'idcard',
              side: 'front',
              ip: '',
              imageBase64: cardFrontImage.value?.split('data:image/jpeg;base64,')?.[1],
            })
          }
          if (
            cardBackImage.value &&
            cardBackImage.value.indexOf('guangsu-v2.oss-cn-shanghai.aliyuncs.com/') == -1
          ) {
            dtoList.push({
              uid: values.uid,
              code: 'idcard',
              side: 'back',
              ip: '',
              imageBase64: cardBackImage.value?.split('data:image/jpeg;base64,')?.[1],
            })
          }
          const res = await uploadOCRApiNew({
            dtoList,
            captchaVerifyParam: captchaVerify.value,
          })
          if (res.code != 200) {
            if (res.code == 501) {
              console.log(res, res.code != 200, 'resShow')
              isSccues.value = false
            } else {
              isSccues.value = true
              setTimeout(() => {
                message.warn(res.message)
              }, 500)
            }
            resolve('error')
            // return
          } else {
            isSccues.value = true
            const frontItem = res.data?.find((item) => item.side == 'front')
            const backItem = res.data?.find((item) => item.side == 'back')
            const dfrontIndex = dtoList.findIndex((item: any) => item.side == 'front')
            const dbackIndex = dtoList.findIndex((item: any) => item.side == 'back')
            console.log(dfrontIndex, frontItem, 'dfrontIndex')
            if (dfrontIndex > -1) {
              cardFrontImage.value = frontItem?.pic
              dtoList[dfrontIndex].imageBase64 = frontItem?.pic
            }
            if (dbackIndex > -1) {
              cardBackImage.value = backItem?.pic
              dtoList[dbackIndex].imageBase64 = backItem?.pic
            }
            resolve(JSON.parse(JSON.stringify(dtoList)))
          }
        })
      }
      async function handleSubmit() {
        try {
          return new Promise(async (resolve) => {
            const values = await validate()

            setDrawerProps({ confirmLoading: true })
            // TODO custom api
            if (!cardFrontImage.value) return message.warn('请上传身份证正面')
            if (!cardBackImage.value) return message.warn('请上传身份证正面')
            //调用上传照片
            uploadImgs().then(async (res) => {
              if (res == 'error') {
                resolve({ status: 'error', value: isSccues.value })
                console.log('我报错了', isSccues.value)
              } else {
                resolve({ status: 'ok', value: isSccues.value })
                if (!isChange.value) {
                  values['cardFrontImage'] = oldCardFrontImg?.value
                  values['cardBackImage'] = oldCardBackImg?.value
                } else {
                  let nimgFront = cardFrontImage.value
                  let nimgBack = cardBackImage.value
                  // 有修改
                  values['cardFrontImage'] = nimgFront
                  values['cardBackImage'] = nimgBack
                }
                values['cardHandImage'] = handleImage(values.cardHandImage)
                await updateOrderUser(values)
                setTimeout(() => {
                  message.success(`${getTitle.value}成功`)
                  closeDrawer()
                  emit('success')
                }, 1000)
              }
            })
          })
        } finally {
          setDrawerProps({ confirmLoading: false })
        }
      }
      const beforeCheck = () => {
        return new Promise(async (resolve) => {
          await validate()
          if (!cardFrontImage.value) return message.warn('请上传身份证正面')
          if (!cardBackImage.value) return message.warn('请上传身份证正面')
          resolve('ok')
        })
      }
      const getCaptchaCode = (payload) => {
        captchaVerify.value = payload
      }
      provide('handleSubmit', {
        handleSubmit,
        isSccues: isSccues.value,
      })
      const readImgToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          try {
            // 读取信息
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
              // 转base64结果
              const base64Url = reader.result
              resolve(base64Url)
            }

            reader.onerror = (err) => {
              reject(err)
            }
          } catch (error) {
            reject(error)
          }
        })
      }
      // 修改身份证图片
      const onChangeImgs = (event: any, side: string) => {
        const file = event.target.files[0]
        readImgToBase64(file).then((res) => {
          if (side == 'front') {
            cardFrontImage.value = res
          } else if (side == 'back') {
            cardBackImage.value = res
          }
        })
        isChange.value = true
      }
      // const closeHide = () => {
      //   document.getElementById('aliyunCaptcha-mask').style.height = 0
      //   document.getElementById('aliyunCaptcha-window-popup').style.height = 0
      //   document.getElementById('aliyunCaptcha-window-popup').style.padding = 0
      //   document.getElementById('aliyunCaptcha-window-popup').style.overflow = 'hidden'
      // }
      // 确认的操作
      // const confirmHanlder = () => {
      //   document.getElementById('aliyunCaptcha-mask').style.height = 0
      //   document.getElementById('aliyunCaptcha-window-popup').style.height = 0
      //   document.getElementById('aliyunCaptcha-window-popup').style.padding = 0
      //   document.getElementById('aliyunCaptcha-window-popup').style.overflow = 'hidden'
      //   beforeCheck?.().then((res) => {
      //     if (res == 'ok') {
      //       document.getElementById('aliyunCaptcha-mask').style.height = '100%'
      //       document.getElementById('aliyunCaptcha-window-popup').style.height = '350px'
      //       document.getElementById('aliyunCaptcha-window-popup').style.padding = '16px 16px 12px 16px'
      //       document.getElementById('aliyunCaptcha-window-popup').style.overflow = 'static'
      //     }
      //   })
      // }
      return {
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
        handleContactsChange,
        userInfo,
        onChangeImgs,
        cardFrontImage,
        cardBackImage,
        beforeCheck,
        getCaptchaCode,
        isSccues,
        // confirmHanlder,
      }
    },
  })
</script>
<style scoped>
  .ant-image {
    width: 100%;
    height: auto;
  }

  .uploadBtn {
    display: block;
    text-align: center;
    line-height: 80px;
    width: 180px;
    height: 80px;
    border: 1px dashed #ddd;
  }

  .modalCont {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 9999;
    margin: auto;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
  }

  .modalCont .childCont {
    width: 300px;
    height: 300px;
    background: #fff;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    border-radius: 16px;
  }

  .modalCont .cursor-pointer {
    width: 300px !important;
    height: 200px !important;
  }

  .modalCont .title {
    font-size: 20px;
    text-align: center;
    padding: 12px 0;
  }

  .modalCont .inputValue {
    display: flex;
    align-items: center;
    margin-top: 6px;
  }
  /* :gloobal  */
</style>
