import { h } from 'vue'
import { DescItem } from '/@/components/Description/index'
import { BasicColumn } from '/@/components/Table/src/types/table'
import { Tag } from 'ant-design-vue'

// 风控基本信息
export const riskSchema: DescItem[] = [
  {
    field: 'gsScore',
    label: '光速评分',
    render: (value) => value || '-',
  },
  // {
  //   field: 'level',
  //   label: '客户等级',
  //   render: (value) => value || '-',
  // },
  {
    // 1建议通过，2建议人审，3建议拒绝
    field: 'riskProposalStatus',
    label: '风控建议',
    render: (value) => {
      const params = {
        1: {
          txt: '建议通过',
          color: 'green',
        },
        2: {
          txt: '建议人审',
          color: 'orange',
        },
        3: {
          txt: '建议拒绝',
          color: 'red',
        },
      }

      if (value) {
        return h(Tag, { color: params[value].color || 'orange' }, params[value].txt || '暂无建议')
      } else {
        return h(Tag, { color: 'orange' }, '暂无建议')
      }
    },
  },
  {
    field: 'riskNewCalInfo.onlineDescription',
    label: '在网时长',
    render: (value) => value || '-',
  },
]

export const esSchema: DescItem[] = [
  {
    field: 'es',
    label: '',
    render: () => '规则说明',
  },
  {
    field: 'es1',
    label: '',
    render: () => '1. 光速分分数越低表示客户资质越好；超过85分的谨慎准入，审核时需更加严格。',
  },
  {
    field: 'es2',
    label: '',
    render: () => '2. B级和C级客户资质不予准入；S级整体优于A级。',
  },
  {
    field: 'es3',
    label: '',
    render: () => '3. 光速分通过的客户，需要人审再核实资质。',
  },
]

export const tableSchema: BasicColumn[] = [
  // {
  //   title: '规则代码',
  //   dataIndex: 'ruleCode',
  //   customRender: ({ text }) => text || '-',
  // },
  // {
  //   title: '拒绝码',
  //   dataIndex: 'rejectCode',
  //   customRender: ({ text }) => text || '-',
  // },
  {
    title: '潜在风险',
    dataIndex: 'rejectCodeToStr',
    align: 'left',
    customHeaderRender(column) {
      return (
        <div>
          <span style="color: red;">{column.customTitle}</span>
        </div>
      )
    },
  },
  // {
  //   title: '是否命中',
  //   dataIndex: 'result',
  //   customRender: ({ text }) => (
  //     <Tag color={text ? 'green' : 'red'}>{() => (text ? '是' : '否')}</Tag>
  //   ),
  // },
]
/**
 * 新颜 - 数据
 */
