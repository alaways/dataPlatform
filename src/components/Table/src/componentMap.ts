import type { Component } from 'vue'
import {
  Input,
  Select,
  Checkbox,
  InputNumber,
  Switch,
  DatePicker,
  TimePicker,
  InputGroup,
} from 'ant-design-vue'
import { ImageUpload } from '/@/components/Upload'
import type { ComponentType } from './types/componentType'
import { ApiSelect, ApiTreeSelect, ApiAutoComplete } from '/@/components/Form'

const componentMap = new Map<ComponentType, Component>()

componentMap.set('Input', Input)
componentMap.set('InputGroup', InputGroup)
componentMap.set('InputNumber', InputNumber)
componentMap.set('Select', Select)
componentMap.set('ApiSelect', ApiSelect)
componentMap.set('ApiAutoComplete', ApiAutoComplete)
componentMap.set('ApiTreeSelect', ApiTreeSelect)
componentMap.set('Switch', Switch)
componentMap.set('Checkbox', Checkbox)
componentMap.set('DatePicker', DatePicker)
componentMap.set('TimePicker', TimePicker)
componentMap.set('ImageUpload', ImageUpload)

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component)
}

export function del(compName: ComponentType) {
  componentMap.delete(compName)
}

export { componentMap }
