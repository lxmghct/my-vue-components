<!--
    MyDrawer.vue
-->
<template>
  <div>
    <div :class="maskClass" @click="closeByMask"></div>
    <div :class="mainClass" :style="mainStyle" class="main-drawer">
      <div class="drawer-head" v-show="headerShow">
        <span>{{ title }}</span>
        <span class="close-btn" v-show="closeBtnShow" @click="close">X</span>
      </div>
      <div class="drawer-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyDrawer',
  props: {
    // 是否打开
    visible: {
      type: Boolean
    },
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 是否显示关闭按钮
    closeBtnShow: {
      type: Boolean,
      default: true
    },
    // 是否显示遮罩
    mask: {
      type: Boolean,
      default: true
    },
    // 是否点击遮罩关闭
    maskClosable: {
      type: Boolean,
      default: true
    },
    // 宽度(支持百分比)
    width: {
      type: String,
      default: '400px'
    },
    // 是否在父级元素中打开
    appendToParent: {
      type: Boolean,
      default: false
    },
    // 是否显示header
    headerShow: {
      type: Boolean,
      default: true
    },
    // 背景色
    background: {
      type: String,
      default: '#fff'
    }
  },
  computed: {
    maskClass: function () {
      return {
        'mask-show': (this.mask && this.visible),
        'mask-hide': !(this.mask && this.visible),
        'appendToParent': this.appendToParent,
        'appendToBody': !this.appendToParent
      }
    },
    mainClass: function () {
      return {
        'main-show': this.visible,
        'main-hide': !this.visible,
        'appendToParent': this.appendToParent,
        'appendToBody': !this.appendToParent
      }
    },
    mainStyle: function () {
      return {
        background: this.background,
        width: this.width,
        right: this.visible ? '0' : `-${this.width}`,
        borderLeft: this.mask ? 'none' : '1px solid #eee'
      }
    }
  },
  mounted () {
    if (this.appendToParent) {
      let box = this.$el.parentNode
      box.style.position = 'relative'
    }
  },
  methods: {
    closeByMask () {
      this.maskClosable && this.$emit('update:visible', false)
    },
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>
/* 滑块 */
.main-drawer {
  position: fixed;
  z-index: 20;
  top: 0;
  height: 100%;
  background: #fff;
  transition: all 0.5s;
}
.main-show {
  opacity: 1;
}
.main-hide {
  opacity: 0;
}
/* 其他样式 */
.drawer-head {
  display: flex;
  justify-content: space-between;
  height: 45px;
  line-height: 45px;
  padding: 0 15px;
  font-size: 14px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  position: relative;
}
.close-btn {
  display: inline-block;
  cursor: pointer;
  height: 100%;
  padding-left: 20px;
}
.drawer-body {
  font-size: 14px;
  padding: 0 10px;
  position: relative;
  height: 100%;
}
/* 遮罩 */
.mask-show {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 1;
  transition: opacity 0.5s;
}
.mask-hide {
  opacity: 0;
  transition: opacity 0.5s;
}
/* 父级元素内部显示 */
.appendToParent {
  position: absolute;
}
.appendToBody {
  position: fixed;
}
</style>
