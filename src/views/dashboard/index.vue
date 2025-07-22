<script setup lang="ts">
  import { Card, Col, Row } from 'ant-design-vue'
</script>

<template>
  <div class="p-4">
    <h1>欢迎</h1>
    <Row :gutter="12" class="m-5">
      <Col :span="23">
        <Card> 欢迎使用光速科技后台管理系统 </Card>
      </Col>
    </Row>
  </div>
</template>
