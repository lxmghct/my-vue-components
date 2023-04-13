<!-- IpInput
  @description IP地址输入框
    * props:
        - value: IP地址, 格式为xx.xx.xx.xx, default: ''
        - disabled: 是否禁用, default: false
  @date 2023-04-10
-->
<template>
  <div class="ip-input">
    <!-- 每一段一个输入框 -->
    <div v-for="(item, index) in ipArr" :key="index" class="ip-input__item-wrap">
      <input
        ref="ipInput"
        v-model="ipArr[index]"
        type="text"
        class="ip-input__item"
        :class="{
          'ip-input__item--active': index === activeIndex,
        }"
        :disabled="disabled"
        @input="handleInput(index)"
        @focus="handleFocus(index)"
        @blur="handleBlur(index)"
        @keydown.left.exact="handleFocus(index - 1)"
        @keydown.right.exact="handleFocus(index + 1)"
        @keydown.backspace.exact="handleBackspace(index)"
      >
      <span v-if="index !== ipArr.length - 1" class="ip-input__dot">.</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IpInput',
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ipArr: ['', '', '', ''],
      oldIpInput: ['', '', '', ''],
      activeIndex: -1,
      clipboardText: ''
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.$emit('change', newVal, oldVal)
          this.ipArr = ['', '', '', '']
          const tempArr = newVal.split('.')
          for (let i = 0; i < tempArr.length; i++) {
            if (!this.isNumberValid(tempArr[i])) {
              break
            }
            this.ipArr[i] = tempArr[i]
          }
        }
      }
    }
  },
  created() {
    this.pasteListener = (event) => {
      if (this.activeIndex === -1) { return }
      const clipboardData = event.clipboardData || window.clipboardData
      this.clipboardText = clipboardData.getData('text')
      this.handlePaste(this.activeIndex)
    }
    this.copyListener = (event) => {
      if (this.activeIndex === -1) { return }
      const clipboardData = event.clipboardData || window.clipboardData
      clipboardData.setData('text', this.ipArr.join('.'))
      event.preventDefault()
    }
    window.addEventListener('paste', this.pasteListener)
    window.addEventListener('copy', this.copyListener)
  },
  beforeDestroy() {
    window.removeEventListener('paste', this.pasteListener)
    window.removeEventListener('copy', this.copyListener)
  },
  methods: {
    isNumberValid(value) {
      return /^\d*$/.test(value) && value <= 255
    },
    handleInput(index) {
      const newValue = this.ipArr[index]
      // 如果输入的是非数字，或者输入不在0-255之间，则阻止输入
      if (!this.isNumberValid(newValue)) {
        this.ipArr[index] = this.oldIpInput[index]
        return false
      }
      this.$emit('input', this.ipArr.join('.'), index)
      this.oldIpInput[index] = newValue
      if (newValue.length === 3 || (newValue.length === 2 && newValue > 25)) {
        if (index === this.ipArr.length - 1) { return true }
        // 将焦点移动到下一个输入框
        this.handleFocus(index + 1)
      }
      return true
    },
    handleFocus(index) {
      if (index < 0 || index > this.ipArr.length - 1) { return }
      if (this.activeIndex !== index) {
        this.$refs.ipInput[index].focus()
      }
      this.activeIndex = index
    },
    handleBlur(index) {
      this.activeIndex = -1
    },
    handlePaste(startIndex) {
      const clipboardText = this.clipboardText
      const tempArr = clipboardText.split('.')
      let i
      for (i = startIndex; i < startIndex + tempArr.length && i < this.ipArr.length; i++) {
        this.ipArr[i] = tempArr[i]
        if (!this.handleInput(i)) { break }
      }
      this.handleFocus(i)
    },
    handleBackspace(index) {
      if (!this.ipArr[index]) {
        this.handleFocus(index - 1)
      }
    }
  }
}
</script>
<style scoped>
.ip-input {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}
.ip-input__item-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
.ip-input__item {
  width: 35px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  font-size: 16px;
  outline: none;
}
.ip-input__item--active {
  border-color: #409eff;
}
.ip-input__dot {
  margin: 0 5px;
  font-size: 24px;
  color: #333;
}
</style>

