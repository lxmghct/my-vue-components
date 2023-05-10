<!--
  search-box
  @author: longxiaoming
  @date: 2023-05-05
  @description:
    * props:
        - value/v-model: 检索框的值, default: ''
        - highlightColor: 高亮颜色, default: 'rgb(246, 186, 130)'
        - currentColor: 当前高亮颜色, default: 'rgb(246, 137, 31)'
        - selectorList: 检索的选择器列表, default: []
        - beforeJump: 跳转前的回调函数, default: () => {}
        - afterJump: 跳转后的回调函数, default: () => {}
        - (注: 上述两个回调函数参数为currentIndex, currentSelector, lastIndex, lastSelector)
    * events:
        - @search: 检索时触发, 参数为input和total
        - @goto: 跳转时触发, 参数为index
        - @close: 关闭时触发
    * methods:
        - clear() 清空检索框
        - search() 检索
-->

<template>
  <div class="search-box">
    <input
      v-model="input"
      placeholder="请输入检索内容"
      class="search-input"
      type="text"
      @input="search"
    >
    <!--当前/总数、上一个、下一个、关闭-->
    <span class="input-append" style="user-select: none"> {{ current }}/{{ total }} </span>
    <span class="input-append" @click="searchPrevious">
      <div class="svg-container">
        <svg width="100px" height="100px">
          <path d="M 60 10 L 3 50 L 60 90" stroke="black" fill="transparent" stroke-linecap="round"/>
        </svg>
      </div>
    </span>
    <span class="input-append" @click="searchNext">
      <div class="svg-container">
        <svg width="100px" height="100px" transform="rotate(180)">
          <path d="M 60 10 L 3 50 L 60 90" stroke="black" fill="transparent" stroke-linecap="round"/>
        </svg>
      </div>
    </span>
    <span class="input-append" @click="searchClose">
      <div class="svg-container">
        <svg width="100%" height="100%">
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="black" stroke-width="1" />
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="black" stroke-width="1" />
        </svg>
      </div>
    </span>
  </div>
</template>

<script>
import { SearchBoxUtil } from './search_utils'

export default {
  name: 'SearchBox',
  props: {
    value: {
      type: String,
      default: ''
    },
    highlightColor: {
      type: String,
      default: 'rgb(246, 186, 130)'
    },
    currentColor: {
      type: String,
      default: 'rgb(246, 137, 31)'
    },
    selectorList: {
      type: Array,
      default: () => []
    },
    beforeJump: {
      type: Function,
      default: () => {}
    },
    afterJump: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      input: '',
      current: 0,
      total: 0,
      searchBoxUtil: null
    }
  },
  watch: {
    value (val) {
      this.input = val
    }
  },
  mounted () {
    this.searchBoxUtil = new SearchBoxUtil(this.highlightColor, this.currentColor)
    this.searchBoxUtil.setSelectorList(this.selectorList)
    this.searchBoxUtil.setJumpCallback(this.beforeJump, this.afterJump)
  },
  methods: {
    search () {
      this.$emit('input', this.input)
      this.total = this.searchBoxUtil.search(this.input)
      if (this.total > 0) {
        this.searchBoxUtil.setCurrent(0)
        this.current = 1
      } else {
        this.current = 0
      }
      this.$emit('search', this.input, this.total)
    },
    searchPrevious () {
      if (this.total === 0) { return }
      this.current = this.current - 1 > 0 ? this.current - 1 : this.total
      this.$emit('goto', this.current - 1)
      this.searchBoxUtil.searchPrevious()
    },
    searchNext () {
      if (this.total === 0) { return }
      this.current = this.current + 1 <= this.total ? this.current + 1 : 1
      this.$emit('goto', this.current - 1)
      this.searchBoxUtil.searchNext()
    },
    searchClose () {
      this.$emit('close')
      this.searchBoxUtil.clearSearchData()
    },
    clear () {
      this.input = ''
      this.current = 0
      this.total = 0
    }
  }
}
</script>

<style scoped>
.search-box {
  position: fixed;
  top: 0px;
  right: 100px;
  width: 350px;
  z-index: 999;
  display: flex;
  background-color: #f5f7fa;
  color: #909399;
  padding-right: 10px;
  border: 1px solid #ddd;
  border-radius: 3px;
}
.search-input {
  padding: 10px;
  border-radius: 3px;
  border: 1px solid #ddd;
  width: 100%;
}
.search-input:focus {
  outline: none;
  border: 1px solid #888;
  box-shadow: 0 0 0 2px rgba(190, 190, 191, 0.2);
}
.input-append {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 10px;
  font-size: 16px;
}
.svg-container {
  width: 10px;
  height: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
