<script setup lang="ts">
import { Sunrise, MagicStick, AlarmClock } from "@element-plus/icons-vue";
import { ref, computed, watch, defineProps, defineEmits } from "vue";
import { ITask, priority } from "../store/todoList/index";
import Time from "./time.vue";
import Priority from "./priority.vue";
import Alarm from "./alarm.vue";

const props = defineProps<{
  title: string;
  dialogVisiable: boolean;
  task: ITask | null;
  cancelBtn?: string;
  ensureBtn: string;
}>();
const $emit = defineEmits<{
  (e: "ok", newMessage: ITask): void;
  (e: "cancel"): void;
}>();

const useTimePopover = () => {
  const timePopoverRef = ref<any>(null);
  const showTimePopover = () => {
    console.log(timePopoverRef);
    timePopoverRef.value!.delayHide?.();
  };
  return {
    timePopoverRef,
    showTimePopover,
  };
}

const usePriorityPopover = () => {
  const priorityPopoverRef = ref<any>(null);
  const showPriorityPopover = () => {
    console.log(priorityPopoverRef);
    visiblePriority.value = true;
  };
  const priorityIndex = ref<priority>(1);
  const visiblePriority = ref<boolean>(false);
  const choosePriority = (data: priority) => {
    priorityIndex.value = data;
    visiblePriority.value = false;
  };
  return {
    priorityPopoverRef,
    priorityIndex,
    visiblePriority,
    choosePriority,
    showPriorityPopover,
  };
};

const useAlarmPopver = () => {
  const alarmPopoverRef = ref<any>(null);
  const showAlarmPopover = () => {
    console.log(alarmPopoverRef);
    // alarmPopoverRef.value!.delayHide?.()
  };
  return {
    alarmPopoverRef,
    showAlarmPopover,
  };
};

const useDialog = () => {
  const editTask = ref<ITask | null>(null);

  watch(
    () => props.task,
    (newVal, _) => {
      if (newVal) {
        editTask.value = {
          ...newVal,
        };
      }
    },
    { deep: true, immediate: true }
  );

  const dialogVisiable = computed(() => {
    if (!props.dialogVisiable) {
      visiblePriority.value = false;
    }
    return props.dialogVisiable;
  });

  const onTaskNameInput = (event: Event) => {
    const text = (event.target as HTMLInputElement).innerText;
    editTask.value!.name = text;
  };

  const onTaskDescribInput = (event: Event) => {
    const text = (event.target as HTMLInputElement).innerText;
    editTask.value!.describe = text;
  };

  const ok = () => {
    $emit("ok", editTask.value as ITask);
  };
  const cancel = () => {
    $emit("cancel");
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

const {
  priorityPopoverRef,
  showPriorityPopover,
  priorityIndex,
  visiblePriority,
  choosePriority,
} = usePriorityPopover();
const {
  timePopoverRef,
  showTimePopover,
} = useTimePopover();
const {
  alarmPopoverRef,
  showAlarmPopover,
} = useAlarmPopver();
const {
  dialogVisiable,
  editTask,
  onTaskNameInput,
  onTaskDescribInput,
  ok,
  cancel,
} = useDialog();
</script>

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
          <el-button v-popover="timePopoverRef" @click="showTimePopover"
            ><el-icon :size="16" color="red"> <Sunrise /> </el-icon>今天</el-button
          >
        </el-tooltip>
        <el-popover
          ref="timePopoverRef"
          trigger="click"
          placement="bottom-start"
          virtual-triggering
          persistent
        >
          <Time />
        </el-popover>
        <el-tooltip
          content="添加优先级：P(1-5)"
          :offset="4"
          placement="top"
          effect="customized"
          :show-arrow="false"
          :show-after="100"
        >
          <el-button v-popover="priorityPopoverRef" @click="showPriorityPopover"
            ><el-icon :size="16" color="red"> <MagicStick /> </el-icon>优先级</el-button
          >
        </el-tooltip>
        <el-popover
          ref="priorityPopoverRef"
          trigger="click"
          placement="bottom-start"
          virtual-triggering
          persistent
          :width="50"
          :visible="visiblePriority"
        >
          <Priority :chooseIndex="priorityIndex" @choosePriority="choosePriority" />
        </el-popover>
        <el-tooltip
          content="添加提醒(弹窗/公众号)"
          :offset="4"
          placement="top"
          effect="customized"
          :show-arrow="false"
          :show-after="100"
        >
          <el-button v-popover="alarmPopoverRef" @click="showAlarmPopover"
            ><el-icon :size="16" color="red"> <AlarmClock /> </el-icon>提醒</el-button
          >
        </el-tooltip>
        <el-popover
          ref="alarmPopoverRef"
          trigger="click"
          placement="bottom-start"
          virtual-triggering
          persistent
        >
          <Alarm />
        </el-popover>
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
