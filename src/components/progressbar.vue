<script setup lang="ts">
import { defineProps, ref, onMounted} from "vue";

const props = defineProps<{
  current: number;
  all: number;
}>();

const count = ref(20);
const handleClick = () => {
  count.value = count.value + 10;
};

const useBear = ()=>{
  const left = ref(22.5);
  return {
    left,
  };
}
onMounted(()=>{
  setTimeout(() => {
    left.value = props.current/props.all * (637.5-45) + 45/2;
  }, 1000);
});
const { left } = useBear();
</script>

<template>
  <div class="root">
    <div class="frame">
      <div class="bg1"></div>
      <div class="bg2"></div>
      <div class="bear" :style="{left: left + 'px'}"></div>
    </div>
    <!-- <div class="wrapper" @click="handleClick"></div> -->
  </div>
</template>

<style lang="less" scoped>
/* 白色雪山的移动动画 */
@keyframes snow_1_move {
  0% {
  }

  100% {
    background-position: -635px 0;
  }
}

/* 黑色雪山的移动动画 */
@keyframes snow_2_move {
  0% {
  }

  100% {
    background-position: -635px 0;
  }
}

@keyframes bear {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -385px 0;
  }
}

.root {
  width: 100%;
  height: 100%;
  // border: 1px solid red;

  .frame {
    width: 100%;
    height: 60px;
    position: relative;
    overflow: hidden;

    .bg1 {
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: url("../assets/progress/bg2.png");
      background-size: 100% 100%;
      opacity: 0.4;
      z-index: 1;
      animation: snow_1_move linear 6s forwards infinite;
      animation-delay: 0ms;
    }

    .bg2 {
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: url("../assets/progress/bg1.png");
      background-size: 100% 100%;
      opacity: 0.9;
      animation: snow_2_move linear 8s forwards infinite;
      animation-delay: 0ms;
      z-index: 2;
    }

    .bear {
      transition: all 2s ease-in-out;
      position: absolute;
      left: 50%;
      top: 53%;
      transform: translate(-50%);
      width: 45px;
      height: 100%;
      background-image: url("../assets/progress/bear.png");
      background-size: auto 40%;
      background-repeat: no-repeat;
      animation-name: bear;
      animation-fill-mode: forwards;
      animation-timing-function: steps(8);
      animation-delay: 0ms;
      animation-duration: 1s;
      animation-iteration-count: infinite;
      // background-color: red;
      z-index: 3;
    }
  }

  // .wrapper {
  //   width: 100%;
  //   height: 100%;
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   background: linear-gradient(135deg, #18cdff 0%, #85fc06 100%);
  //   border-radius: 50px;
  //   transition: all 0.2s;
  // }
}
</style>
