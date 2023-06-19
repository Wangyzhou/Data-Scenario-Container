<template>
  <div :class="[!isLogin ? 'background-ImgNoVirturl' : 'background-ImgVirturl']">
  </div>
  <div class="btnCon" v-if="!isLogin">
    <el-button size="large" style="color:white; background-color: transparent;"
      @click="handleRegister">注册</el-button>
    <el-button size="large" style="color:white; background-color: transparent;"
      @click="handleLogin">登录</el-button>
  </div>
  <div id="loginForm" v-if="isLogin">
    <Login />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Login from '~/components/Login.vue'

const isLogin = ref(false)
const handleRegister = () => {
  isLogin.value = !isLogin.value
}
const handleLogin = () => {
  isLogin.value = !isLogin.value
}
</script>

<style scoped>
.background-ImgVirturl {
  width: 100%;
  height: 100%;
  background: url("/earth.jpg") center center no-repeat;
  background-size: 100% 100%;
  position: fixed;
  /* -webkit-filter: blur(15px); */
  /* -moz-filter: blur(15px); */
  /* -o-filter: blur(15px);
  -ms-filter: blur(15px); */
  filter: blur(3px);
  /* transform: translate(-50%,-50%); */
}

.background-ImgNoVirturl {
  width: 100%;
  height: 100%;
  background: url("/earth.jpg") center center no-repeat;
  background-size: 100% 100%;
  position: fixed;
}

.btnCon {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  margin-left: -100px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
#loginForm {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  margin-left: -150px;
  margin-top: -70px;
}
</style>