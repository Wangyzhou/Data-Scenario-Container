<template>
  <div class="overviewAll">
    <div class="cardCon">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <div>
              <el-icon size="25" color="#33b5e5">
                <Coin />
              </el-icon>&nbsp;
              <span class="card-name">数据资源</span>
            </div>

            <el-button color="#33b5e5" style="background: transparent; color:#33b5e5;" size="large" type="primary"
              :icon="ArrowRightBold" @click="btnClick('/data')" round>进入</el-button>
          </div>
        </template>
        <span>数据中心，对数据的管理</span>
      </el-card>
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <div>
              <el-icon size="25" color="#33b5e5">
                <Tools />
              </el-icon>&nbsp;
              <span class="card-name">工具资源</span>
            </div>
            <el-button color="#33b5e5" style="background: transparent; color:#33b5e5;" size="large" type="primary"
              :icon="ArrowRightBold" @click="btnClick('/tool')" round>进入</el-button>
          </div>
        </template>
        <span>数据中心，对数据的管理</span>
      </el-card>
    </div>
    <div class="cardCon">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <div>
              <el-icon size="25" color="#33b5e5">
                <DataLine />
              </el-icon>&nbsp;
              <span class="card-name">场景中心</span>
            </div>
            <el-button color="#33b5e5" style="background: transparent; color:#33b5e5;" size="large" type="primary"
              :icon="ArrowRightBold" @click="btnClick('/scene')" round>进入</el-button>
          </div>
        </template>
        <span>数据中心，对数据的管理</span>
      </el-card>
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <div>
              <el-icon size="25" color="#33b5e5">
                <Files />
              </el-icon>&nbsp;
              <span class="card-name">项目中心</span>
            </div>
            <el-button color="#33b5e5" style="background: transparent; color:#33b5e5;" size="large" type="primary"
              :icon="ArrowRightBold" @click="btnClick('/project')" round>进入</el-button>
          </div>
        </template>
        <span>数据中心，对数据的管理</span>
      </el-card>
    </div>
    <el-divider />
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRightBold,
  Menu as IconMenu,
  Tools,
  DataLine,
  Files,
  Coin,
  UserFilled,
  Message
} from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
// import { usePublicStore } from '~/store/publicStore'

const router = useRouter()
const route = useRoute()
// const publicStore = usePublicStore()
const btnClick = (param: string) => {
  // publicStore.updateActiveIndex(index)
  router.push(route.path + param)
  // console.log(param)
}
</script>

<style scoped>
.overviewAll {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  justify-content: space-evenly;
}

.cardCon {
  display: flex;
  justify-content: space-evenly;
}


.box-card {
  width: 500px;

}

.card-header {
  display: flex;
  justify-content: space-between;
}

.card-name {
  font-size: 30px;
  font-family: "黑体";
}

.el-button:hover {
  transform: scale(1.2);
  color: deepskyblue;
}
</style>