<template>
  <div class="root">
    <div class="header">
      <h2 class="title">ToDay</h2>
      <p class="tip">
       今日共{{ taskList.length }}个任务， {{ pendingTasks.length }}个任务待完成，{{ completedTasks.length }}个任务已完成
      </p>
    </div>
    <div class="task-list">
      <!-- 任务列表 -->
      <div class="list" :style="getListClass()" v-for="(item, index) in taskList">
        <!-- <el-divider /> -->
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

<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "vuex";
import { ITask, ITaskList } from "../../store/todoList/index";
import TaskDialog from "../../components/taskdialog";
import { getRandomSoftColor } from '../../../utils/color';
import taskListModule from '../../store/todoList/index';

const store = useStore();

const useHeader = () => {
  const completedTasks = store.getters["todoList/completedTasks"];
  const pendingTasks = store.getters["todoList/pendingTasks"];

  return {
    completedTasks,
    pendingTasks,
  };
};

const useList = () => {
  const taskList: ITaskList = store.state.todoList.tasks;
  const changeComplete = (e, id) => {
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
  const editTask = (id) => {
    changeTask_dialogTableVisible.value = true;
    const item = taskList.find((el) => el.id === id);
    currentTask.value = item;
  };
  const ensureEdit = (data) => {
    changeTask_dialogTableVisible.value = false;
    const index = taskList.findIndex(el=>el.id==data.value.id);
    if(index!=-1) {
      taskList[index] = { ...data.value };
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
const { completedTasks, pendingTasks } = useHeader();
const { taskList, changeComplete, getListClass } = useList();
const {
  changeTask_dialogTableVisible,
  editTask,
  currentTask,
  ensureEdit,
  cancelEdit,
} = useTask();
</script>

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
    max-height: 340px;
    overflow: auto;
    padding-right: 10px;
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
      }
    }

    .list:nth-of-type(n+2) {
      margin-top: 10px;
    }
  }
}
</style>
