<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core";
import { ElNotification } from "element-plus";
import { onActivated, onMounted, ref } from "vue";

interface IResponse {
  code: number | string;
  msg?: string;
  datas?: any;
}

const search_grade = () => {
  const cookie = ref(
    "EMAP_LANG=zh; THEME=cherry; _WEU=PyMvEPvtCnTue_F94Lj8nDPr6B1EUhMywXSyg64W_lfJ8gncwt1bHn82_Peo8uap3kowO*95mXy4ypdDPkmhbUHmRr6SRmABi0olHWlruKNaRHKtYQzxLDMTw5*vTWx4Nif1cv7h_o5iLsJagnpGcipggIgUMn2vsILCSsrveHe2VHAV8f7w8xsDTNLn0EgNagKtHK7H4OEFlmYPLElGtj..; insert_cookie=38189586; MOD_AUTH_CAS=MOD_AUTH_ST-192426-fGgYCyRaa3wHrPUwvjw-Bngf7eQciapserver1; asessionid=4d169c2c-4615-4517-aa14-73ce6f60bb3f; amp.locale=undefined; route=d4c9b24c6fb7a904a59a81621baf32ed; JSESSIONID=lm0eNsK4Gl3tzPyEu6dLxjSNmYVVIqBukdtXHYGI9W6UFKPY_o7c!-786826884"
  );
  const issearching = ref(false);
  const search_data = ref([]);
  const dialogVisible = ref(false);
  const reqmsg = ref("");
  const aboutGrade = () => {
    dialogVisible.value = true;
  };

  const searchGrade = async () => {
    console.log("调试中...");
    try {
      issearching.value = true;
      await new Promise((resolve, _) => {
        setTimeout(() => {
          resolve(1);
        }, 200);
      });
      const response: IResponse = await invoke("search_grade_api", {
        url: "https://ehall.szu.edu.cn/gsapp/sys/szdxwdcjapp/modules/wdcj/xscjcx.do",
        cookie: cookie.value,
      });
      if (response.code == 400) {
        reqmsg.value = response.msg!;
        ElNotification({
          title: "查询成功",
          message: reqmsg.value,
          type: "error",
        });
        return;
      } else {
        const response_data = response.datas.xscjcx;
        reqmsg.value = `查询成功，当前共 ${response_data.totalSize} 门课程，已出 ${response_data.rows.length} 门`;
        ElNotification({
          title: "查询成功",
          message: reqmsg.value,
          type: "success",
        });
        search_data.value = response_data.rows;
        console.log("查询成功: ", search_data.value);
      }
    } catch (error: any) {
      reqmsg.value = error.message;
    } finally {
      issearching.value = false;
    }
  };

  return {
    cookie,
    issearching,
    search_data,
    dialogVisible,
    reqmsg,
    aboutGrade,
    searchGrade,
  };
};

const result_card_style = () => {
  const $search_card = ref<HTMLElement | null>(null);
  const $resut_card = ref<HTMLElement | null>(null);
  const table_height = ref<number | string>(0);
  const resize = () => {
    if ($search_card.value && $resut_card.value) {
      table_height.value = `${
        window.innerHeight - $search_card.value.offsetHeight - 80
      }px`;
      $resut_card.value!.style.height = table_height.value;
    }
  };
  onMounted(() => {
    resize();
    window.onresize = () => {
      resize();
    };

    onActivated(() => {
      resize();
    });
  });
  return {
    $resut_card,
    $search_card,
    table_height,
  };
};

const {
  cookie,
  issearching,
  search_data,
  dialogVisible,
  aboutGrade,
  searchGrade,
} = search_grade();

const { $search_card, $resut_card } = result_card_style();
</script>

<template>
  <div class="root">
    <div class="search_container" ref="$search_card">
      <el-card class="search" style="background: rgba(73, 171, 238, 0.3)">
        <template #header>
          <div class="card-header">
            <span>深圳大学成绩查询</span>
            <el-link type="primary" @click="aboutGrade">Tips</el-link>
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
              resize="none"
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

    <el-dialog v-model="dialogVisible" title="Tips" width="50%" draggable>
      <div class="content">
        <h4>1. 这个模块的作用是什么？</h4>
        <p>
          学校有成绩查询为什么还需要这个？因为官网的只有在指定日期后才展示，在这之前官网不会开放查看权限，而实际老师的评分时间在这之前。
        </p>
        <br />
        <h4>2. 成绩查询如何操作？</h4>
        <p></p>
        <p>
          该工具的源码已经开源到Github，具体可以查阅提供的
          <span
            >Github链接（https://github.com/hjhxy/treasure-chest---tauri），当然如果有天你发现用不到这个工具的其它功能，也可以单独使用命令行工具，双击即可运行更简单且功能相同，这是下载地址（https://github.com/hjhxy/rust_sz_searde_grade/tags），记得选最新版本安装。</span
          >
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

    <div ref="$resut_card" class="result_container">
      <el-card class="result">
        <el-table
          :loading="issearching"
          :data="search_data"
          style="width: 100%"
        >
          <el-table-column fixed prop="KCMC" label="课程名称" />
          <el-table-column prop="CJXSZ" label="分数" />
          <el-table-column prop="JDZ" label="绩点" />
          <el-table-column prop="XF" label="学分" />
          <el-table-column prop="CZRXM" label="任课老师" />
          <el-table-column prop="CZSJ" label="评分日期" />
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<style lang="less" scoped>
.root {
  padding: 0px 10px 0px;

  .search {
    .card-header {
      display: flex;
      justify-content: space-between;
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

  .result {
    height: fit-content;
    max-height: 100%;
    overflow-y: auto;
    margin-top: 10px;
  }
}
</style>
