<!--
  SplitPane component
  @author: longxiaoming
  @date: 2022-11-08
  @description:
    * props:
        - splotCount: 分割数量, default: 2
        - direction: 分割方向, 'vertical' or 'horizontal', default: 'horizontal'
        - defaultRatio: 默认比例, 类型数组, default: [1/spiltCount, 1/spiltCount, ...]
    * slots:
        - <template slot="pane1">...</template>
        - <template slot="pane2">...</template>
        - ...
    * events:
        - @resize: 拖动分割条时触发, 参数为分割线两侧的div
        - @resize-stop: 拖动分割条结束时触发
    * methods:
        - changeItemSize(index, itemSize, dire='next') 改变第item个pane的大小, dire为next或prev
-->
<template>
  <div class="split-main" ref="splitMain"
       :class="direction === 'vertical' ? 'split-vertical' : 'split-horizontal'">
      <template v-if="direction === 'vertical'">
        <div v-for="i in splitCount" :key="i" ref="splitItem"
             class="split-vertical-item">
          <div class="split-vertical-line" v-if="i < splitCount"
               @mousedown="_startDrag(i)"
               @touchstart="_startDrag(i)"></div>
          <div class="split-vertical-content">
            <slot :name="`pane${i}`"></slot>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-for="i in splitCount" :key="i" ref="splitItem"
             class="split-horizontal-item">
          <div class="split-horizontal-line" v-if="i < splitCount"
               @mousedown="_startDrag(i)"
               @touchstart="_startDrag(i)"></div>
          <div class="split-horizontal-content">
            <slot :name="`pane${i}`"></slot>
          </div>
        </div>
      </template>
  </div>
</template>

