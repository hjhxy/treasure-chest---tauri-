<script lang="ts" setup>
import { onActivated, onMounted, ref, Ref } from "vue";
import OpenAI from "openai";
import { nanoid } from "nanoid";

interface IChatData {
  id: number|string;
  content: string;
  sender: string;
  time: string;
}
const $messageList = ref<HTMLElement | null>(null);
const scrollToBottom = () => {
  setTimeout(() => {
    $messageList.value!.scrollTop = $messageList.value!.scrollHeight;
  }, 0);
};
onMounted(() => {
  scrollToBottom();
  onActivated(() => {
    scrollToBottom();
  });
});

// deepseek key
const openai = async (msg: string) => {
  const openai = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: "",
  });
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: msg||"You are a helpful assistant." }],
    model: "deepseek-chat",
  });
  return completion.choices[0].message.content;
};

const resolve_chat = () => {
  const messages: Ref<IChatData[]> = ref([
    {
      id: 0,
      content: "Hi, I'm here to help you with your coffee needs!",
      sender: "Bot",
      time: new Date().toLocaleString(),
    },
    {
      id: 1,
      content: "Can you tell me about your favorite coffee beans?",
      sender: "User",
      time: new Date().toLocaleString(),
    },
    {
      id: 2,
      content: "I'm interested in Ethiopian Yirgacheffe beans.",
      sender: "User",
      time: new Date().toLocaleString(),
    },
    {
      id: 3,
      content: "Great choice! How long should I prepare the coffee?",
      sender: "Bot",
      time: new Date().toLocaleString(),
    },
    {
      id: 4,
      content: "I'll aim for 30-45 minutes.",
      sender: "User",
      time: new Date().toLocaleString(),
    },
    {
      id: 5,
      content:
        "That sounds perfect! What's the best way to measure the coffee?",
      sender: "Bot",
      time: new Date().toLocaleString(),
    },
    {
      id: 6,
      content: "I'll use a coffee grinder with a stainless steel head.",
      sender: "User",
      time: new Date().toLocaleString(),
    },
  ]);
  const inputMessage = ref("");
  const isentering = ref(false);
  const $input = ref<HTMLInputElement | null>(null);
  const handleEnter = (event: KeyboardEvent) => {
    if (event.shiftKey) {
      console.log("换行");
      if (!inputMessage.value.trim().length) return;
      inputMessage.value = inputMessage.value + "\n";
      return;
    } else {
      sendMessage();
      event.preventDefault();
    }
  };
  const sendMessage = async () => {
    try {
      if (isentering.value) return;
      isentering.value = true;
      if (inputMessage.value.trim().length <= 0) {
        return;
      }
      messages.value.push({
        id: nanoid(),
        content: inputMessage.value,
        sender: "User",
        time: new Date().toLocaleString(),
      });
      scrollToBottom();
      let res = await openai(inputMessage.value);
      messages.value.push({
        id: nanoid(),
        content: res || "",
        sender: "Bot",
        time: new Date().toLocaleString(),
      });
      scrollToBottom();
      console.log(res);
    } catch (error: any) {
      console.error("Error:", error.message);
    } finally {
      isentering.value = false;
      inputMessage.value = "";
      console.log(111, $input.value);
      $input.value?.focus();
    }
  };
  return {
    messages,
    inputMessage,
    isentering,
    sendMessage,
    handleEnter,
    $input,
  };
};

const resolveInfo = () => {
  const dialogVisible = ref(false);
  const aboutTips = () => {
    dialogVisible.value = true;
  };
  return {
    dialogVisible,
    aboutTips,
  };
};

const { messages, inputMessage, isentering, handleEnter, $input } =
  resolve_chat();
const { dialogVisible, aboutTips } = resolveInfo();
</script>

<template>
  <!-- 初始化聊天模版 -->
  <div id="chat-container">
    <div id="chat-window" shadow="never">
      <div id="chat-info">
        <div class="info-title">
          Chat Bot&nbsp;&nbsp;<el-link type="primary" @click="aboutTips"
            >Tips</el-link
          >
        </div>
      </div>
      <div id="message-list" ref="$messageList">
        <div v-for="message in messages" :key="message.id" class="message">
          <el-card
            shadow="hover"
            v-if="message.sender == 'Bot'"
            class="bot-message"
          >
            <div>{{ message.content }}</div>
          </el-card>
          <el-card shadow="hover" v-else class="sender-message">{{
            message.content
          }}</el-card>
        </div>
      </div>
      <div id="message-input">
        <el-input
          ref="$input"
          class="input-message"
          type="textarea"
          v-model.trim="inputMessage"
          @keyup.enter="handleEnter"
          placeholder="You can try asking me a question"
          :autosize="{ minRows: 4, maxRows: 4 }"
          resize="none"
          :disabled="isentering"
        />
        <!-- <el-button
          :loading="isentering"
          class="input-btn"
          type="primary"
          @click="sendMessage"
          >Send</el-button
        > -->
      </div>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" title="Tips" width="50%" draggable>
    <div class="content">
      <h4>1. 关于LLM模块</h4>
      <p>
        接入了DeepSeek和豆包的LLM，使用上也与其一致，目前只支持文字对话。
      </p>
      <br />
      <h4>2. 怎么使用</h4>
      <p>
        正常对话即可，LLM可以结合上下文作答，可以选择是否缓存聊天记录，具体看设置模块(默认缓存，聊天结果会被保存至本地目录...)。
      </p>
      <p>
        enter: 发送。
        enter+shift：换行。
      </p>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">
          好的😋
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
/deep/.el-card__body {
  padding: 10px 15px;
}

#chat-container {
  display: flex;
  flex-direction: column;
  padding-left: 2px;
  width: 100%;
  height: calc(100vh - 50px);
  max-height: 100vh;

  #chat-window {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    #chat-info {
      width: 100%;
      height: 50px;
      background: linear-gradient(to bottom, white, rgb(236, 236, 236));      ;
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #message-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 10px 20px;
      overflow-y: auto;
      scroll-behavior: smooth; /* 设置平滑滚动 */

      .bot-message,
      .sender-message {
        margin-top: 20px;
        width: 80%;
        border-radius: 20px;
      }

      .bot-message {
        background-color: rgba(241, 199, 236, 0.3);
        align-self: flex-start;
      }

      .sender-message {
        background-color: rgba(71, 209, 66, 0.2);
        align-self: flex-end;
        float: right;
      }
    }

    #message-input {
      height: 100px;
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      padding: 0px 15px;
      box-sizing: border-box;

      .input-message {
        flex: 1;
        border: none;
      }

      .input-btn {
        margin-left: 10px;
        align-self: center;
      }
    }
  }
}
</style>
