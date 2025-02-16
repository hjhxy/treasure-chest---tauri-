<script setup lang="ts">
import { ref } from "vue";
import { invoke } from "@tauri-apps/api/core";

const search_grade = () => {
  const cookie = ref(
    "EMAP_LANG=zh; THEME=cherry; _WEU=T6h1AlMeJCHJFXrQHSsY5ZDELnLYNCnXtb0yt3sB7XKn*dB4tHg*6FUp1Q_dkJ_fPbFiAby0Nvedlunp9w6bIvrbghm3OPQJWbea3vAfpTaCMA4tjSdbMAKsgHdcIDzSgq4nFxe1fIWyzYhd9k32Ohgluxe*6**jt20z99qnoqasudlkVBD_QXX*P*W8KcU3UDdvgEBGiKDN4hCHzqZ0Eo..; insert_cookie=38189586; MOD_AUTH_CAS=MOD_AUTH_ST-134998-Fowua580UOCBjDvi4G74m93GYLcciapserver3; asessionid=e5ec688e-3d11-40aa-82b8-76ab58794b0a; amp.locale=undefined; JSESSIONID=ZHoOEYHoguYfCMbLGOA8-B5PMSQr6vB8QjpShs_0khLs3oCtvulg!1130936546; route=74c501c1243c125f7a9379cabda1364b"
  );
  const issearching = ref(false);

  const searchGrade = async () => {
    try {
      const response = await invoke("search_grade_api", {
        url: "'https://ehall.szu.edu.cn/gsapp/sys/szdxwdcjapp/modules/wdcj/xscjcx.do'",
        cookie: cookie.value,
      });
      console.log("response: ", response);
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  };

  return {
    cookie,
    issearching,
    searchGrade,
  };
};

const { cookie, issearching, searchGrade } = search_grade();
</script>

<template>
  <div class="root">
    <el-card class="search">
      <template #header>
        <div class="card-header">
          <span>深圳大学成绩查询</span>
          <el-link type="primary">关于</el-link>
        </div>
      </template>
      <div class="card-container">
        <div class="msg-input">
          <label for="cookie">cookie：</label>
          <el-input
            id="cookie"
            v-model="cookie"
            style="width: 340px"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="输入cookie，教程可登录github:xxx查看"
          />
        </div>
        <el-button
          :loading="issearching"
          class="search-btn"
          type="success"
          round
          @click="searchGrade"
          >查询</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
.root {
  padding: 10px;

  .search {
    .card-header {
    }

    .card-container {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .msg-input {
      }

      .search-btn {
      }
    }
  }
}
</style>
