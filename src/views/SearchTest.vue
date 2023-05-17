<template>
    <div>
        <search-box
            v-model="input"
            box-style="position: fixed; top: 15px; left: 500px;"
            :selector-list="['#search-main']"
            :before-jump="test"/>
        <div id="search-main">
            <h1>test search</h1>
                ababababababab
            <span style="text-decoration:underline;">
                Lorem ipsum dolor, &nbsp;&nbsp;sit amet consectetur adipisicing elit. Quibusdam, optio. Eaque odio veritatis soluta quibusdam doloribus eos consequatur reiciendis, provident quis accusamus ab consectetur quaerat accusantium animi ipsam eius ipsa!
            </span>
            <span style="text-decoration:underline;">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quibusdam, optio. Eaque odio veritatis soluta quibusdam doloribus eos consequatur reiciendis, provident quis accusamus ab consectetur quaerat accusantium animi ipsam eius ipsa!
            </span>
        </div>
        <button @click="handleClick">btn</button>
    </div>
</template>

<script>
import SearchBox from '@/components/SearchBox'
export default {
    name: 'SearchTest',
    props: {},
    components: {
        SearchBox
    },
    data () {
        return {
            input: '',
            current: 0,
            total: 0
        }
    },
    methods: {
        handleClick () {
            console.log(this.input)
        },
        test (val1, val2, val3, val4) {
            console.log(val1, val2, val3, val4)
        }
    }
}
</script>

<style scoped>
#search-main {
    width: 500px;
    margin: 0 auto 20px auto;
}
</style>

