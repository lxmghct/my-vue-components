<!-- MySelect -->
<template>
  <div class="my-select" :style="selectStyle" @click="expandMySelect">
    <div>
        {{ options.length > 0 ? options[selectedIndex] : '' }}
    </div>
    <i class="el-icon-arrow-down el-icon--right"></i>
    <div class="my-select-option-div" :style="optionDivStyle" v-show="isExpand"
         @mouseout="hoverIndex = -1">
      <div v-for="(item, index) in options" :key="index"
          :style="optionStyle + ';' + (index === selectedIndex ? optionChosenStyle : '') + ';' + (index === hoverIndex ? optionHoverStyle : '')"
          @click.stop="selectOption(index)"
          @mouseover="hoverIndex = index">
        {{ item }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MySelect',
  props: {
    options: {
      type: Array,
      default: () => []
    },
    selectStyle: {
      type: String,
      default: ''
    },
    optionDivStyle: {
      type: String,
      default: ''
    },
    optionStyle: {
      type: String,
      default: ''
    },
    optionChosenStyle: {
      type: String,
      default: 'background: #e5e5e5;'
    },
    optionHoverStyle: {
      type: String,
      default: 'background: #f5f5f5'
    }
  },
  data () {
    return {
      selectedIndex: 0,
      hoverIndex: -1,
      isExpand: false
    }
  },
  methods: {
    selectOption (index) {
      this.selectedIndex = index
      this.isExpand = false
      this.$emit('select', index)
    },
    expandMySelect () {
      this.isExpand = !this.isExpand
    }
  },
  mounted () {
    let expendContent = document.querySelector('.my-select-option-div')
    let mySelect = document.querySelector('.my-select')
    expendContent.style.top = mySelect.clientHeight + 3 + 'px'
    expendContent.style.width = mySelect.clientWidth + 'px'
  }
}
</script>
<style scoped>
.my-select {
    width: 200px;
    height: 35px;
    background: #fff;
    border: 1px solid #ccc;
    position: relative;
    cursor: pointer;
    text-align: left;
}
.my-select-option-div {
    position: absolute;
    top: 30px;
    left: 0;
    width: 200px;
    background: #fff;
    border: 1px solid #ccc;
    border-top: none;
    z-index: 999;
}
li {
    list-style: none;
}
.my-select span {
    vertical-align: middle;
}
.my-select i {
    position: absolute;
    right: 5px;
    top: 8px;
}
</style>
