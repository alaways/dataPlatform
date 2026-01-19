# 后台开发 - 更新文档

## 修改版本的同时，请到 package.json 修改 version 每次修改都要如此

### 提交必须用 git commit -m "feat: xxx", 不能使用略过

=================================

## 1.0.3

### 配置

- 修改验证码
- 修改网络的整体配置
- 添加 API2 和所有的统计网络请求

## 1.0.2

### 风控信息

- 处理缓存问题
- 添加法院裁判文书和法院被执行人-高级版
- 修改部分字段

## 1.0.1

### 订单详情

- 添加 风控信息 对接字段 riskoriginalInfoBaiRongRuleSpecialListC 通过 id 查询非银(含全部非银类型)数据
- 修复 租后管理 少加了 已付租金（不退还）的 key 值:downPaymentRentAmount

## 1.0.0

### 首次开发

- 新增 ReleaseNotes 文档
- 新增 权限管理 system
- 新增 商品管理 goods
- 新增 风控管理 riskControl
- 新增 订单管理 order
- 完善 登录功能
- 修改 路由配置 - 后台返回
