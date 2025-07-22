<template>
  <Row class="commonTable">
    <template v-for="(item, index) in list">
      <Col
        v-if="!item.hide"
        :key="index"
        class="ul"
        :class="{ bn: !item.title }"
        :span="item.span || span"
      >
        <div class="li" v-if="item.title">
          <div class="head"> {{ item.title }}</div>
          <div v-if="!item.noCon" class="con bt" :style="{ color: item.color }">{{
            item.value
          }}</div>
        </div>
      </Col>
    </template>
  </Row>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'

  import { Col, Row } from 'ant-design-vue'
  const props = {
    list: { type: Array },
    span: { type: Number },
  }
  export default defineComponent({
    components: { Row, Col },
    props,
    setup(props) {
      const list: any = ref(props.list)
      const span: any = ref(props.span)

      return { list, span }
    },
  })
</script>
<style lang="less" scoped>
  .commonTable {
    background: #fff;

    .ul {
      border: 1px solid #e8e8e8;

      .li {
        text-align: center;
        display: flex;
        flex-direction: column;
        height: 100px;

        .head {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          flex: 1;
          background: #fafafa;
          padding: 0 10px;
          box-sizing: border-box;
        }

        .con {
          display: flex;
          flex-direction: row;
          flex: 1;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .bt {
      border-top: 1px solid #e8e8e8;
    }

    .bl {
      border-left: 1px solid #e8e8e8;
    }

    .bn {
      border: none;
    }

    .ant-col-3 {
      max-width: 14.28% !important;
      flex: 0 0 14.28% !important;
    }

    .ant-col-5 {
      max-width: 20% !important;
    }
  }
</style>
