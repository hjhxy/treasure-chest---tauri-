<script lang="ts" setup>
import { ref, defineEmits } from 'vue';

const $emit = defineEmits<{
    (e:'showSideBar'):void;
    (e:'hideSideBar'):void;
}>();
const useList = () => {
  const list = ref([
    {
      id: "TodoList预览",
      url: "/todo",
      name: "TodoList",
      class: ["list-item", "active"],
      icons: ["/src/assets/todo.png", "/src/assets/todo_choose.png"],
      nowicon: "/src/assets/todo_choose.png",
    },
    {
      id: "",
      url: "/classSchedule",
      name: "课程表",
      class: ["list-item"],
      icons: ["/src/assets/chatgpt.png", "/src/assets/chatgpt_choose.png"],
      nowicon: "/src/assets/chatgpt.png",
    },
    {
      id: "ChatGpt",
      url: "/chatgpt",
      name: "ChatGPT",
      class: ["list-item"],
      icons: ["/src/assets/chatgpt.png", "/src/assets/chatgpt_choose.png"],
      nowicon: "/src/assets/chatgpt.png",
    },
  ]);
  const chooseList = (id: string) => {
    list.value.forEach((item) => {
      if (item.id === id) {
        item.class = ["list-item", "active"];
        item.nowicon = item.icons[1];
      } else {
        item.class = ["list-item"];
        item.nowicon = item.icons[0];
      }
    });
  };
  return {
    list,
    chooseList,
  };
};

const useControlSideBar = () => {
    const showSideBar = () => {
        $emit('showSideBar');
    };

    const hideSideBar = () => {
        $emit('hideSideBar');
    };
    return {
        showSideBar,
        hideSideBar,
    };
}

const { list, chooseList } = useList();
const { showSideBar, hideSideBar } = useControlSideBar();
</script>

<template>
  <div class="root show">
    <div class="head">
      <p class="weather">18-20度，多云转晴☁️</p>
      <div class="controlside">
        <img @click="hideSideBar" src="../../assets/hidesidebarhoriz.png" alt="" />
      </div>
    </div>
    <div class="lists">
      <RouterLink
        v-for="(item, index) in list"
        :key="item.id"
        :to="item.url"
        :class="item.class"
        @click="chooseList(item.id)"
      >
        <img class="icon" :src="item.nowicon" alt="" />
        <span>{{ item.name }}</span>
      </RouterLink>
    </div>
  </div>
</template>

<style lang="less" scoped>
.root {
  width: 100%;
  height: 100%;
  background-color: rgb(249, 240, 232);
  display: flex;
  flex-direction: column;
  box-shadow: 1px 1px 5px rgb(237, 225, 214);

  .head {
    display: flex;
    justify-content: space-between;
    padding: 20px 20px 0;
    width: 100%;

    .weather {
      font-size: 12px;
    }
    .controlside {
      width: fit-content;
      align-self: flex-end;
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

  .lists {
    padding-top: 20px;
    display: flex;
    flex-direction: column;

    a.list-item {
      margin: 0px 10px;
      padding: 6px;
      color: black;
      border-radius: 5px;
      font-size: 15px;
      display: flex;
      align-items: center;

      .icon {
        width: 25px;
        height: auto;
        margin: 0px;
      }
      span {
        margin-left: 10px;
      }

      &:hover {
        background-color: rgba(168, 168, 168, 0.1);
        transition: all 1.3;
      }
    }

    .active {
      background-color: #f7d7c3 !important;
      color: #db4336 !important;
    }
  }
}
</style>
