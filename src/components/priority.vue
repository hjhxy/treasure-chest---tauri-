<script setup lang="ts">
import { ref, defineEmits} from "vue";
import { priority } from "../store/todoList";


const props = defineProps<{
  chooseIndex: number,
}>();

const $emit = defineEmits<{
  (e: 'choosePriority', index: priority): void;
}>()

const list = ref<Array<priority>>([1, 2, 3, 4]);
const choose = (item: priority) => {
  $emit('choosePriority', item)
};
</script>

<template>
  <div class="root">
    <div class="list" v-for="(item, index) in list" @click="choose(item)">
        <div class="flag">
          <img :src="`/src/assets/dialog/qizi_${item}.png`" alt="">
        </div>
        <span class="content">优先级{{item}}</span>
        <div class="icon">
          <img :class="[props.chooseIndex==item?'show':'hide']" src="/src/assets/dialog/gou.png" alt="">
        </div>
    </div>
  </div>
</template>

<style lang="less" scoped>

.hide {
  display: none;
}

.show {
  display: block;
}

.root {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  .list {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 4px;
    border-radius: 3px;
    font-size: 13px;
    transition: all 0.3s;

    &:hover {
      background-color: rgb(238, 238, 238);
      cursor: pointer;
    }

    .flag {
      width: 15px;
      height: 100%;
      
      img {
        width: 100%;
        height: 100%;
      }
    }

    .content {}
    
    .icon {
      width: 15px;
      height: 100%;
      
      img {
        width: 100%;
        height: 100%;
      }  
    }
  }
}
</style>
