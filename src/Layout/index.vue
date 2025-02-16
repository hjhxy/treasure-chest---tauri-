
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
    hideSideBar,
    showSideBar,
  };
};

const { windowsize } = useWindowsize();
const { sideBarRef, showSideBar, hideSideBar } = useSideBar();
</script>

<template>
  <div class="container">
    <div class="sidebar" ref="sideBarRef" :style="{ height: windowsize.height + 'px' }">
      <SideBar @showSideBar="showSideBar" @hideSideBar="hideSideBar" />
    </div>
    <div class="main" :style="{ height: windowsize.height + 'px'}">
      <div class="sidebarcontainer">
        <div class="showsidebar" @click="showSideBar">
          <img src="../assets/icons/showsidebarhoriz.png" alt="" />
        </div>
      </div>
      <Main />
    </div>
  </div>
</template>

<style scoped lang="less">
// @media screen and (max-width: 600) {
//   .sidebar {
//     width: 0px !important;
//   }
// }
// @media screen and (min-width: 600) {
//   .sidebar {
//     width: 200px !important;
//   }
// }
.hide {
  transform: translateX(-100%);
  display: none !important;
}
.show {
  display: block !important;
}

.container {
  position: relative;
  display: flex;
  flex-direction: row;
  min-width: 800px;
  width: 100%;
  display: flex;
}

.sidebar {
  transition: all .5s;
  width: 25%;
  min-width: 200px;
  max-width: 300px;
}

.main {
  transition: all .5s;
  flex: 75%;
  min-width: 400px;
  display: flex;
  position: relative;
  flex-direction: column;

  .sidebarcontainer {
    position: relative;
    width: 100%;
    height: 50px;

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
}
</style>
