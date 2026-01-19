<template>
  <Select
    @dropdownVisibleChange="handleFetch"
    v-bind="$attrs"
    @change="handleChange"
    :options="getOptions"
    :show-search="isShowSearch"
    v-model:value="state"
    optionFilterProp="label"
    @search="handleSearch"
    @inputKeyDown="handleInputKeyDown"
  >
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
    <template #suffixIcon v-if="loading">
      <LoadingOutlined spin />
    </template>
    <template #notFoundContent v-if="loading">
      <span>
        <LoadingOutlined spin class="mr-1" />
        {{ t('component.form.apiSelectNotFound') }}
      </span>
    </template>
  </Select>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, watchEffect, computed, unref, watch } from 'vue'
  import { Select } from 'ant-design-vue'
  import { isFunction } from '/@/utils/is'
  import { useRuleFormItem } from '/@/hooks/component/useFormItem'
  import { useAttrs } from '/@/hooks/core/useAttrs'
  import { get, omit } from 'lodash-es'
  import { LoadingOutlined } from '@ant-design/icons-vue'
  import { useI18n } from '/@/hooks/web/useI18n'
  import { propTypes } from '/@/utils/propTypes'

  type OptionsItem = { label: string; value: string; disabled?: boolean }

  export default defineComponent({
    name: 'ApiSelect',
    components: {
      Select,
      LoadingOutlined,
    },
    inheritAttrs: false,
    props: {
      value: [Array, Object, String, Number],
      numberToString: propTypes.bool,
      showSearch: Boolean,
      isAndInput: Boolean, // 使用输入文本返回value
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
      initProps: undefined || Array,
      afterFetch: {
        type: Function as PropType<Fn>,
        default: null,
      },
    },
    emits: ['options-change', 'change'],
    setup(props, { emit }) {
      const options = ref<OptionsItem[]>([])
      const initOptions = ref(props?.initProps || [])
      console.log(props, options, '我是props数据')
      const loading = ref(false)
      const isFirstLoad = ref(true)
      const emitData = ref<any[]>([])
      const attrs = useAttrs()
      const isShowSearch = ref(false)
      const { t } = useI18n()
      const inputValue = ref()

      isShowSearch.value = props.showSearch || false
      // Embedded in the form, just use the hook binding to perform form verification
      const [state] = useRuleFormItem(props, 'value', 'change', emitData)

      const getOptions = computed(() => {
        const { labelField, valueField, numberToString } = props

        return unref(options).reduce((prev, next: Recordable) => {
          if (next) {
            const value = next[valueField]
            prev.push({
              ...omit(next, [labelField, valueField]),
              label: next[labelField],
              value: numberToString ? `${value}` : value,
            })
          }
          return prev
        }, [] as OptionsItem[])
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
        const { afterFetch } = props
        const api = props.api
        if (!api || !isFunction(api)) return
        options.value = []
        try {
          loading.value = true
          let res = await api(props.params)

          if (afterFetch && isFunction(afterFetch)) {
            res = (await afterFetch(res)) || res
          }

          if (Array.isArray(res)) {
            
            options.value = [ ...initOptions.value, ...res ]
            console.log(initOptions.value, res,options.value , 'resSSShow')
            emitChange()
            return
          }
          if (props.resultField) {
            options.value = get([ ...initOptions.value, ...res ], props.resultField) || []
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

      function handleChange(_, ...args) {
        emitData.value = args
      }

      function handleSearch(e) {
        inputValue.value = e
      }

      function handleInputKeyDown(e) {
        if (props.isAndInput) {
          state.value = e
        }
      }

      return {
        state,
        attrs,
        getOptions,
        loading,
        t,
        handleFetch,
        handleChange,
        isShowSearch,
        handleSearch,
        handleInputKeyDown,
      }
    },
  })
</script>
