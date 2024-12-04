<template>
  <el-dialog
    v-model="dialogVisiable"
    :modal="true"
    :destroy-on-close="true"
    class="task_dialog"
    :show-close="false"
    :title="props.title"
    width="500"
  >
    <div class="body">
      <p class="editable-p task_name" contenteditable="true" @input="onTaskNameInput">
        {{ editTask?.name }}
      </p>
      <p
        class="editable-p task_describ"
        contenteditable="true"
        @input="onTaskDescribInput"
      >
        {{ editTask?.describe }}
      </p>
      <div class="tags">
        <el-tooltip
          content="设置日期"
          :offset="4"
          placement="top"
          effect="customized"
          trigger="hover"
          :show-arrow="false"
          :show-after="100"
        >
          <el-button
            ><el-icon :size="16" color="red"> <Sunrise /> </el-icon>今天</el-button
          >
        </el-tooltip>
        <el-tooltip
          content="添加优先级：P(1-5)"
          :offset="4"
          placement="top"
          effect="customized"
          :show-arrow="false"
          :show-after="100"
        >
          <el-button
            ><el-icon :size="16" color="red"> <MagicStick /> </el-icon>优先级</el-button
          >
        </el-tooltip>
        <el-tooltip
          content="添加提醒(弹窗/公众号)"
          :offset="4"
          placement="top"
          effect="customized"
          :show-arrow="false"
          :show-after="100"
        >
          <el-button
            ><el-icon :size="16" color="red"> <AlarmClock /> </el-icon>提醒</el-button
          >
        </el-tooltip>
      </div>
    </div>
    <el-divider border-style="dashed" />
    <div class="buttons">
      <el-button type="info" plain @click="cancel">{{
        props.cancelBtn || "取消"
      }}</el-button>
      <el-button color="#db4336" plain @click="ok">{{
        props.ensureBtn || "确认"
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  Sunrise,
  Plus,
  TrendCharts,
  MagicStick,
  View,
  AlarmClock,
  Bicycle,
  Tickets,
} from "@element-plus/icons-vue";
import { ref, computed, watch, defineProps, defineEmits } from "vue";
import { ITask } from "../store/todoList/index";

const props = defineProps<{
  title: string;
  dialogVisiable: boolean;
  task: ITask;
  cancelBtn: string;
  ensureBtn: string;
}>();
const emit = defineEmits<{
  (e: "ok", newMessage: string): void;
  (e: "cancel", newMessage: string): void;
}>();

const useDialog = () => {
  const editTask = ref<ITask|null>(null);

  watch(
    () => props.task,
    (newVal, oldVal) => {
      if (newVal) {
        editTask.value = {
          ...newVal
        }
      }
    },
    { deep: true, immediate: true }
  );

  const dialogVisiable = computed(() => {
    return props.dialogVisiable;
  });

  const onTaskNameInput = (event) => {
    const text = event.target.innerText;
    editTask.value.name = text;
  };

  const onTaskDescribInput = (event) => {
    const text = event.target.innerText;
    editTask.value.describe = text;
  };

  const ok = () => {
    emit("ok", editTask);
  };
  const cancel = () => {
    emit("cancel");
  };
  return {
    editTask,
    dialogVisiable,
    onTaskNameInput,
    onTaskDescribInput,
    ok,
    cancel,
  };
};
const { dialogVisiable, editTask, onTaskNameInput, onTaskDescribInput, ok, cancel } = useDialog();
</script>

<style lang="less" scoped>
.task_dialog {
  .body {
    margin-top: 10px;
    .editable-p {
      //   padding: 10px 0;
      border: none;
      outline: none;
      resize: none;
      //   line-height: 20px;
      margin-bottom: 10px;
      padding: 4px 10px;
      border-radius: 3px;
      cursor: text;
      background-color: transparent;
      white-space: pre-wrap; /* 保留空格和换行 */
      word-wrap: break-word; /* 自动换行 */
      overflow-y: auto; /* 超出内容显示滚动条 */

      &:focus {
        background-color: rgba(243, 254, 31, 0.2);
      }
    }

    .task_name {
      font-size: 20px;
      max-height: 40px; //允许输入一行
    }

    .task_describ {
      font-size: 14px;
      max-height: 80px;
    }

    .tags {
      margin-top: 20px;

      .el-button {
        height: 28px;
        font-size: 12px;
        padding: 3px 16px;
      }
    }
  }

  .buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
