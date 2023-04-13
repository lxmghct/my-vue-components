<!-- MyPopover -->
<template>
    <span class="mypopover-main" @mouseout="handleMouseOut">
        <span class="mypopover-content"
              ref="content"
              @mouseover="handleMouseOver">
            <slot />
        </span>
        <div class="mypopover-pop-content" ref="popover" v-show="popShow"
             @mouseover="handleMouseOver">
            <div class="mypopover-pop-header">
                <img src="../../assets/images/arr_14.png">
            </div>
            <div class="mypopover-pop-body">
                <slot name="pop-content" />
            </div>
        </div>
    </span>
</template>
<script>
export default {
  name: 'MyPopover',
  data () {
    return {
      popShow: false
    }
  },
  methods: {
    handleMouseOver () {
      this.popShow = true
    },
    handleMouseOut () {
      this.popShow = false
    }
  },
  watch: {
    popShow (val) {
      if (val) {
        setTimeout(() => {
          this.$refs.popover.style.left = (this.$refs.content.clientWidth - this.$refs.popover.offsetWidth) / 2 + 'px'
          this.$refs.popover.style.top = this.$refs.content.clientHeight - 2 + 'px'
        })
      }
    }
  }
}
</script>
<style scoped>
.mypopover-main {
    display: inline-block;
    position: relative;
}
.mypopover-content {
    display: inline-block;
}
.mypopover-pop-content {
    position: absolute;
    word-break: break-all;
    overflow-y: auto;
    z-index: 100;
}
.mypopover-pop-body {
    margin-top: 16px;
    border: 2px #be0a0a solid;
    padding: 15px;
    background-color: rgb(255, 251, 247);
}
.mypopover-pop-header {
    position: absolute;
    width: 100%;
}
</style>
