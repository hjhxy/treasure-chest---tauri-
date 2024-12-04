<template>
    <div class="container">
        <div class="sidebar" :style="{height:windowsize.height + 'px'}">
            <SideBar/>
        </div>
        <div class="main">
            <Main/>
        </div>
    </div>
</template>

<script setup lang="ts">
import SideBar from "./Sidebar/index";
import Main from './Main/index';
import { ref } from 'vue';

const windowsize = ref({
    width: window.innerWidth,
    height: window.innerHeight
});

</script>

<style scoped lang="less">

.container {
    display: flex;
    flex-direction: row;
}

.sidebar {
    width: 200px;
    min-width: 200px;
    // background-color: #f2f2f2;
    // background-color: red;
}

.main {
    flex: 1;
    min-width: 200px;
    // background-color: gray;
}

</style>