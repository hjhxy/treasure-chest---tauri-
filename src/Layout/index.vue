<template>
  <div class="container">
    <div class="sidebar" ref="sideBarRef" :style="{ height: windowsize.height + 'px' }">
      <SideBar @showSideBar="showSideBar" @hideSideBar="hideSideBar" />
    </div>
    <div class="main" :style="{ height: windowsize.height + 'px'}">
      <div class="showsidebar" @click="showSideBar">
        <img src="../assets/showsidebarhoriz.png" alt="" />
      </div>
      <Main />
    </div>
  </div>
</template>

<script setup lang="ts">
import SideBar from "./Sidebar/index.vue";
import Main from "./Main/index.vue";
import { ref } from "vue";

const useWindowsize = () => {
  const windowsize = ref({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  let timer = ref<number|null>(null);
  let resizing = ref(false);
  window.addEventListener("resize", (e) => {
    if (resizing.value) return;
    resizing.value = true;
    timer.value = setTimeout(() => {
      resizing.value = false;
      timer.value = null;
      windowsize.value.width = window.innerWidth;
      windowsize.value.height = window.innerHeight;
    }, 50);
  });
  return {
    windowsize,
  };
};

const useSideBar = () => {
  const sideBarRef = ref<HTMLElement|null>(null);
  const mainLeft = ref(200);
  const showSideBar = () => {
    console.log("showSideBar");
    sideBarRef.value!.classList.remove("hide");
    sideBarRef.value!.classList.add("show");
  };
  const hideSideBar = () => {
    console.log("hideSideBar", sideBarRef.value!.style);
    sideBarRef.value?.classList.remove("show");
    sideBarRef.value?.classList.add("hide");
  };
  return {
    sideBarRef,
    mainLeft,
    hideSideBar,
    showSideBar,
  };
};

const { windowsize } = useWindowsize();
const { sideBarRef, mainLeft, showSideBar, hideSideBar } = useSideBar();
</script>

<style scoped lang="less">
.hide {
  transform: translateX(-100%);
}
.show {
  transform: translateX(0);
}
@media screen and (max-width: 600) {
  .sidebar {
    width: 0px !important;
  }
}
@media screen and (max-width: 600) {
  .sidebar {
    width: 200px !important;
  }
}

.container {
  position: relative;
  display: flex;
  flex-direction: row;
  min-width: 800px;
}

.sidebar {
//   position: absolute;
  transition: all 0.3s;
  width: 25%;
  min-width: 200px;
  max-width: 300px;
  transition: all 0.2s;
}

.main {
  width: 75%;
  min-width: 400px;
  display: flex;
  position: relative;

  .showsidebar {
    position: absolute;
    top: 20px;
    left: 10px;
    &:hover {
      transform: scale(1.1);
      transition: all 0.2s;
      cursor: pointer;
    }

    img {
      width: 20px;
      height: auto;
    }
  }
}
</style>
