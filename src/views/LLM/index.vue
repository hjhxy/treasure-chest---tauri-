<script lang="ts" setup>
import { onMounted, ref, Ref } from "vue";
import OpenAI from "openai";
import { nanoid } from "nanoid";

interface IChatData {
  id: number;
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
});

// deepseek key: sk-c790d02c0e4f4e53bd07df6499bd6fce
const openai = async (msg: string) => {
  const openai = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: "sk-c790d02c0e4f4e53bd07df6499bd6fce",
  });
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
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
      content: "That sounds perfect! What's the best way to measure the coffee?",
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
  const sendMessage = async () => {
    try {
      if (isentering.value) return;
      isentering.value = true;
      if (inputMessage.value.trim().length <= 0) {
        return;
      }
      messages.value.push({
        id: messages.value.length,
        content: inputMessage.value,
        sender: "User",
        time: new Date().toLocaleString(),
      });
      scrollToBottom();
      let res = await openai(inputMessage.value);
      messages.value.push({
        id: messages.value.length,
        content: res || "",
        sender: "Bot",
        time: new Date().toLocaleString(),
      });
      scrollToBottom();
      console.log(res);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      isentering.value = false;
      inputMessage.value = "";
    }
  };
  return { messages, inputMessage, isentering, sendMessage };
};

const { messages, inputMessage, isentering, sendMessage } = resolve_chat();
</script>

<template>
  <!-- 初始化聊天模版 -->
  <div id="chat-container">
    <div id="chat-window">
      <div id="message-list" ref="$messageList">
        <div v-for="message in messages" :key="message.id" class="message">
          <div v-if="message.sender == 'Bot'" class="bot-message">
            <div>{{ message.content }}</div>
          </div>
          <div v-else class="sender-message">{{ message.content }}</div>
        </div>
      </div>
      <div id="message-input">
        <el-input
          class="input-message"
          type="textarea"
          v-model.trim="inputMessage"
          @keyup.enter="sendMessage"
          placeholder="Type a message and press Enter"
          :autosize="{ minRows: 3, maxRows: 5 }"
          resize="none"
          :disabled="isentering"
        />
        <el-button
          :loading="isentering"
          class="input-btn"
          type="primary"
          @click="sendMessage"
          >Send</el-button
        >
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
#chat-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  padding: 50px 10px 0;

  #chat-window {
    display: flex;
    flex-direction: column;

    #message-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      height: 500px;
      padding: 20px;
      overflow-y: auto;
      scroll-behavior: smooth; /* 设置平滑滚动 */

      .bot-message,
      .sender-message {
        margin-top: 30px;
        width: 80%;
        border-radius: 10px;
        padding: 10px;
      }

      .bot-message {
        background-color: #ececec;
        align-self: flex-start;
      }

      .sender-message {
        background-color: antiquewhite;
        align-self: flex-end;
        float: right;
      }
    }

    #message-input {
      height: 100px;
      padding-top: 10px;
      display: flex;

      .input-message {
        flex: 1;
        border: none;
        padding-left: 10px;
      }

      .input-btn {
        margin-left: 10px;
        align-self: center;
      }
    }
  }
}
</style>
