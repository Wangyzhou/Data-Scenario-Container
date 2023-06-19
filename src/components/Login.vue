<template>
  <div class="loginFormContainer">
    <el-form label-width="60px" class="login_form" ref="ruleFormRef" :model="loginForm" :rules="rules">
      <h3 class="login_title">用户登录</h3>
      <el-form-item label="账号" prop="username">
        <el-input :prefix-icon="UserFilled" type="" placeholder="请输入用户名" v-model="loginForm.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="loginForm.password" />
      </el-form-item>
      <el-form-item>
        <div class="innerContainer">
          <el-button style="color:white; background-color: transparent;" @click="login(ruleFormRef as FormInstance)">登录</el-button>
          <el-button style="color:white; background-color: transparent;" @click="register">注册</el-button>&nbsp;&nbsp;
          <a href="#">忘记密码？点击找回</a>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { UserFilled, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import userApi from '~/http/api/userApi'
import { useRouter } from 'vue-router'
import { Session } from '~/cache/index'
import { useUserStore } from '~/store/user'

interface LoginUser {
  username: string,
  password: string
}

const loginForm = reactive<LoginUser>({
  username: '',
  password: ''
})

const router = useRouter();

const ruleFormRef = ref<FormInstance>();

const userStore = useUserStore()

const rules = reactive<FormRules>({
  username: [
    {
      required: true,
      message: '用户名不能为空！',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '密码不能为空！',
      trigger: 'blur'
    }
  ]
})

const resetForm = (formEL: FormInstance | undefined) => {
  if (!formEL) return
  formEL.resetFields()
}

const login = (formData: FormInstance) => {
  if (!formData) return
  formData.validate((valid) => {
    if (valid) {
      userApi.login(loginForm).then(res => {
        if (res.code == 200) {
          console.log(res)
          Session.set('token', res.data.token)
          // Session.set('user_id', res.data.loginUser.id)
          // Session.set('user_avatar', res.data.loginUser.avatar)
          // Session.set('user_name', res.data.loginUser.username)
          // Session.set('user_roles', res.data.loginUser.roles)
          Session.set('login_user', res.data.loginUser)
          userStore.setLoginUser(res.data.loginUser)
          userStore.setToken(res.data.token)
          router.push('/home')
          ElMessage({
            type: 'success',
            message: res.msg
          })
        }
      })
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const register = () => {

}
</script>

<style lang="scss" scoped>
.loginFormContainer {
  height: 200px;
  width: 300px;
}

.login_form {
  width: 100%;
  border: 1px solid transparent;
  border-radius: 15px;
  padding-right: 30px;
  /* 为其整体设置接近透明的效果*/
  background-color: rgba(255, 255, 255, 0.1);
  /* 设置box-shadow使其有立体感 */
  box-shadow: 5px 5px 0 0 rgba(0, 0, 0, 0.2);
  position: relative;
  left: -15px;
}

.el-form-item {
  background-color: unset !important;
}

.el-form-item__label {
  /* 给el-form组件的label标签颜色修改 */
  color: #a3a3a3;
}

.el-input__inner {
  /* 使input框的背景变透明 */
  background-color: rgba(255, 255, 255, 0.247);
  /* 使边框也变透明 */
  // border-color: transparent;
  /* 给边框加阴影能够使其有立体感 */
  box-shadow: 2px 2px 0 0 rgba(0, 0, 0, 0.2);
  /* 改变获取焦点后的竖线颜色 */
  caret-color: rgba(0, 255, 255, 0.8);
  /* color: #FFFFFF; */
}

.el-input__inner:hover {
  border-color: rgb(0, 255, 255);
}

.el-input__inner:focus {
  border-color: rgb(5, 57, 228);
}

.login_title {
  color: #080808;
  text-align: center;
  font-size: 25px;
}

.innerContainer {
  display: flex;
}
</style>