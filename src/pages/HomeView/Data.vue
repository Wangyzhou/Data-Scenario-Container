<template>
  <div class="dataCon">
    <div class="backBtnCon" @click="dataBack">
      <el-icon size="20" color="#33b5e5">
        <ArrowLeftBold />
      </el-icon>
      <span class="backBtn">
        返回
      </span>
    </div>
    <div class="tabCon">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="公共数据" name="public">
        </el-tab-pane>
        <el-tab-pane label="临时数据" name="temp">
        </el-tab-pane>
        <el-tab-pane label="用户数据" name="user">
          <UserData />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import UserData from '~/pages/HomeView/UserData.vue'
import {
  ArrowLeftBold,
} from '@element-plus/icons-vue'
import { usePublicStore } from '~/store/publicStore';
import { useRouter } from 'vue-router'
const activeName = ref("user")
const publicStore = usePublicStore()
const router = useRouter()

const dataBack = () => {
  router.push('/home')
  publicStore.updateActiveIndex('1')
}
</script>

<style scoped>
.dataCon {
  height: 100%;
  padding-left: 20px;
  padding-right: 20px;
}

.tabCon {
  /* display: flex; */
  padding-left: 150px;
  padding-right: 250px;
  padding-top: 20px;
  padding-bottom: 20px;
}

:deep(.el-tabs__header) {
  display: flex;
  justify-content: space-around;
}

:deep(.el-tabs__item) {
  font-size: 20px;
}

::deep(.el-tabs) {
  padding-bottom: 20px;
}

.backBtn {
  font-size: 20px;
  color: #33b5e5;
}

.backBtnCon {
  width: 100px;
  position: absolute;
  margin-top: 20px;
}

.backBtnCon:hover {
  transform: scale(1.1);
  cursor: pointer;
}
</style>