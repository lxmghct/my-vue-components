<template>
    <div class="main">
        <h2>Test</h2>
        <password-input-1 v-model="password"></password-input-1>
        <div style="height: 100px"></div>
        <password-input-2 v-model="password1"></password-input-2>
        <p>{{ password1 }}</p>
        <div class="split-container">
            <split-pane :split-count="3">
                <template slot="pane1">
                    <div class="pane" style="background: #fdba3d;"></div>
                </template>
                <template slot="pane2">
                    <div class="pane" style="background: #6dfd3d;"></div>
                </template>
                <template slot="pane3">
                    <split-pane direction="vertical" :split-count="2">
                        <template slot="pane1">
                            <div class="pane" style="background: #3dfde3;"></div>
                        </template>
                        <template slot="pane2">
                            <div class="pane" style="background: #3dcdfd;"></div>
                        </template>
                    </split-pane>
                </template>
            </split-pane>
            <button @click="handleClick">收藏</button>
        </div>
        <div style="margin-top: 100px">
            <!-- <div class="container">
                <input v-model="passwordDisplay">
                <input
                    v-model="password"
                    class="password"
                    @input="passwordDisplay = password.replace(/./g, '*')">
            </div> -->
        </div>
    </div>
</template>

<script>
import SplitPane from '@/components/SplitPane'
import PasswordInput1 from '@/components/PasswordInput/PasswordInput1'
import PasswordInput2 from '@/components/PasswordInput/PasswordInput2'
export default {
    components: {
        SplitPane,
        PasswordInput1,
        PasswordInput2
    },
    data() {
        return {
            password: '',
            password1: '',
            password2: ''
        }
    },
    mounted () {
    },
    methods: {
        handleClick() {
            // 触发浏览器收藏
            // chrome、firefox、ie11、edge、safari
            if (window.sidebar && window.sidebar.addPanel) {
                window.sidebar.addPanel(document.title, window.location.href, '')
            } else if (window.external && ('AddFavorite' in window.external)) {
                window.external.AddFavorite(location.href, document.title)
            } else if (document.all) {
                window.external.AddFavorite(location.href, document.title)
            } else {
                alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!')
            }

        }
    }
}
</script>
<style scoped>
.split-container {
    width: 400px;
    height: 300px;
    margin: 0 auto;
    border: 1px solid #ccc;
}
.pane {
    width: 100%;
    height: 100%;
    color: #3dcdfd;
}
.container {
  position: relative;
}
.container input {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 12px;
}
.password {
  opacity: 0;
}
</style>
