<template>
  <div class="root">
    <div class="wrapper" @click="handleClick">11</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';

const props = defineProps<{
  current: number;
  all: number;
}>();

const count = ref(20);

const handleClick = () => {
  count.value = count.value + 10;
};
</script>

<style lang="less">
.root {
  width: 100%;
  height: 100%;

  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #18cdff 0%, #85fc06 100%);
    border-radius: 50px;
    transition: all 0.2s;
  }
}
</style>