export const riskControlList: any = [
  {
    name: '特殊名单验证',
    span: 8,
    children: [
      {
        value: '-',
        title: '通过id查询法院失信人',
        key: 'court_bad',
        color: 'red',
      },
      {
        value: '-',
        title: '通过id查询法院被执行人',
        key: 'court_executed',
        color: 'red',
      },
      {
        value: '',
        title: '',
        key: '',
      },
      {
        value: '-',
        title: '通过id查询法院失信人命中次数',
        key: 'court_bad_allnum',
        color: 'red',
      },
      {
        value: '-',
        title: '通过id查询法院被执行人命中次数',
        key: 'court_executed_allnum',
        color: 'red',
      },
    ],
  },
  {
    title: '法院信息详情',
    name: '法院信息详情-个人高级版',
    children: [],
  },
  {
    title: '限高明细',
    name: '法院被执行人-限高版-限高明细',
    children: [],
  },
  {
    title: '失信明细',
    name: '法院被执行人-限高版-失信明细',
    children: [],
  },
  {
    title: '法院裁判文书',
    name: '法院裁判文书',
    children: [],
    hide: true,
  },
  {
    title: '反欺诈规则',
    name: '反欺诈规则-法院被执行人',
    children: [],
    hide: true,
  },
  {
    title: '法院被执行人—高级版',
    name: '法院被执行人—高级版',
    children: [],
    hide: true,
  },
  {
    // 新颜探针C
    name: '逾期履约报告',
    span: 6,
    children: [
      {
        value: '-',
        title: '最大逾期金额',
        key: 'max_overdue_amt',
        span: 5,
        color: 'red',
      },
      {
        value: '-',
        title: '最长逾期天数',
        key: 'max_overdue_days',
        span: 5,
        color: 'red',
      },
      {
        value: '-',
        title: '最近逾期时间',
        key: 'latest_overdue_time',
        span: 5,
        color: 'red',
      },
      {
        value: '-',
        title: '当前逾期机构数',
        key: 'currently_overdue',
        span: 5,
        color: 'red',
      },
      {
        value: '-',
        title: '最大履约金额',
        key: 'max_performance_amt',
        span: 5,
        color: 'red',
      },
      {
        value: '-',
        title: '最近履约时间',
        key: 'latest_performance_time',
        span: 5,
        color: 'red',
      },
      {
        value: '-',
        title: '履约笔数',
        key: 'count_performance',
        span: 5,
        color: 'red',
      },
      {
        value: '-',
        title: '当前履约机构数',
        key: 'currently_performance',
        span: 5,
        color: 'red',
      },
      {
        value: '-',
        title: '异常还款机构数',
        key: 'acc_exc',
        span: 5,
        color: 'red',
      },
      {
        value: '-',
        title: '睡眠机构数',
        key: 'acc_sleep',
        span: 5,
        color: 'red',
      },
      {
        value: '-',
        title: '通过id查询非银(含全部非银类型)一般风险',
        key: 'nbank_overdue',
        span: 8,
        color: 'red',
      },
      {
        value: '-',
        title: '通过id查询非银(含全部非银类型)中风险',
        key: 'nbank_bad',
        span: 8,
        color: 'red',
      },
      {
        value: '-',
        title: '通过id查询非银(含全部非银类型)高风险',
        key: 'nbank_lost',
        span: 8,
        color: 'red',
      },
    ],
  },
  // {
  //   name: '风险数据',
  //   span: 8,
  //   children: [
  //     {
  //       value: '-',
  //       title: '通过id查询非银(含全部非银类型)中风险',
  //       key: 'nbank_bad',
  //     },
  //     {
  //       value: '-',
  //       title: '通过id查询非银(含全部非银类型)一般风险',
  //       key: 'nbank_overdue',
  //     },
  //     {
  //       value: '-',
  //       title: '通过id查询非银(含全部非银类型)高风险',
  //       key: 'nbank_lost',
  //     },
  //     {
  //       value: '-',
  //       title: '通过id查询非银-持牌融资租赁中风险',
  //       key: 'nbank_finlea_bad',
  //     },
  //     {
  //       value: '-',
  //       title: '通过id查询非银-持牌融资租赁一般风险',
  //       key: 'nbank_finlea_overdue',
  //     },
  //     {
  //       value: '-',
  //       title: '通过id查询非银-持牌融资租赁高风险',
  //       key: 'nbank_finlea_lost',
  //     },
  //     {
  //       value: '-',
  //       title: '通过id查询非银-持牌网络小贷中风险',
  //       key: 'nbank_nsloan_bad',
  //     },
  //     {
  //       value: '-',
  //       title: '通过id查询非银-持牌网络小贷一般风险',
  //       key: 'nbank_nsloan_overdue',
  //     },
  //     {
  //       value: '-',
  //       title: '通过id查询非银-持牌网络小贷高风险',
  //       key: 'nbank_nsloan_lost',
  //     },
  //   ],
  // },
  {
    name: '逾期报告',
    span: 8,
    children: [
      {
        value: '-',
        title: '近6个月M0+逾期贷款笔数',
        key: 'B22170025',
      },
      {
        value: '-',
        title: '近12个月M0+逾期贷款笔数',
        key: 'B22170026',
      },
      {
        value: '-',
        title: '近24个月M0+逾期贷款笔数',
        key: 'B22170027',
      },
      {
        value: '-',
        title: '近6个月M1+逾期贷款笔数',
        key: 'B22170028',
      },
      {
        value: '-',
        title: '近12个月M1+逾期贷款笔数',
        key: 'B22170029',
      },
      {
        value: '-',
        title: '近24个月M1+逾期贷款笔数',
        key: 'B22170030',
      },
    ],
  },
  {
    hide: true,
    name: '逾期数据',
    span: 6,
    children: [
      {
        value: '-',
        title: '1周内申请人逾期次数',
        key: 'f1',
      },
      {
        value: '-',
        title: '1个月内申请人逾期次数',
        key: 'f3',
      },
      {
        value: '-',
        title: '3个月内申请人逾期次数',
        key: 'f5',
      },
      {
        value: '-',
        title: '6个月内申请人逾期次数',
        key: 'f7',
      },
      {
        value: '-',
        title: '12个月内申请人逾期次数',
        key: 'f9',
      },
      {
        value: '-',
        title: '1周内申请人逾期银行次数',
        key: 'f13',
      },
      {
        value: '-',
        title: '1个月内申请人逾期银行次数',
        key: 'f15',
      },
      {
        value: '-',
        title: '3个月内申请人逾期银行次数',
        key: 'f17',
      },
      {
        value: '-',
        title: '6个月内申请人逾期银行次数',
        key: 'f19',
      },
      {
        value: '-',
        title: '12个月内申请人逾期银行次数',
        key: 'f21',
      },
      {
        value: '-',
        title: '1周内申请人逾期贷款超市次数',
        key: 'f61',
      },
      {
        value: '-',
        title: '1个月内申请人逾期贷款超市次数',
        key: 'f63',
      },
      {
        value: '-',
        title: '3个月内申请人逾期贷款超市次数',
        key: 'f65',
      },
      {
        value: '-',
        title: '6个月内申请人逾期贷款超市次数',
        key: 'f67',
      },
      {
        value: '-',
        title: '12个月内申请人逾期贷款超市次数',
        key: 'f69',
      },
    ],
  },
  {
    name: '还款报告',
    hide: true,
    span: 5,
    children: [
      {
        value: '-',
        title: '近1个月失败扣款笔数',
        key: 'B22170035',
      },
      {
        value: '-',
        title: '近3个月失败扣款笔数',
        key: 'B22170036',
      },
      {
        value: '-',
        title: '近6个月失败扣款笔数',
        key: 'B22170037',
      },
      {
        value: '-',
        title: '近12个月失败扣款笔数',
        key: 'B22170038',
      },
      {
        value: '-',
        title: '近24个月失败扣款笔数',
        key: 'B22170039',
      },
      {
        value: '-',
        title: '近1个月履约总金额',
        key: 'B22170040',
      },
      {
        value: '-',
        title: '近3个月履约总金额',
        key: 'B22170041',
      },
      {
        value: '-',
        title: '近6个月履约总金额',
        key: 'B22170042',
      },
      {
        value: '-',
        title: '近12个月履约总金额',
        key: 'B22170043',
      },
      {
        value: '-',
        title: '近24个月履约总金额',
        key: 'B22170044',
      },
    ],
  },
  {
    name: '行为报告',
    span: 6,
    children: [
      {
        value: '-',
        title: '贷款行为分',
        key: 'B22170001',
        hide: true,
      },
      {
        value: '-',
        title: '消金建议授信额度',
        key: 'C22180011',
        hide: true,
      },
      {
        value: '',
        title: '',
        key: '',
        hide: true,
      },
      {
        value: '-',
        title: '近1个月贷款笔数',
        key: 'B22170002',
        hide: true,
      },
      {
        value: '-',
        title: '近3个月贷款笔数',
        key: 'B22170003',
        hide: true,
      },
      {
        value: '-',
        title: '近6个月贷款笔数',
        key: 'B22170004',
        hide: true,
      },
      {
        value: '-',
        title: '近12个月贷款笔数',
        key: 'B22170005',
        hide: true,
      },
      {
        value: '-',
        title: '近1个月贷款总金额',
        key: 'B22170007',
        hide: true,
      },
      {
        value: '-',
        title: '近3个月贷款总金额',
        key: 'B22170008',
        hide: true,
      },
      {
        value: '-',
        title: '近6个月贷款总金额',
        key: 'B22170009',
        hide: true,
      },
      {
        value: '-',
        title: '近12个月贷款总金额',
        key: 'B22170010',
        hide: true,
      },
      {
        value: '-',
        title: '近24个月贷款总金额',
        key: 'B22170011',
        hide: true,
      },
      {
        value: '-',
        title: '信用贷款时长',
        key: 'B22170053',
        hide: true,
      },
      {
        value: '-',
        title: '正常还款订单数占贷款总订单数比例',
        key: 'B22170034',
        color: 'red',
        span: 6,
      },
      {
        value: '-',
        title: '贷款已结清订单数',
        key: 'B22170052',
        color: 'red',
        span: 6,
      },
      {
        value: '-',
        title: '网贷建议授信额度',
        key: 'C22180001',
        color: 'red',
        span: 6,
      },
      {
        value: '无',
        title: '最近一次贷款放款时间',
        key: 'B22170054',
        span: 6,
      },
    ],
  },
  {
    name: '申请多头',
    span: 6,
    children: [
      // {
      //   value: '-',
      //   title: '申请准入分',
      //   key: 'A22160001',
      // },
      // {
      //   value: '-',
      //   title: '申请准入置信度',
      //   key: 'A22160002',
      // },
      // {
      //   value: '',
      //   title: '',
      //   color: '',
      // },
      // {
      //   value: '',
      //   title: '',
      //   color: '',
      // },
      {
        value: '-',
        title: '申请命中机构数',
        key: 'A22160003',
        color: 'red',
      },
      {
        value: '-',
        title: '申请命中消金类机构数',
        key: 'A22160004',
        color: 'red',
        span: 6,
      },
      {
        value: '-',
        title: '申请命中网络贷款类机构数',
        key: 'A22160005',
        color: 'red',
      },
      {
        value: '-',
        title: '机构总查询次数',
        key: 'A22160006',
        color: 'red',
      },
      {
        value: '-',
        title: '最近查询时间',
        key: 'A22160007',
        color: 'red',
      },
      {
        value: '-',
        title: '近1个月总查询笔数',
        key: 'A22160008',
        color: 'red',
      },
      {
        value: '-',
        title: '近3个月总查询笔数',
        key: 'A22160009',
        hide: true,
      },
      {
        value: '-',
        title: '近6个月总查询笔数',
        key: 'A22160010',
        hide: true,
      },
      {
        value: '-',
        title: '最早一次查询距今的天数',
        key: 'v189',
        color: 'red',
      },
      {
        value: '-',
        title: '最近一次查询距今的天数',
        key: 'v190',
        color: 'red',
      },
    ],
  },
  {
    name: '申请多头',
    hide: true,
    span: 5,
    children: [
      {
        value: '-',
        title: '7天内总申请次数',
        key: 'v1',
      },
      {
        value: '-',
        title: '7天内银行申请次数',
        key: 'v2',
      },
      {
        value: '-',
        title: '7天内持牌消金申请次数',
        key: 'v3',
      },
      {
        value: '-',
        title: '7天内互金申请次数',
        key: 'v4',
      },
      {
        value: '-',
        title: '7天内金融科技申请次数',
        key: 'v5',
      },
      {
        value: '-',
        title: '30天内总申请次数',
        key: 'v13',
      },
      {
        value: '-',
        title: '30天内银行申请次数',
        key: 'v14',
      },
      {
        value: '-',
        title: '30天内持牌消金申请次数',
        key: 'v15',
      },
      {
        value: '-',
        title: '30天内互金申请次数',
        key: 'v16',
      },
      {
        value: '-',
        title: '30天内金融科技申请次数',
        key: 'v17',
      },
      {
        value: '-',
        title: '90天内总申请次数',
        key: 'v25',
      },
      {
        value: '-',
        title: '90天内银行申请次数',
        key: 'v26',
      },
      {
        value: '-',
        title: '90天内持牌消金申请次数',
        key: 'v27',
      },
      {
        value: '-',
        title: '90天内互金申请次数',
        key: 'v28',
      },
      {
        value: '-',
        title: '90天内金融科技申请次数',
        key: 'v28',
      },
      {
        value: '-',
        title: '7天银行申请白天平台数',
        key: 'v91',
      },
      {
        value: '-',
        title: '30天银行申请白天平台数',
        key: 'v93',
      },
      {
        value: '-',
        title: '90天银行申请白天平台数',
        key: 'v95',
      },
      {
        value: '',
        title: '',
        key: '',
      },
      {
        value: '',
        title: '',
        key: '',
      },
      {
        value: '-',
        title: '7天银行申请夜晚平台数',
        key: 'v96',
      },
      {
        value: '-',
        title: '30天银行申请夜晚平台数',
        key: 'v98',
      },
      {
        value: '-',
        title: '90天银行申请夜晚平台数',
        key: 'v100',
      },
      {
        value: '',
        title: '',
        key: '',
      },
      {
        value: '',
        title: '',
        key: '',
      },
      {
        value: '-',
        title: '最早一次查询距今的天数',
        key: 'v189',
      },
      {
        value: '-',
        title: '最近一次查询距今的天数',
        key: 'v190',
      },
      {
        value: '',
        title: '',
        key: '',
      },
      {
        value: '',
        title: '',
        key: '',
      },
      {
        value: '',
        title: '',
        key: '',
      },
    ],
  },
  {
    title: '借贷多头',
    name: '借贷多头',
    children: [],
  },
  // {
  //   title: '当天借贷多头',
  //   name: '当天借贷多头',
  //   children: [],
  // },
  {
    title: '租赁多头',
    name: '租赁多头',
    children: [],
  },
  {
    name: '反欺诈规则-特殊名单验证',
    span: 5,
    children: [
      {
        value: '-',
        title: '近两年命中法院失信人权重',
        key: 'odr0000331',
      },
      {
        value: '-',
        title: '两年前命中法院失信人权重',
        key: 'odr0000332',
      },
      {
        value: '-',
        title: '近两年命中法院被执行人权重',
        key: 'odr0000333',
      },
      {
        value: '-',
        title: '两年前命中法院被执行人权重',
        key: 'odr0000334',
      },
      {
        value: '-',
        title: '近两年命中银行高风险权重',
        key: 'odr0000335',
      },
      {
        value: '-',
        title: '两年前命中银行高风险权重',
        key: 'odr0000336',
      },
      {
        value: '-',
        title: '近两年命中银行中风险权重',
        key: 'odr0000337',
      },
      {
        value: '-',
        title: '两年前命中银行中风险权重',
        key: 'odr0000338',
      },
      {
        value: '-',
        title: '近两年命中银行一般风险权重',
        key: 'odr0000339',
      },
      {
        value: '-',
        title: '两年前命中银行一般风险权重',
        key: 'odr0000340',
      },
      {
        value: '-',
        title: '近两年命中非银高风险权重',
        key: 'odr0000341',
      },
      {
        value: '-',
        title: '两年前命中非银高风险权重',
        key: 'odr0000342',
      },
      {
        value: '-',
        title: '近两年命中非银中风险权重',
        key: 'odr0000343',
      },
      {
        value: '-',
        title: '两年前命中非银中风险权重',
        key: 'odr0000344',
      },
      {
        value: '-',
        title: '近两年命中非银一般风险权重',
        key: 'odr0000345',
      },
      {
        value: '-',
        title: '两年前命中非银一般风险权重',
        key: 'odr0000346',
      },
      {
        value: '-',
        title: '命中银行中风险次数较多权重',
        key: 'odr0000347',
      },
      {
        value: '-',
        title: '命中银行一般风险次数较多权重',
        key: 'odr0000348',
      },
      {
        value: '-',
        title: '命中非银中风险次数较多权重',
        key: 'odr0000349',
      },
      {
        value: '-',
        title: '命中非银一般风险次数较多权重',
        key: 'odr0000350',
      },
    ],
  },
]
