<template>
    <div class="main">
        <h2>Test</h2>
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
        </div>
    </div>
</template>

<script>
import SplitPane from '@/components/SplitPane'
export default {
    components: {
        SplitPane
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
</style>
