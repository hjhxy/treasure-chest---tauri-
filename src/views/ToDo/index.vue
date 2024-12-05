<script setup lang="ts">
import { Plus, TrendCharts, View, Bicycle, Tickets } from "@element-plus/icons-vue";
import TaskDialog from "../../components/taskdialog.vue";
import ProgressBar from "../../components/progressbar.vue";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { ITask, ITaskList } from "../../store/todoList/index";
import { v4 as uuidv4 } from "uuid";

const store = useStore();

const useSideBar = ()=>{
  const controlSideBar = ()=>{

  }
}

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
  const addTask = (data: ITask) => {
    addTask_dialogTableVisible.value = false;
    store.commit("todoList/addTask", data);
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

const useSortTask = () => {
  const sortTask = ()=>{
    store.commit("todoList/sortTask", 'priority');
    console.log(store.state.todoList);
  };
  return {
    sortTask,
  };
};

const useProgressBar = () => {
  const currentProgress = computed(()=>{
    console.log(11, store.getters["todoList/completedTasks"].length);
    return store.getters["todoList/completedTasks"].length
  });
  const allProgress = computed(()=>{
    return store.state.todoList.tasks.length || 1
  });
  const overProportion = computed(()=>{
    return Number((currentProgress.value/allProgress.value).toFixed(2)) * 100
  });
  return {
    currentProgress,
    allProgress,
    overProportion,
  };
};

const {
  addTask_dialogTableVisible,
  openAddTask,
  cancelAddTask,
  addTask,
  task,
} = useAddTask();

const { sortTask } = useSortTask();
const { currentProgress, allProgress, overProportion } = useProgressBar();
</script>

<template>
  <div class="root">
    <div class="header">
      <div class="buttons">
        <el-button color="#db4336" plain @click="openAddTask">
          <el-icon><Plus /></el-icon>
          <span>添加任务</span>
        </el-button>
        <el-button color="#db4336" plain @click="sortTask">
          <el-icon><TrendCharts /></el-icon>
          排序
        </el-button>
        <el-button color="#db4336" plain>
          <el-icon><View /></el-icon>
          <span>预览</span>
        </el-button>
      </div>
    </div>

    <div class="body">
      <el-divider content-position="left" border-style="dashed">
        <el-icon :size="16" color="green"><Tickets /></el-icon> Task List
      </el-divider>
      <RouterView />
    </div>

    <div class="footer">
      <el-divider content-position="left" border-style="dashed">
        <el-icon :size="20" color="green"><Bicycle /></el-icon> Completion progress（{{ overProportion }}%）
      </el-divider>
      <div class="progress">
        <ProgressBar :current="currentProgress" :all="allProgress" />
      </div>
    </div>
  </div>
  <TaskDialog
    title="Add Task"
    ensureBtn="确认添加"
    :dialogVisiable="addTask_dialogTableVisible"
    :task="task"
    @ok="addTask"
    @cancel="cancelAddTask"
  />
</template>

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
  display: flex;
  flex-direction: column;
  // justify-content: flex-start;
  // justify-content: space-between;
  width: 100%;
  height: 100%;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 30px 0;

    .buttons {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }

  .body {
  }

  .footer {
    // background-color: red;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    .progress {
      width: 100%;
      height: fit-content;
    }
  }
}
</style>
