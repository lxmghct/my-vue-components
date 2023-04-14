<template>
    <div class="home">
        <h1> &nbsp; </h1>
        <ip-input v-model="ip" />
        <!-- <p>ip: {{ ip }}</p> -->
    </div>
</template>

<script>
import IpInput from '@/components/IpInput'
export default {
    name: 'Home',
    components: {
        IpInput
    },
    data() {
        return {
            ip: ''
        }
    }
}
</script>

<style scoped>
.home {
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
.test {
    background: #9dcdfd;
}
</style>
