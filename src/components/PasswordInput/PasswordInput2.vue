<!--
    PasswordInput
    @description: 密码输入框, 由于type="password"的input会被浏览器记住密码且自动填充
        所以使用type="text"的input, 来实现密码输入框的功能
        * props:
            value: String, 密码
            disabled: Boolean, 是否禁用
        * events:
            input: 密码输入时触发
            focus: 聚焦时触发
            blur: 失焦时触发
    @author: longxiaoming
    @date: 2023-04-15
-->
<template>
    <div ref="main"
         class="password-input"
         :class="{
             'password-input--active': isActive,
             'password-input--disabled': disabled
         }">
        <input
            id="passwordInput"
            ref="passwordInput"
            v-model="passwordDisplay"
            autocomplete="off"
            class="password-input__input"
            :disabled="disabled"
            @focus="(e) => { isActive = true; $emit('focus', e) }"
            @blur="(e) => { isActive = false; $emit('blur', e) }"
            @input="handleInput"
        >
        <div class="password-input__eye-wrap">
            <div
                class="password-input__eye"
                @click="showPassword = !showPassword"
            >
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                width="58.000000pt" height="50.000000pt" viewBox="0 0 58.000000 50.000000"
                preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(0.000000,50.000000) scale(0.100000,-0.100000)"
                    fill="#000000" stroke="none">
                        <path d="M228 390 c-61 -19 -148 -96 -148 -130 0 -21 61 -87 103 -110 50 -29
                        127 -32 173 -8 39 21 114 98 114 118 0 19 -74 97 -111 115 -36 19 -98 26 -131
                        15z m121 -40 c37 -18 91 -72 91 -90 0 -18 -54 -72 -91 -90 -70 -36 -138 -22
                        -206 43 -18 17 -33 38 -33 47 0 19 53 71 95 93 41 22 98 21 144 -3z"/>
                        <path d="M235 338 c-31 -18 -44 -40 -45 -75 0 -45 9 -62 42 -79 84 -43 168 60
                        106 130 -27 30 -74 41 -103 24z m79 -34 c20 -20 20 -68 0 -88 -35 -35 -104 -6
                        -104 44 0 50 69 79 104 44z"/>
                    </g>
                </svg>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'PasswordInput',
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
  data () {
    return {
      password: '',
      passwordDisplay: '',
      isActive: false,
      showPassword: false,
      selection: {
        start: 0,
        end: 0
      }
    }
  },
  watch: {
    value () {
      this.updatePasswordDisplay()
    },
    showPassword () {
      this.updatePasswordDisplay()
    }
  },
  methods: {
    updatePasswordDisplay () {
      if (this.showPassword) {
        this.passwordDisplay = this.value
      } else {
        // this.passwordDisplay = '*'.repeat(this.value.length)
        this.passwordDisplay = '\u2022'.repeat(this.value.length) // 圆点
      }
    },
    handleInput () {
      // 获取新输入的字符
      const tempEnd = this.passwordDisplay.length - (this.password.length - this.selection.end)
      const newStr = this.passwordDisplay.slice(this.selection.start, tempEnd)
      // 更新输入框的值
      const currentPosition = this.$refs.passwordInput.selectionStart
      this.password = this.password.slice(0, Math.min(this.selection.start, currentPosition)) + newStr + this.password.slice(this.selection.end)
      this.selection.start = currentPosition
      this.selection.end = currentPosition
      this.$emit('input', this.password)
    }
  },
  mounted () {
  },
  created () {
    this.selectionEvent = () => {
      if (!this.isActive) { return }
      const input = this.$refs.passwordInput
      this.selection = {
        start: input.selectionStart,
        end: input.selectionEnd
      }
    }
    document.addEventListener('selectionchange', this.selectionEvent)
  },
  beforeDestroy () {
    document.removeEventListener('selectionchange', this.selectionEvent)
  }
}
</script>

<style scoped>
.password-input {
    position: relative;
    display: inline-flex;
    width: 200px;
    height: 30px;
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: hidden;
}
.password-input__input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding: 0 10px;
    box-sizing: border-box;
    font-size: 16px;
}
.password-input--active {
    border: 1px solid #409eff;
}
.password-input--disabled {
    background-color: #f5f7fa;
    color: #c0c4cc;
}
.password-input__eye-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
}
.password-input__eye {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
</style>
