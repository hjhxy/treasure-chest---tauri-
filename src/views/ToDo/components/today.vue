<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { ITask, ITaskList } from "@/store/todoList/index.ts";
import TaskDialog from "@/components/taskdialog.vue";
import { getRandomSoftColor } from '@/utils/color';

const store = useStore();

const useHeader = () => {
  const completedTasks = computed(()=>{
    return store.getters["todoList/completedTasks"];
  });
  const pendingTasks = computed(()=>{
    return store.getters["todoList/pendingTasks"];
  });
  return {
    completedTasks,
    pendingTasks,
  };
};

const useList = () => {
  const taskList: ITaskList = store.state.todoList.tasks;
  const changeComplete = (_:Event, id: string) => {
    store.commit("todoList/toggleTask", id);
  };
  const getListClass = ()=>{
    const color = getRandomSoftColor();
    return {
      background: color,
    }
  }
  return {
    taskList,
    changeComplete,
    getListClass,
  };
};

const useTask = () => {
  const changeTask_dialogTableVisible = ref(false);
  const currentTask = ref<ITask | null>(null);
  const editTask = (id:string) => {
    changeTask_dialogTableVisible.value = true;
    const item = taskList.find((el) => el.id === id);
    currentTask.value = item!;
  };
  const ensureEdit = (data:ITask | null) => {
    changeTask_dialogTableVisible.value = false;
    const index = taskList.findIndex(el=>el.id==data!.id);
    if(index!=-1) {
      taskList[index] = { ...data } as ITask;
      store.commit("todoList/setTasks", taskList);
    }
  };
  const cancelEdit = () => {
    changeTask_dialogTableVisible.value = false;
  };
  return {
    changeTask_dialogTableVisible,
    editTask,
    currentTask,
    ensureEdit,
    cancelEdit,
  };
};

const useListStyle = ()=>{
  const $task_list = ref<HTMLElement|null>(null);
  const adjustHeight = () => {
    const height = window.innerHeight;
    if ($task_list.value) {
      console.log(111);
      $task_list.value.style.height = `${height - 310}px`;
    }
  }
  const resize = ()=>{
    window.onresize = adjustHeight;
  }
  onMounted(()=>{
    adjustHeight();
    resize();
  })
  return {
    $task_list
  }
}

const { completedTasks, pendingTasks } = useHeader();
const { taskList, changeComplete, getListClass } = useList();
const {
  changeTask_dialogTableVisible,
  editTask,
  currentTask,
  ensureEdit,
  cancelEdit,
} = useTask();
const { $task_list } = useListStyle();
</script>

<template>
  <div class="root">
    <div class="header">
      <h2 class="title">ToDay</h2>
      <p class="tip">
       今日共{{ taskList.length }}个任务， {{ pendingTasks.length }}个任务待完成，{{ completedTasks.length }}个任务已完成
      </p>
    </div>
    <div class="task-list" ref="$task_list">
      <!-- 任务列表 -->
      <div class="list" :style="getListClass()" v-for="(item, index) in taskList" :key="index">
        <div class="content">
          <div class="left">
            <input
              type="checkbox"
              :checked="item.completed"
              @change="changeComplete($event, item.id)"
            />
          </div>
          <div class="center" @click="editTask(item.id)">
            <p class="taskname">{{ item.name }}</p>
            <span class="taskdesc">{{ item.describe }}</span>
          </div>
          <div class="rightflag">
            <img :src="`/assets/dialog/qizi_${item.priority}.png`" alt="">
          </div>
        </div>
      </div>
      <TaskDialog
        title="Edit Task"
        ensureBtn="确认修改"
        :dialogVisiable="changeTask_dialogTableVisible"
        :task="currentTask"
        @ok="ensureEdit"
        @cancel="cancelEdit"
      />
    </div>
  </div>
</template>

<style lang="less">
.el-divider__text,
is-left {
  background-color: #f6f6f6;
}
</style>

<style lang="less" scoped>
.one-line {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@keyframes flag {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.root {
  padding: 10px;

  .header {
    margin-bottom: 10px;

    .title {
    }

    .tip {
      font-size: 12px;
    }
  }

  .task-list {
    min-height: 348px;
    overflow: auto;
    padding: 0 14px 10px 0;
    .list {
      background-color: rgba(248, 187, 75, 0.2);
      border-radius: 8px;
      padding: 6px;

      .el-divider {
        margin: 12px 0;
      }

      .content {
        display: flex;

        .left {
          width: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
         
        .center {
          flex: 1;

          .taskname {
            font-size: 16px;
            font-weight: 500;
          }

          .taskdesc {
            color: rgb(105, 105, 105);
          }

          &:hover {
            cursor: pointer;
          }
        }

        .rightflag {
          margin-left: 10px;
          padding: 0 10px;
          display: flex;
          align-items: center;

          img {
            width: 20px;
            height: 20px;
            animation-name: flag;
            animation-duration: 3s;
            animation-iteration-count: infinite;
            animation-delay: 0;
            animation-timing-function: ease-in-out;
          }
        }
      }
    }

    .list:nth-of-type(n+2) {
      margin-top: 10px;
      box-shadow: 1px 1px 5px 0px rgb(181, 181, 181);
    }
  }
}
</style>
