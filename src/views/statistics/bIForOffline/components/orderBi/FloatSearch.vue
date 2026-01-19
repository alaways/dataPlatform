<template>
  
  <div :class="showType == 'show' ? 'searchCont' : 'searchCont hideCont'">
    <Button link type="text" v-if="showType == 'show'" @click="()=>changeShowType('hide')">《收起</Button>
    <Button link type="text" v-if="showType == 'hide'" @click="()=>changeShowType('show')">展开排除数据》</Button>
    <Button @click="resetSelect" type="primary" v-if="showType == 'show'">重置数据</Button>
    <div class="searchtent" v-if="showType == 'show'">
      <div class="searchItem">
        <div class="searchTit">
          <span>排除城市</span>
          <Button @click="()=>openCity('hide')" v-if="cityShow == 'show'" link type="text">收起</Button>
          <Button @click="()=>openCity('show')" v-if="cityShow == 'hide'" link type="text">展开</Button>
        </div>
        <div></div>
        <!-- <Select 
          class="selectItem" 
          placeholder="请选择城市" 
          v-model:value="selectedCity" 
          :options="cityList" 
          showSearch
          :filterOption="filterOption"
          mode="multiple"
        ></Select> -->
        <CheckboxGroup v-if="cityShow == 'show'" v-model:value="selectedCity" :options="cityList" />
      </div>
      <div class="searchItem">
        <div class="searchTit">
          <span>排除商户</span>
          <Button @click="()=>openStore('hide')" v-if="storeShow == 'show'" link type="text">收起</Button>
          <Button @click="()=>openStore('show')" v-if="storeShow == 'hide'" link type="text">展开</Button>
        </div>
        
        <!-- <Select 
          class="selectItem" 
          placeholder="请选择城市" 
          v-model:value="selectedStore" 
          :options="storeList" 
          showSearch
          :filterOption="filterOption"
          mode="multiple"
        ></Select> -->
        <CheckboxGroup v-if="storeShow == 'show'" v-model:value="selectedStore" :options="storeList" />
      </div>
      <div class="searchItem">
        <div class="searchTit">
          <span>排除业务员</span>
          <Button @click="()=>openUser('hide')" v-if="userShow == 'show'" link type="text">收起</Button>
          <Button @click="()=>openUser('show')" v-if="userShow == 'hide'" link type="text">展开</Button>
        </div>
        <!-- <Select 
          class="selectItem" 
          placeholder="请选择城市" 
          v-model:value="selectedUser" 
          :options="userList" 
          showSearch
          :filterOption="filterOption"
          mode="multiple"
        ></Select> -->
        <CheckboxGroup v-if="userShow == 'show'" v-model:value="selectedUser" :options="userList" />
      </div>
    </div>
    <Button type="primary" v-if="showType == 'show'" class="bottomBtn" @click="onConfirm">确定</Button>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue'
  import { Checkbox, Button, Select } from 'ant-design-vue'
  import { querySearchData } from '/@/api/statistics/index'
  const CheckboxGroup = Checkbox.Group
  const props = {
    confirmFn: Function
  }
  export default defineComponent({
    name: 'TotalAllPie',
    components: { CheckboxGroup, Button, Select },
    props,
    setup(props) {
      const cityList = ref([])//城市
      const userList = ref([])//业务员
      const storeList = ref([]) //商户
      const selectedCity = ref([])
      const selectedUser = ref([])
      const selectedStore = ref([])
      const showType = ref('show')
      const cityShow = ref('show')
      const storeShow = ref('show')
      const userShow = ref('show')
      const getSearchData = async (type) => {
        const res = await querySearchData({type})
        const ndata = res?.data?.map(item => { 
            return {
              label: item, value: item
            }
          })
        if (type == 'ipCity') {
          cityList.value = ndata || []
        } else if (type == 'storeMerchantName') {
          storeList.value = ndata || []
        } else if (type == 'salesPersonName'){
          userList.value = ndata || []
        }
      }
      onMounted(() => {
        // type=ipCity: 查询城市
        // type=storeMerchantName: 商户名称
        // type=salesPersonName: 销售人员
        getSearchData('ipCity')
        getSearchData('storeMerchantName')
        getSearchData('salesPersonName')
      })
      const onConfirm = () => {
        // 提交给父级查询
        props.confirmFn({
          city: selectedCity.value,
          store: selectedStore.value,
          user: selectedUser.value
        })
        showType.value = 'hide'
        // console.log(selectedCity.value, selectedStore.value, selectedUser.value, 'valueShow')
      }
      const filterOption = (input, option) => {
        return option.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      };
      const changeShowType = (type) => {
        showType.value = type
      }
      const openCity = (type) => {
        cityShow.value = type
      }
      const openStore = (type) => {
        storeShow.value = type
      }
      const openUser = (type) => {
        userShow.value = type
      }
      const resetSelect = () => {
        selectedCity.value = []
        selectedStore.value = []
        selectedUser.value = []
      }
      return {
        cityList,
        storeList,
        userList,
        onConfirm,
        selectedCity,
        filterOption,
        selectedUser,
        selectedStore,
        showType,
        changeShowType,
        openCity,
        cityShow,
        storeShow,
        openStore,
        userShow,
        openUser,
        resetSelect,
      }
    },
  })
</script>
<style lang="less">
  .searchTit{
    font-weight: bold;
    font-style: 18px;
    padding: 20px 0;
  }
  .searchtent{
    width: 100%;
    height: calc(100% - 40px);
    
    overflow-y: auto;
  }
  
  .searchCont{
    padding: 20px;
    position: fixed;
    top:0;right:0;
    z-index: 999;
    width: 350px;
    height: 100%;
    background:#fff;
  }
  .selectItem{
    width: 100%;
    height: 30px;
  }
  .bottomBtn{
    width: 100%;
    margin-top: 10px;
  }
  .hideCont {
    width: 140px;
    height: 30px;
    top: 10%;
    background: skyblue;
    padding: 0;
    line-height: 30px;
  }
</style>
