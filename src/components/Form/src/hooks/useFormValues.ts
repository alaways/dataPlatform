import { isArray, isFunction, isObject, isString } from '/@/utils/is'
import { dateUtil } from '/@/utils/dateUtil'
import { unref } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { FormProps, FormSchema } from '../types/form'
import { cloneDeep, isNil, set } from 'lodash-es'

interface UseFormValuesContext {
  defaultValueRef: Ref<any>
  getSchema: ComputedRef<FormSchema[]>
  getProps: ComputedRef<FormProps>
  formModel: Recordable
}
export function useFormValues({
  defaultValueRef,
  getSchema,
  formModel,
  getProps,
}: UseFormValuesContext) {
  // Processing form values
  function handleFormValues(values: Recordable) {
    if (!isObject(values)) {
      return {}
    }
    const res: Recordable = {}
    for (const item of Object.entries(values)) {
      let [, value] = item
      const [key] = item
      if (!key || (isArray(value) && value.length === 0) || isFunction(value)) {
        continue
      }
      const transformDateFunc = unref(getProps).transformDateFunc
      if (isObject(value)) {
        value = transformDateFunc?.(value)
      }
      if (isArray(value) && value[0]?._isAMomentObject && value[1]?._isAMomentObject) {
        value = value.map((item) => transformDateFunc?.(item))
      }
      // Remove spaces
      if (isString(value)) {
        value = value.trim()
      }
      set(res, key, value)
    }
    return handleRangeTimeValue(res)
  }

  /**
   * @description: Processing time interval parameters
   */
  function handleRangeTimeValue(values: Recordable) {
    const fieldMapToTime = unref(getProps).fieldMapToTime

    if (!fieldMapToTime || !Array.isArray(fieldMapToTime)) {
      return values
    }

    for (const [field, [startTimeKey, endTimeKey], format = 'YYYY-MM-DD'] of fieldMapToTime) {
      if (!field || !startTimeKey || !endTimeKey || !values[field]) {
        continue
      }

      const [startTime, endTime]: string[] = values[field]

      values[startTimeKey] = dateUtil(startTime).format(format)
      values[endTimeKey] = dateUtil(endTime).format(format)
      Reflect.deleteProperty(values, field)
    }

    return values
  }

  function initDefault() {
    const schemas = unref(getSchema)
    const obj: Recordable = {}
    schemas.forEach((item) => {
      const { defaultValue, defaultValueObj, componentProps = {} } = item
      const fieldKeys = Object.keys(defaultValueObj || {})
      if (fieldKeys.length) {
        fieldKeys.forEach((field) => {
          obj[field] = defaultValueObj![field]
          if (formModel[field] === undefined) {
            formModel[field] = defaultValueObj![field]
          }
        })
      }
      if (!isNil(defaultValue)) {
        obj[item.field] = defaultValue

        if (formModel[item.field] === undefined) {
          formModel[item.field] = defaultValue
        }
      }
      if (!isNil(componentProps?.defaultValue)) {
        obj[item.field] = componentProps?.defaultValue
        if (formModel[item.field] === undefined) {
          formModel[item.field] = componentProps?.defaultValue
        }
      }
    })
    defaultValueRef.value = cloneDeep(obj)
  }

  return { handleFormValues, initDefault }
}
