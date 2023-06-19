<template>
  <div class="all">
    <el-header>
      <p class="title">
        数据场景容器平台
      </p>
      <div id="userCon">
        <el-avatar :title="Session.get('token') ? '个人资料编辑' : '未登录！点击跳转登录界面'"
          :src="'data:image/jpeg;base64,' + loginUser.avatar" :size="50" style="cursor: pointer;" @click="clickAvatar" />
        <el-divider direction="vertical" border-style="hidden" />
        <div id="btnCon" v-if="Session.get('token')">
          <el-button type="primary" @click="logout" plain>
            退出登录
          </el-button>
        </div>
      </div>
    </el-header>
    <el-main>
      <RouterView />
    </el-main>
    <el-footer>
      <p class="footerBottom">
        Copyright © 2011-2023 OpenGMS. All rights reserved.
      </p>
    </el-footer>
  </div>
</template>

<script setup lang="ts">
import { useCatalogStore } from '~/store/catalog';
import { useUserStore } from '~/store/user'
import { storeToRefs } from 'pinia';
import { Session } from '~/cache';
import { useRouter } from 'vue-router'
import userApi from '~/http/api/userApi';
import { ElMessage } from 'element-plus'


const userStore = useUserStore()
const catalogStore = useCatalogStore()
const router = useRouter()
const { loginUser } = storeToRefs(userStore)
console.log(loginUser)
console.log(loginUser)

const clickAvatar = () => {
  if (Session.get('token')) {
    console.log('跳转用户页面')
  }
  else {
    router.push({ path: '/' })
  }
}
const logout = () => {
  userApi.logout().then(res => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.msg
      })
      Session.clear()
      userStore.initUser()
      catalogStore.initCatalog()
      router.push({ path: '/' })
    }
  })
}
</script>

<style scoped>
.all {
  width: 100%;
  height: 100%;
  position: absolute;
}

.title {
  color: aliceblue;
}

.el-header {
  width: 100%;
  height: 6%;
  background-color: rgb(29, 58, 92);
  padding: 20px;
  border-bottom: 1px solid darkgray;
  color: #080808;
  font-size: 30px;
  /* text-align: center; */
  line-height: 0px;
  position: relative;
  caret-color: transparent;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.el-main {
  width: 100%;
  height: 90%;
  /* background-color: rgb(196, 196, 14); */
  padding: 0px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.mainContainer {
  width: 100%;
  background-color: #080808;
  margin-top: 20%;
  padding: 0px;
  margin: 0px;
}

.el-footer {
  width: 100%;
  height: 4%;
  padding: 0px;
  /* margin: 0px; */
  background-color: rgb(29, 58, 92);
  display: flex;
  align-items: center;
  justify-content: center;
}

.footerBottom {
  text-align: center;
  color: #c9c2c2;
  font-size: 0.9em;
  margin: 0px;
  bottom: 10px;
}

#userCon {
  display: flex;
}

#btnCon {
  display: flex;
  flex-direction: column;
  justify-content: flex-end
}

.el-avatar:hover {
  transform: scale(1.2);
}

.el-button {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
}

.el-button:hover {
  background-color: #3f9eff;
  color: rgb(20, 49, 129);
  border-color: #3f9eff;
}
</style>