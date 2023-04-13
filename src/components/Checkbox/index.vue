<!-- MyCheckbox -->
<template>
    <div class="mycheckbox-main" :style="{ width: boxWidth }">
        <div v-for="(item, index) in checkData" :key="index" class="mycheckbox-item"
            :style="{'min-width': itemWidth}">
            <div class="mycheckbox-check" @click="handleChangeCheck(index)" :class="{'check-border':isItemChecked[index]}">
                <div class="mycheckbox-checked" v-show="isItemChecked[index]"></div>
            </div>
            <span :class="{'mycheckbox-checked-text': isItemChecked[index]}">
                {{ item }} </span>
        </div>
    </div>
</template>
<script>
export default {
  name: 'MyCheckbox',
  props: {
    checkData: {
      type: Array,
      default: () => []
    },
    checkedItems: {
      type: Array,
      default: () => []
    },
    itemWidth: {
      type: String,
      default: '70px'
    },
    boxWidth: {
      type: String,
      default: '100%'
    }
  },
  data () {
    return {
      isItemChecked: []
    }
  },
  methods: {
    handleChangeCheck (index) {
      this.isItemChecked[index] = !this.isItemChecked[index]
      let checkedItems = []
      this.isItemChecked.forEach((item, i) => {
        if (item) { checkedItems.push(this.checkData[i]) }
      })
      this.$emit('change', checkedItems)
      this.$forceUpdate()
    }
  },
  mounted () {
    this.isItemChecked = this.checkData.map(() => false)
  },
  watch: {
    checkedItems (val) {
      this.isItemChecked = this.checkData.map(() => false)
      val.forEach(item => {
        let index = this.checkData.indexOf(item)
        if (index !== -1) {
          this.isItemChecked[index] = true
        }
      })
      this.$forceUpdate()
    }
  }
}
</script>
<style scoped>
.mycheckbox-check {
    position: relative;
    display: inline-block;
    width: 14px;
    height: 14px;
    top: 2px;
    margin-right: 3px;
    border: 1px solid #000;
    cursor: pointer;
    border-radius:5px;
}
.mycheckbox-checked {
    position: absolute;
    top: calc(50% - 5px);
    left: calc(50% - 5px);
    background-color: #be0a0a;
    width: 10px;
    height: 10px;
    display: block;
    -moz-border-radius:5px;
    -webkit-border-radius:5px;
    border-radius:5px;
}
.check-border {
    border: 1px solid #be0a0a;
}
.mycheckbox-item {
    display: inline-block;
    margin-right: 10px;
}
.mycheckbox-checked-text {
    color: #be0a0a;
}
.mycheckbox-main {
    display: inline-block;
    text-align: left;
}
</style>
