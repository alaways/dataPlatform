<template>
  <AutoComplete
    @dropdownVisibleChange="handleFetch"
    v-bind="$attrs"
    @change="handleChange"
    :options="getOptions"
    @search="handleSearch"
    @blur="handleBlur"
    v-model:value="state"
  >
    <template #suffixIcon v-if="loading">
      <LoadingOutlined spin />
    </template>
    <template #notFoundContent v-if="loading">
      <span>
        <LoadingOutlined spin class="mr-1" />
        {{ t('component.form.apiSelectNotFound') }}
      </span>
    </template>
  </AutoComplete>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, watchEffect, computed, unref, watch } from 'vue'
  import { AutoComplete } from 'ant-design-vue'
  import { isFunction } from '/@/utils/is'
  import { useRuleFormItem } from '/@/hooks/component/useFormItem'
  import { useAttrs } from '/@/hooks/core/useAttrs'
  import { get, omit } from 'lodash-es'
  import { LoadingOutlined } from '@ant-design/icons-vue'
  import { useI18n } from '/@/hooks/web/useI18n'
  import { propTypes } from '/@/utils/propTypes'
  import { Recordable } from 'vite-plugin-mock'

  type OptionsItem = { label: string; value: string; disabled?: boolean }

  export default defineComponent({
    name: 'ApiAutoComplete',
    components: {
      AutoComplete,
      LoadingOutlined,
    },
    inheritAttrs: false,
    props: {
      value: [Array, Object, String, Number],
      numberToString: propTypes.bool,
      api: {
        type: Function as PropType<(arg?: Recordable) => Promise<OptionsItem[]>>,
        default: null,
      },
      // api params
      params: {
        type: Object as PropType<Recordable>,
        default: () => ({}),
      },
      // support xxx.xxx.xx
      resultField: propTypes.string.def(''),
      labelField: propTypes.string.def('label'),
      valueField: propTypes.string.def('value'),
      immediate: propTypes.bool.def(true),
    },
    emits: ['options-change', 'change', 'blue'],
    setup(props, { emit }) {
      const options = ref<OptionsItem[]>([])
      const searchValue = ref<string>('')
      const loading = ref(false)
      const isFirstLoad = ref(true)
      const emitData = ref<any[]>([])
      const attrs = useAttrs()
      const { t } = useI18n()

      // Embedded in the form, just use the hook binding to perform form verification
      const [state] = useRuleFormItem(props, 'value', 'change', emitData)

      const getOptions = computed(() => {
        const { labelField, valueField, numberToString } = props

        const olist = unref(options).reduce((prev, next: Recordable) => {
          if (next) {
            const value = next[labelField]
            prev.push({
              ...omit(next, [labelField, valueField]),
              label: next[labelField],
              value: numberToString ? `${value}` : value,
            })
          }
          return prev
        }, [] as OptionsItem[])
        if (!searchValue.value) {
          return olist
        }
        // 组件bug，当首字母没有查到直接失焦
        const flist = olist.filter((v) => v.label.indexOf(searchValue.value) >= 0)

        if (!flist.length && searchValue.value.length == 1) {
          return olist
        }
        return flist
      })

      watchEffect(() => {
        props.immediate && fetch()
      })

      watch(
        () => props.params,
        () => {
          !unref(isFirstLoad) && fetch()
        },
        { deep: true },
      )

      async function fetch() {
        const api = props.api
        if (!api || !isFunction(api)) return
        options.value = []
        try {
          loading.value = true
          const res = await api(props.params)
          if (Array.isArray(res)) {
            options.value = res
            emitChange()
            return
          }
          if (props.resultField) {
            options.value = get(res, props.resultField) || []
          }
          emitChange()
        } catch (error) {
          console.warn(error)
        } finally {
          loading.value = false
        }
      }

      async function handleFetch() {
        if (!props.immediate && unref(isFirstLoad)) {
          await fetch()
          isFirstLoad.value = false
        }
      }

      function emitChange() {
        emit('options-change', unref(getOptions))
      }

      function handleSearch(e) {
        searchValue.value = e
      }

      function handleBlur() {
        const data = emitData.value
        // 判断填的情况
        const bool = data && data[0] && Object.keys(data).length
        if (bool) {
          const find = getOptions.value.find((v) => v.label == searchValue.value)
          if (find) {
            emit('blue', find)
          } else {
            emit('blue', '')
          }
        }
      }

      function handleChange(_, ...args) {
        emitData.value = args
      }

      return {
        state,
        attrs,
        getOptions,
        loading,
        t,
        handleBlur,
        handleFetch,
        handleChange,
        handleSearch,
      }
    },
  })
</script>
