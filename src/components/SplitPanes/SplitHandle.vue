<template>
  <div :class="className"></div>
</template>

<script>
export default {
  name: 'SplitHandle',

  props: {
    /**
     * 水平分割
     */
    horizontal: {
      type: Boolean,
      default: false,
    },

    /**
     * 显示分割线
     */
    showLine: {
      type: Boolean,
      default: true,
    },

    /**
     * 使用默认的光标样式
     */
    useDefaultCursor: {
      type: Boolean,
      default: false,
    },

    // 布局容器中使用
    asLayout: Boolean,
  },

  computed: {
    className() {
      const { horizontal, showLine, useDefaultCursor, asLayout } = this
      return [
        'ice-splitter-handle-item',
        `ice-splitter-handle-${horizontal ? 'horizontal' : 'vertical'}`,
        {
          'splitter-line-hidden': !showLine,
          'splitter-resize-cursor': !useDefaultCursor,
          'splitter-line-layout': asLayout,
        },
      ]
    },
  },
}
</script>

<style lang="less" scoped>
@import '../../theme/default.less';

.ice-splitter-handle {
  &-item {
    overflow: visible;
    position: relative;
    border: 0;
    padding: 0;
    margin: 0;
    flex: none;

    &:before {
      content: '';
      position: absolute;
      background-color: transparent;
      z-index: 3;
    }

    &:after {
      content: '';
      position: absolute;
      z-index: 0;
      left: 0;
      top: 0;
    }

    &.splitter-line-hidden {
      &:after {
        display: none;
      }
    }
  }

  &-horizontal {
    width: 100%;
    height: 0;
    max-height: 0;

    &:before {
      left: 0;
      top: -6px;
      width: 100%;
      height: 12px;
    }

    &:after {
      background-color: @layout-splitter-horizontal-color;
      width: 100%;
      height: 1px;
    }

    &.splitter-resize-cursor {
      cursor: row-resize;
      &:before {
        cursor: row-resize;
      }
    }
  }

  &-vertical {
    width: 0;
    max-width: 0;
    flex: 1 1 0;

    &:before {
      left: -6px;
      top: 0;
      width: 12px;
      height: 100%;
    }

    &:after {
      background-color: @layout-splitter-vertical-color;
      width: 1px;
      height: 100%;
    }

    &.splitter-resize-cursor {
      cursor: col-resize;
      &:before {
        cursor: col-resize;
      }
    }
  }

  &-horizontal,
  &-vertical {
    &.splitter-line-layout {
      &:before {
        z-index: max(
            @layout-aside-fixed-z-index,
            @layout-header-fixed-z-index + 1
          ) + 1;
      }

      &:after {
        background-color: @layout-aside-splitter-vertical-color;
      }
    }
  }
}
</style>