<script>
export default {
  props: {
    splitCount: {
      type: Number,
      default: 2
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    defaultRatio: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      dragIndex: -1,
      minLen: 6
    }
  },

  methods: {
    /**
     * @desciption 将第index个组件的宽度或高度设置为size, dire为方向,若为next则联动改变下一个组件大小,pre同理
     * @param {Number} index
     * @param {Number} itemSize
     * @param {String} dire
     * @return {void}
     */
    changeItemSize (index, itemSize, dire = 'next') {
      if (isNaN(parseInt(index)) || isNaN(parseInt(itemSize))) {
        console.error('index or itemSize is not a number')
        return
      }
      let i = parseInt(index)
      let size = parseInt(itemSize)
      if (i < 0 || i >= this.splitCount) {
        console.error('index is out of range')
        return
      }
      let item = this.$refs.splitItem[i]
      let nextItem
      if (dire === 'pre') {
        if (i > 0) {
          nextItem = this.$refs.splitItem[i - 1]
        } else {
          nextItem = this.$refs.splitItem[i + 1]
        }
      } else {
        if (i < this.splitCount - 1) {
          nextItem = this.$refs.splitItem[i + 1]
        } else {
          nextItem = this.$refs.splitItem[i - 1]
        }
      }
      if (this.direction === 'vertical') {
        let itemHeight = item.offsetHeight
        let nextItemHeight = nextItem.offsetHeight
        let totalHeight = this.$refs.splitMain.clientHeight
        if (size < 0) {
          size = 0
        } else if (size > itemHeight + nextItemHeight - this.minLen) {
          size = itemHeight + nextItemHeight - this.minLen
        }
        let ratio = size / totalHeight
        item.style.flex = ratio
        let ratio2 = (nextItemHeight + itemHeight - size) / totalHeight
        nextItem.style.flex = ratio2
      } else {
        let itemWidth = item.offsetWidth
        let nextItemWidth = nextItem.offsetWidth
        let totalWidth = this.$refs.splitMain.clientWidth
        if (size < 0) {
          size = 0
        } else if (size > itemWidth + nextItemWidth - this.minLen) {
          size = itemWidth + nextItemWidth - this.minLen
        }
        let ratio = size / totalWidth
        item.style.flex = ratio
        let ratio2 = (nextItemWidth + itemWidth - size) / totalWidth
        nextItem.style.flex = ratio2
      }
      if (size <= 0) {
        item.style.display = 'none'
      } else {
        item.style.display = 'flex'
      }
    },

    /**
     * @description 获取第index组件的宽度或高度
     * @param {Number} index
     * @return {Number}
     */
    getItemSize (index) {
      if (isNaN(parseInt(index))) {
        console.error('index is not a number')
        return
      }
      let i = parseInt(index)
      if (i < 0 || i >= this.splitCount) {
        console.error('index is out of range')
        return
      }
      let item = this.$refs.splitItem[i]
      if (this.direction === 'vertical') {
        return item.offsetHeight
      } else {
        return item.offsetWidth
      }
    },

    _initialize () {
      let ratios = new Array(this.splitCount)
      try {
        for (let i = 0; i < this.splitCount; i++) {
          let floatVal = parseFloat(this.defaultRatio[i])
          if (isNaN(floatVal) || floatVal < 0) {
            throw new Error('defaultRatio is invalid')
          }
          ratios[i] = floatVal
        }
      } catch (e) {
        ratios = new Array(this.splitCount).fill(1 / this.splitCount)
      }
      let ratioSum = ratios.reduce((a, b) => a + b)
      let minRatio = ratioSum / 100
      let items = this.$refs.splitItem
      for (let i = 0; i < items.length; i++) {
        if (ratios[i] < minRatio) {
          ratios[i + 1] -= minRatio - ratios[i]
          ratios[i] = minRatio
        }
        items[i].style.flex = ratios[i] / ratioSum
      }
    },

    _startDrag (index) {
      this.dragIndex = index - 1
    },

    _onMouseMove (e) {
      if (this.dragIndex === -1) {
        return
      }
      let items = this.$refs.splitItem
      let item1 = items[this.dragIndex]
      let item2 = items[this.dragIndex + 1]
      let rect1 = item1.getBoundingClientRect()
      let rect2 = item2.getBoundingClientRect()
      let ratio1, ratio2
      let minLen = this.minLen
      if (this.direction === 'vertical') {
        let height = this.$refs.splitMain.clientHeight
        let tempY = e.clientY - rect1.top > minLen ? e.clientY : rect1.top + minLen
        tempY = rect2.bottom - tempY > minLen ? tempY : rect2.bottom - minLen
        ratio1 = (tempY - rect1.top) / height
        ratio2 = (rect2.bottom - tempY) / height
      } else {
        let width = this.$refs.splitMain.clientWidth
        let tempX = e.clientX - rect1.left > minLen ? e.clientX : rect1.left + minLen
        tempX = rect2.right - tempX > minLen ? tempX : rect2.right - minLen
        ratio1 = (tempX - rect1.left) / width
        ratio2 = (rect2.right - tempX) / width
      }
      item1.style.flex = ratio1
      item2.style.flex = ratio2
      e.preventDefault()
      this.$emit('resize', item1, item2)
    },

    _onMouseUp () {
      if (this.dragIndex === -1) {
        return
      }
      this.dragIndex = -1
      this.$emit('resize-stop')
    }
  },

  mounted () {
    this._initialize()
    document.addEventListener('mousemove', this._onMouseMove)
    document.addEventListener('mouseup', this._onMouseUp)
    document.addEventListener('touchmove', this._onMouseMove)
    document.addEventListener('touchend', this._onMouseUp)
  }

}
</script>

<style scoped>
.split-main {
  display: flex;
  height: 100%;
  width: 100%;
}
.split-vertical {
  flex-direction: column;
}
.split-horizontal {
  flex-direction: row;
}
.split-horizontal-item {
    display: flex;
    height: 100%;
    flex-direction: row-reverse;
}
.split-horizontal-content {
    flex-grow: 1;
    overflow: auto;
    width: 0;
    position: relative;
}
.split-horizontal-line {
  width: 6px;
  height: 100%;
  cursor: col-resize;
  border: 0;
  z-index: 1;
  background-image: linear-gradient(90deg,rgba(0,0,0,0) 30%,#c0c0c0 30%,#c0c0c0 70%,rgba(0,0,0,0) 70%);
  background-size: 6px 100%;
}
.split-vertical-item {
    display: flex;
    width: 100%;
    flex-direction: column-reverse;
}
.split-vertical-content {
    flex-grow: 1;
    overflow: auto;
    height: 0;
    position: relative;
}
.split-vertical-line {
  height: 6px;
  width: 100%;
  cursor: row-resize;
  border: 0;
  z-index: 1;
  background-image: linear-gradient(0deg,rgba(0,0,0,0) 30%,#c0c0c0 30%,#c0c0c0 70%,rgba(0,0,0,0) 70%);
  background-size: 100% 6px;
}

</style>
