<script setup lang="ts">
import userRequest from '~/http/api/userApi'
import { ref, reactive } from 'vue';
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'

interface ResType<T> {
  code: number,
  message: string,
  data?: T,
  error?: string
}

interface User {
  name: string,
  password: string
}

interface RegisterUser {
  name: string,
  password: string,
  email: string,
  institution?: string,
  picture?: BinaryData,
}
interface RegisterData {
  data: RegisterUser
}
const imageUrl = ref('')
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

const loginUser: User = {
  name: 'ninja',
  password: 'wangyazhou123333'
}

const registerUser = reactive<RegisterData>({
  data: {
    name: '',
    password: '',
    email: '',
    institution: '',
    picture : undefined
  } as any
})

// const handleRequest = () => {
//   userRequest.login("/user/login", loginUser).then(res => {
//     console.log(res.data)
//   })
//   // userRequest.hello("/hello").then(res => {
//   //   console.log(res.data)
//   // })
// }
const handleRegister = () => {
  // userRequest.register("/user/register", registerUser.data).then(res => {
  //   console.log(res)
  // })
}
</script>

<template>
  <el-form label-position="right" label-width="150px" :model="registerUser.data" style="max-width: 800px">
    <el-form-item label="头像">
      <el-upload class="avatar-uploader" :show-file-list="false" :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon">
          <Plus />
        </el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item label="用户名">
      <el-input v-model="registerUser.data.name" />
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="registerUser.data.password" type="password" />
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="registerUser.data.email" />
    </el-form-item>
    <el-form-item label="机构">
      <el-input v-model="registerUser.data.institution" />
    </el-form-item>
  </el-form>
  <el-button @click="handleRegister">注册</el-button>
</template>

<style scoped>


.avatar-uploader .el-upload {
  border: 1px dashed blue;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: black;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
