<template>
  <Drawer
    :class="Object.assign({ prefixCls: true }, getMergeProps.parentClass || {})"
    @close="onClose"
    v-bind="getBindValues"
  >
    <template #title v-if="!$slots.title">
      <DrawerHeader
        :title="getMergeProps.title"
        :isDetail="isDetail"
        :showDetailBack="showDetailBack"
        @close="onClose"
      >
        <template #titleToolbar>
          <slot name="titleToolbar"></slot>
        </template>
      </DrawerHeader>
    </template>
    <template v-else #title>
      <slot name="title"></slot>
    </template>

    <ScrollContainer
      :style="getScrollContentStyle"
      v-loading="getLoading"
      :loading-tip="loadingText || t('common.loadingText')"
    >
      <slot></slot>
    </ScrollContainer>
    <DrawerFooter v-bind="getProps" @close="onClose" @ok="handleOk" :height="getFooterHeight">
      <template #[item]="data" v-for="item in Object.keys($slots)">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </DrawerFooter>
  </Drawer>
</template>
<script lang="ts">
  import type { DrawerInstance, DrawerProps } from './typing'
  import type { CSSProperties } from 'vue'
  import {
    defineComponent,
    ref,
    computed,
    watch,
    unref,
    nextTick,
    toRaw,
    getCurrentInstance,
  } from 'vue'
  import { Drawer } from 'ant-design-vue'
  import { useI18n } from '/@/hooks/web/useI18n'
  import { isFunction, isNumber } from '/@/utils/is'
  import { deepMerge } from '/@/utils'
  import DrawerFooter from './components/DrawerFooter.vue'
  import DrawerHeader from './components/DrawerHeader.vue'
  import { ScrollContainer } from '/@/components/Container'
  import { basicProps } from './props'
  import { useDesign } from '/@/hooks/web/useDesign'
  import { useAttrs } from '/@/hooks/core/useAttrs'

  export default defineComponent({
    components: { Drawer, ScrollContainer, DrawerFooter, DrawerHeader },
    inheritAttrs: false,
    props: basicProps,
    emits: ['visible-change', 'ok', 'close', 'register'],
    setup(props, { emit }) {
      const visibleRef = ref(false)
      const attrs = useAttrs()
      const propsRef = ref<Partial<Nullable<DrawerProps>>>(null)
      const { t } = useI18n()
      const { prefixVar, prefixCls } = useDesign('basic-drawer')

      const drawerInstance: DrawerInstance = {
        setDrawerProps: setDrawerProps,
        emitVisible: undefined,
      }

      const instance = getCurrentInstance()

      instance && emit('register', drawerInstance, instance.uid)

      const getMergeProps = computed((): DrawerProps => {
        return deepMerge(toRaw(props), unref(propsRef))
      })

      const getProps = computed((): DrawerProps => {
        const opt = {
          placement: 'right',
          ...unref(attrs),
          ...unref(getMergeProps),
          visible: unref(visibleRef),
        }
        opt.title = undefined
        const { isDetail, width, wrapClassName, getContainer } = opt
        if (isDetail) {
          if (!width) {
            opt.width = '100%'
          }
          const detailCls = `${prefixCls}__detail`
          opt.wrapClassName = wrapClassName ? `${wrapClassName} ${detailCls}` : detailCls

          if (!getContainer) {
            // TODO type error?
            opt.getContainer = `.${prefixVar}-layout-content` as any
          }
        }
        return opt as DrawerProps
      })

      const getBindValues = computed((): DrawerProps => {
        return {
          ...attrs,
          ...unref(getProps),
        }
      })

      // Custom implementation of the bottom button,
      const getFooterHeight = computed(() => {
        const { footerHeight, showFooter } = unref(getProps)
        if (showFooter && footerHeight) {
          return isNumber(footerHeight)
            ? `${footerHeight}px`
            : `${footerHeight.replace('px', '')}px`
        }
        return `0px`
      })

      const getScrollContentStyle = computed((): CSSProperties => {
        const footerHeight = unref(getFooterHeight)
        return {
          position: 'relative',
          height: `calc(100% - ${footerHeight})`,
        }
      })

      const getLoading = computed(() => {
        return !!unref(getProps)?.loading
      })

      watch(
        () => props.visible,
        (newVal, oldVal) => {
          if (newVal !== oldVal) visibleRef.value = newVal
        },
        { deep: true },
      )

      watch(
        () => visibleRef.value,
        (visible) => {
          nextTick(() => {
            emit('visible-change', visible)
            instance && drawerInstance.emitVisible?.(visible, instance.uid)
          })
        },
      )

      // Cancel event
      async function onClose(e: Recordable) {
        const { closeFunc } = unref(getProps)
        emit('close', e)
        if (closeFunc && isFunction(closeFunc)) {
          const res = await closeFunc()
          visibleRef.value = !res
          return
        }
        visibleRef.value = false
      }

      function setDrawerProps(props: Partial<DrawerProps>): void {
        // Keep the last setDrawerProps
        propsRef.value = deepMerge(unref(propsRef) || ({} as any), props)

        if (Reflect.has(props, 'visible')) {
          visibleRef.value = !!props.visible
        }
      }

      function handleOk() {
        emit('ok')
      }

      return {
        onClose,
        t,
        prefixCls,
        getMergeProps: getMergeProps as any,
        getScrollContentStyle,
        getProps: getProps as any,
        getLoading,
        getBindValues,
        getFooterHeight,
        handleOk,
      }
    },
  })
</script>
<style lang="less">
  @header-height: 60px;
  @detail-header-height: 40px;
  @prefix-cls: ~'@{namespace}-basic-drawer';
  @prefix-cls-detail: ~'@{namespace}-basic-drawer__detail';

  .@{prefix-cls} {
    .ant-drawer-wrapper-body {
      overflow: hidden;
    }

    .ant-drawer-close {
      &:hover {
        color: @error-color;
      }
    }

    .ant-drawer-body {
      height: calc(100% - @header-height);
      padding: 0;
      background-color: @component-background;

      .scrollbar__wrap {
        padding: 16px !important;
        margin-bottom: 0 !important;
      }

      > .scrollbar > .scrollbar__bar.is-horizontal {
        display: none;
      }
    }
  }

  .@{prefix-cls-detail} {
    position: absolute;

    .ant-drawer-header {
      width: 100%;
      height: @detail-header-height;
      padding: 0;
      border-top: 1px solid @border-color-base;
      box-sizing: border-box;
    }

    .ant-drawer-title {
      height: 100%;
    }

    .ant-drawer-close {
      height: @detail-header-height;
      line-height: @detail-header-height;
    }

    .scrollbar__wrap {
      padding: 0 !important;
    }

    .ant-drawer-body {
      height: calc(100% - @detail-header-height);
    }
  }

  .userDrawerCont .vben-basic-drawer-footer .ant-btn-primary {
    opacity: 0;
    width: 100px;
  }
</style>
