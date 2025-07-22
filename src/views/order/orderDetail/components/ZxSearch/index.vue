<template>
  <div class="orderInfo">
    <Description
      :bordered="false"
      size="middle"
      :column="3"
      :data="detailInfo"
      :schema="infoSchema"
    />
    <Button type="primary" @click="onDownload" class="downloadBtn">
      下载征信授权&上报
      <Tooltip>
        <template #title>
          提示：<br />
          用户授权征信查询可下载<br />
          1、个人征信授权书<br />
          2、用户授权协议<br />
          订单征信上报成功可下载<br />
          3、融资租赁合同<br />
          4、担保合同<br />
        </template>
        <QuestionCircleOutlined />
      </Tooltip>
    </Button>
    <div class="centerBtn">
      <Button type="primary" @click="onSearchData">查询征信</Button>
    </div>
    <Description
      :bordered="false"
      size="middle"
      :column="3"
      :data="detailInfo"
      :schema="searchSchema"
    />
    <div class="bottomBtn">
      <Button style="margin-right: 8px" @click="openOtherWindow"> 打开浏览器查看报告 </Button>
      <Button type="primary" @click="onDownloadZxBg"> 下载征信报告 </Button>
    </div>

    <div class="webview">
      <iframe class="iframeContent" :src="zxPdfUrl" ref="iframeRef"></iframe>
      <!-- <div class="beforeDiv" ></div> -->
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { Button, message, Tooltip } from 'ant-design-vue'
  import { Description } from '/@/components/Description/index'
  import { infoSchema, searchSchema } from './data'
  import { ref, onMounted } from 'vue'
  import { downloadByData } from '/@/utils/file/download'
  import { getUserInfoApi, getQueryFasoApi, getRiskOrderDetail } from '/@/api/order/index'
  import { downloadForUrl } from '/@/api/sys/upload'
  import { QuestionCircleOutlined } from '@ant-design/icons-vue'
  import JSZip from 'jszip'
  import { saveAs } from 'file-saver'
  const props = {
    detailInfo: { type: Object },
  }
  export default defineComponent({
    components: {
      Description,
      Button,
      Tooltip,
      QuestionCircleOutlined,
    },
    props,
    setup(props) {
      const detailInfo = ref(null)
      const userInfo = ref(null)
      const timer = ref(null)
      const userDataZx = ref({})
      const zxPdfUrl = ref(null)
      const fileData = ref([])
      const isCompress = ref(false) // 是否启用压缩
      const compressionLevel = ref(6) // 压缩级别
      const packagingPercentage = ref(0) // 压缩进度
      // 轮询查找征信报告数据
      const getDatas = async () => {
        const res = await getQueryFasoApi({
          idCardNo: detailInfo.value?.userV0?.idCard,
          sourceType: 2,
          orderId: detailInfo?.value?.id,
          orderSn: detailInfo?.value?.orderSn,
        })
        if (res.data.code != 200) return
        const nres = res.data.data
        userDataZx.value = nres
        zxPdfUrl.value = userDataZx?.value?.asignPdfUrl
        if (userDataZx?.value?.asignPdfUrl) {
          clearInterval(timer.value)
        }
      }
      // 点击查询更新征信
      const onSearchData = async () => {
        const res = await getUserInfoApi({
          orderId: detailInfo?.value?.id,
          orderSn: detailInfo?.value?.orderSn,
          name: detailInfo?.value?.userV0?.nickName,
          phone: detailInfo?.value?.userV0?.phone,
          idCardNo: detailInfo?.value?.userV0?.idCard,
          sourceType: 2,
          extendData: {
            photoFront: detailInfo.value.userV0?.userIdentify?.cardFrontImage,
            photoBack: detailInfo.value.userV0?.userIdentify?.cardBackImage,
          },
        })
        const nres = res.data
        if (nres.code === 200) {
          message.success('已正常调用了查询征信，请等待结果')
        }
        if (nres.code == 500 && zxPdfUrl.value) {
          message.warn('请勿重复查询征信报告，' + nres.message.split('原因')[1])
        }
      }
      onMounted(async () => {
        // if (!props.detailInfo?.fsOrderId) return
        const res = await getRiskOrderDetail(props.detailInfo?.orderSn)
        detailInfo.value = Object.assign(props.detailInfo, { ...res }, { productCodeDiy: 'V012' })
        getDatas()
        timer.value = setInterval(() => {
          getDatas()
        }, 4000)
        return () => {
          if (timer.value) {
            clearInterval(timer.value)
          }
        }
      })
      // 下载报告
      const onDownload = async () => {
        const authUrl = detailInfo?.value?.signContract?.authUrl
        const pdfData = authUrl ? JSON.parse(authUrl) : authUrl
        const pdfUrl = pdfData?.pbcCreditAuth
        const userPdfUrl = pdfData?.userAuthProtocol
        const guaranteeContract = detailInfo.value?.guaranteeContract
        const leaseContract = detailInfo.value?.leaseContract
        const pbcCreditUseAuthUrl = pdfData?.pbcCreditUseAuth
        if (pdfUrl) await donwloadInit(pdfUrl, '征信授权.pdf')
        if (userPdfUrl) await donwloadInit(userPdfUrl, '用户授权.pdf')
        if (guaranteeContract) await donwloadInit(guaranteeContract, '担保合同.pdf')
        if (leaseContract) await donwloadInit(leaseContract, '融资租赁合同.pdf')
        if (pbcCreditUseAuthUrl)
          await donwloadInit(pbcCreditUseAuthUrl, '个人信息收集使用授权书.pdf')

        packagingPercentage.value = 0

        const zip = new JSZip()
        fileData.value.forEach((fileInfo) => {
          zip.file(fileInfo.fileName, fileInfo.file)
          packagingPercentage.value += 100 / fileData.value.length // 简化进度计算
        })

        let content: Blob

        if (isCompress.value) {
          content = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: compressionLevel.value },
          })
        } else {
          content = await zip.generateAsync({ type: 'blob' })
        }

        saveAs(content, '征信授权&上报.zip')
      }
      const donwloadInit = async (url: string, title: string) => {
        const res = await downloadForUrl(url)
        fileData.value.push({
          file: res.data,
          fileName: title,
        })
        // downloadByData(res.data, title )
      }
      //下载征信报告
      const onDownloadZxBg = async () => {
        const pdfUrl = userDataZx?.value?.asignPdfUrl
        const res = await downloadForUrl(pdfUrl)
        downloadByData(res.data, '征信报告.pdf')
      }
      const openOtherWindow = () => {
        if (!zxPdfUrl.value || zxPdfUrl.value === '') return
        window.open(zxPdfUrl.value)
      }
      return {
        detailInfo,
        userInfo,
        infoSchema,
        onDownload,
        onSearchData,
        searchSchema,
        onDownloadZxBg,
        openOtherWindow,
        zxPdfUrl,
      }
    },
  })
</script>

<style lang="less" scoped>
  .webview {
    position: relative;
  }

  .beforeDiv {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 99;
    width: 100%;
    height: 100%;
  }

  .orderInfo {
    position: relative;
  }

  .bottomBtn {
    float: right;
    margin-bottom: 20px;
    position: relative;
    z-index: 999;
  }

  .centerBtn {
    display: flex;
    justify-content: center;
    margin: 0 auto 20px;
  }

  .downloadBtn {
    position: absolute;
    right: 2%;
    top: 30px;
    z-index: 3;
  }

  .iframeContent {
    width: 100%;
    min-height: 500px;
  }

  .form-wrap {
    width: 450px;
    margin: 30px auto 0;
  }

  .button-group {
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;

    .orange {
      background-color: orange;
      border-color: orange;
    }
  }
</style>
