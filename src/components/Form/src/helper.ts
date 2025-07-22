import type { ValidationRule } from 'ant-design-vue/lib/form/Form'
import type { ComponentType } from './types/index'
import { useI18n } from '/@/hooks/web/useI18n'
import { dateUtil } from '/@/utils/dateUtil'
import { isNumber, isObject } from '/@/utils/is'
import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
dayjs.extend(quarterOfYear)

const { t } = useI18n()

/**
 * @description: 生成placeholder
 */
export function createPlaceholderMessage(component: ComponentType) {
  if (component.includes('Input') || component.includes('Complete')) {
    return t('common.inputText')
  }
  if (component.includes('Picker')) {
    return t('common.chooseText')
  }
  if (
    component.includes('Select') ||
    component.includes('Cascader') ||
    component.includes('Checkbox') ||
    component.includes('Radio') ||
    component.includes('Switch')
  ) {
    // return `请选择${label}`;
    return t('common.chooseText')
  }
  return ''
}

const DATE_TYPE = ['DatePicker', 'MonthPicker', 'WeekPicker', 'TimePicker']

function genType() {
  return [...DATE_TYPE, 'RangePicker']
}

export function setComponentRuleType(
  rule: ValidationRule,
  component: ComponentType,
  valueFormat: string,
) {
  if (['DatePicker', 'MonthPicker', 'WeekPicker', 'TimePicker'].includes(component)) {
    rule.type = valueFormat ? 'string' : 'object'
  } else if (['RangePicker', 'Upload', 'CheckboxGroup', 'TimePicker'].includes(component)) {
    rule.type = 'array'
  } else if (['InputNumber'].includes(component)) {
    rule.type = 'number'
  }
}

export function processDateValue(attr: Recordable, component: string) {
  const { valueFormat, value } = attr
  if (valueFormat) {
    attr.value = isObject(value) ? dateUtil(value).format(valueFormat) : value
  } else if (DATE_TYPE.includes(component) && value) {
    attr.value = dateUtil(attr.value)
  }
}

export function handleInputNumberValue(component?: ComponentType, val?: any) {
  if (!component) return val
  if (['Input', 'InputPassword', 'InputSearch', 'InputTextArea'].includes(component)) {
    return val && isNumber(val) ? `${val}` : val
  }
  return val
}

/**
 * 时间字段
 */
export const dateItemType = genType()

/**
 * 处理 DatePickerSelect 组件日期范围
 */
export function handleDatePickerSelect(label) {
  const today = dayjs()

  switch (label) {
    case '今天':
      return `${today.format('YYYY-MM-DD')}~${today.format('YYYY-MM-DD')}`
    case '昨天':
      const yesterday = today.subtract(1, 'day')
      return `${yesterday.format('YYYY-MM-DD')}~${yesterday.format('YYYY-MM-DD')}`
    case '明天':
      const tomorrow = today.add(1, 'day')
      return `${tomorrow.format('YYYY-MM-DD')}~${tomorrow.format('YYYY-MM-DD')}`
    case '本周':
      const startOfWeek = today.startOf('week')
      const endOfWeek = today.endOf('week')
      return `${startOfWeek.format('YYYY-MM-DD')}~${endOfWeek.format('YYYY-MM-DD')}`
    case '上周':
      const startOfLastWeek = today.subtract(1, 'week').startOf('week')
      const endOfLastWeek = today.subtract(1, 'week').endOf('week')
      return `${startOfLastWeek.format('YYYY-MM-DD')}~${endOfLastWeek.format('YYYY-MM-DD')}`
    case '下周':
      const startOfNextWeek = today.add(1, 'week').startOf('week')
      const endOfNextWeek = today.add(1, 'week').endOf('week')
      return `${startOfNextWeek.format('YYYY-MM-DD')}~${endOfNextWeek.format('YYYY-MM-DD')}`
    case '本月':
      const startOfMonth = today.startOf('month')
      const endOfMonth = today.endOf('month')
      return `${startOfMonth.format('YYYY-MM-DD')}~${endOfMonth.format('YYYY-MM-DD')}`
    case '上月':
      const startOfLastMonth = today.subtract(1, 'month').startOf('month')
      const endOfLastMonth = today.subtract(1, 'month').endOf('month')
      return `${startOfLastMonth.format('YYYY-MM-DD')}~${endOfLastMonth.format('YYYY-MM-DD')}`
    case '下月':
      const startOfNextMonth = today.add(1, 'month').startOf('month')
      const endOfNextMonth = today.add(1, 'month').endOf('month')
      return `${startOfNextMonth.format('YYYY-MM-DD')}~${endOfNextMonth.format('YYYY-MM-DD')}`
    case '本季度':
      const startOfQuarter = today.startOf('quarter')
      const endOfQuarter = today.endOf('quarter')
      return `${startOfQuarter.format('YYYY-MM-DD')}~${endOfQuarter.format('YYYY-MM-DD')}`
    case '上一季度':
      const startOfLastQuarter = today.subtract(1, 'quarter').startOf('quarter')
      const endOfLastQuarter = today.subtract(1, 'quarter').endOf('quarter')
      return `${startOfLastQuarter.format('YYYY-MM-DD')}~${endOfLastQuarter.format('YYYY-MM-DD')}`
    case '下一季度':
      const startOfNextQuarter = today.add(1, 'quarter').startOf('quarter')
      const endOfNextQuarter = today.add(1, 'quarter').endOf('quarter')
      return `${startOfNextQuarter.format('YYYY-MM-DD')}~${endOfNextQuarter.format('YYYY-MM-DD')}`
    case '本年度':
      const startOfYear = today.startOf('year')
      const endOfYear = today.endOf('year')
      return `${startOfYear.format('YYYY-MM-DD')}~${endOfYear.format('YYYY-MM-DD')}`
    case '上一年度':
      const startOfLastYear = today.subtract(1, 'year').startOf('year')
      const endOfLastYear = today.subtract(1, 'year').endOf('year')
      return `${startOfLastYear.format('YYYY-MM-DD')}~${endOfLastYear.format('YYYY-MM-DD')}`
    case '下一年度':
      const startOfNextYear = today.add(1, 'year').startOf('year')
      const endOfNextYear = today.add(1, 'year').endOf('year')
      return `${startOfNextYear.format('YYYY-MM-DD')}~${endOfNextYear.format('YYYY-MM-DD')}`
    default:
      return ''
  }
}
