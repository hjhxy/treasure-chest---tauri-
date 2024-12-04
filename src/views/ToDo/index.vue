<template>
  <div class="root">
    <div class="header">
      <div class="buttons">
        <el-button color="#db4336" plain @click="openAddTask">
          <el-icon><Plus /></el-icon>
          <span>添加任务</span>
        </el-button>
        <el-button color="#db4336" plain>
          <el-icon><TrendCharts /></el-icon>
          排序
        </el-button>
        <el-button color="#db4336" plain>
          <el-icon><View /></el-icon>
          <span>预览</span>
        </el-button>
      </div>
      <TaskDialog
        title="Add Task"
        ensureBtn="确认添加"
        :dialogVisiable="addTask_dialogTableVisible"
        :task="task"
        @ok="addTask"
        @cancel="cancelAddTask"
      />
    </div>
    <el-divider content-position="left" border-style="dashed">
      <el-icon :size="16" color="green"><Tickets /></el-icon> Task List
    </el-divider>

    <div class="body">
      <RouterView />
    </div>

    <div class="footer">
      <el-divider content-position="left" border-style="dashed">
        <el-icon :size="20" color="green"><Bicycle /></el-icon> Completion progress
      </el-divider>
      <div class="progress">
        <ProgressBar :current="currentProgress" :all="allProgress"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, TrendCharts, View, Bicycle, Tickets } from "@element-plus/icons-vue";
import TaskDialog from "../../components/taskdialog";
import ProgressBar from "../../components/progressbar";
import { ref } from "vue";
import { useStore } from "vuex";
import { ITask, ITaskList } from "../../store/todoList/index";
import { v4 as uuidv4 } from "uuid";

const store = useStore();
const useAddTask = () => {
  const addTask_dialogTableVisible = ref(false);
  const task = ref<ITask | null>(null);

  const openAddTask = () => {
    task.value = {
      id: uuidv4(),
      name: "任务名称",
      describe: "描述",
      completed: false,
      priority: 1,
    };
    addTask_dialogTableVisible.value = true;
  };
  const cancelAddTask = () => {
    addTask_dialogTableVisible.value = false;
    console.log(addTask_dialogTableVisible.value);
  };
  const addTask = (data) => {
    addTask_dialogTableVisible.value = false;
    store.commit("todoList/addTask", data.value);
    console.log(store.state.todoList);
  };
  return {
    addTask_dialogTableVisible,
    openAddTask,
    cancelAddTask,
    addTask,
    task,
  };
};

const useProgressBar = () => {
  const currentProgress = store.getters["todoList/completedTasks"].length;
  const allProgress = store.state.todoList.tasks.length;
  return {
    currentProgress,
    allProgress,
  };
};

const {
  addTask_dialogTableVisible,
  openAddTask,
  cancelAddTask,
  addTask,
  task,
} = useAddTask();
const { currentProgress, allProgress } = useProgressBar();
</script>

<style>
.el-popper.is-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

.el-popper.is-customized .el-popper__arrow::before {
  background: linear-gradient(45deg, #b2e68d, #bce689);
  right: 0;
}
</style>

<style lang="less" scoped>
.root {
  .header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 20px 30px 0;

    .buttons {
      // justify-items: flex-end;
    }
  }

  .body {
  }

  .footer {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    // background-color: antiquewhite;
    .progress {
      width: 500px;
      height: 30px;
    }
  }
}
</style>
