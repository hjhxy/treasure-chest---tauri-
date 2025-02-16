<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core";
import { ElNotification } from "element-plus";
import { ref } from "vue";

interface IResponse {
  code: number | string;
  msg?: string;
  datas?: any;
}

const search_grade = () => {
  const cookie = ref(
    "EMAP_LANG=zh; THEME=cherry; _WEU=Y3GgGof5bQF43j0113gRVhCuXCoG5i8DcPF5sKJsAGsdyerFnYH9EFVFXtx_WUWhJugjJ9gz1EtxrWsI0oKUfszlVMQnNAsIckcbpI2yY4C2b2O3eHzK*GydTAh*2OhaK8yn7Z*rIeAOpZTtxegfNydwA_c8pNIjc7DIM9d7MAfxsZJZDVCtk0FWJXRQuK_*XYa8qUXJllIMOPRYTU1seo..; _webvpn_key=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiMjQxMDEwNDAwNCIsImdyb3VwcyI6WzE3XSwiaWF0IjoxNzIxNjE3Mzc1LCJleHAiOjE3MjE3MDM3NzV9.I0xmqkAu8NLv0tvqcwPVihZqQerPlpB-RPOW2m8IfYQ; webvpn_username=2410104004%7C1721617375%7Cda13a91bd649895b0840da6ad5ac2bf82e9900f8; webvpn_username_NS_Sig=oenCV62fmzohvQOy; XK_TOKEN=360f391f-f1a9-4cbe-9ca4-e26e0a3eed4c; insert_cookie=38189586; MOD_AUTH_CAS=MOD_AUTH_ST-139167-D3---gHUe2fiY3c4Fl1uRX3vecsciapserver1; asessionid=c9fadbc7-44db-4624-a3ee-f81a1a9d820b; amp.locale=undefined; route=d4c9b24c6fb7a904a59a81621baf32ed; JSESSIONID=egcO2hjg9VQC_Y1TaAD0du8fs1jYA0dmGRWLMmpauu_LqDs_wowC!1915644957"
  );
  const issearching = ref(false);
  const search_data = ref(null);
  const dialogVisible = ref(false);
  const reqmsg = ref("");
  const aboutGrade = () => {
    dialogVisible.value = true;
  };

  const searchGrade = async () => {
    console.log("调试中...");
    try {
      issearching.value = true;
      await new Promise((resolve, reject) => {
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
        return;
      } else {
        search_data.value = response.datas.xscjcx.rows;
        reqmsg.value = `请求成功，共${(search_data.value as any).length}门成绩，已出${
          (search_data.value as any).length
        }门`;
        // ElNotification({
        //   title: 'Success',
        //   message: 'This is a success message',
        //   type: 'success',
        // });
        console.log("查询成功: ", response.datas);
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

const {
  cookie,
  issearching,
  search_data,
  dialogVisible,
  reqmsg,
  aboutGrade,
  searchGrade,
} = search_grade();
</script>

<template>
  <div class="root">
    <el-card class="search" style="background: rgba(73, 171, 238, 0.3);">
      <template #header>
        <div class="card-header">
          <span>深圳大学成绩查询</span>
          <el-link type="primary" @click="aboutGrade">关于</el-link>
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

    <el-dialog v-model="dialogVisible" title="Tips" width="50%" draggable>
      <div class="content">
        <h4>1. 这个模块的作用是什么？</h4>
        <p>学校有成绩查询为什么还需要这个？因为官网的只有在指定日期后才展示，在这之前官网不会开放查看权限，而实际老师的评分时间在这之前。</p><br/>
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
          <el-button type="primary" @click="dialogVisible = false"> 好的😋 </el-button>
        </div>
      </template>
    </el-dialog>

    <el-card class="result">
      <el-table
        :loading="issearching"
        :data="search_data"
        style="width: 100%;"
        height="300"
      >
        <el-table-column fixed prop="KCMC" label="课程名称" width="120" />
        <el-table-column prop="CJXSZ" label="分数" width="120" />
        <el-table-column prop="JDZ" label="绩点" width="120" />
        <el-table-column prop="XF" label="学分" width="100" />
        <el-table-column prop="CZRXM" label="任课老师" width="100" />
        <el-table-column prop="CZSJ" label="评分日期" width="150" />
      </el-table>
    </el-card>
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
    margin-top: 10px;
  }
}
</style>
