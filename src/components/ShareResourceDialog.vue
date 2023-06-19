<template>
  <div>
    <el-dialog v-model="isShareResourceDialogShow" title="分享资源" width="23%" align-center @close="closePreviewDialog"
      destroy-on-close>
      <template #header="{ titleId, titleClass }">
        <div class="my-header">
          <div class="header-text">
            <h2 :id="titleId" :class="titleClass" style="font-size: 25px;">分享资源</h2>
          </div>
          <div class="header-button">
            <el-icon class="LinkCon" title="复制资源链接" size="30" @click="copyResourceLink">
              <Link />
            </el-icon>
          </div>
        </div>
      </template>
      <el-divider border-style="hidden" style="margin-bottom: 20px; margin-top: 5px;" />
      <el-form ref="ruleFormRef" :model="formData.data" label-width="120px" label-position="right" :rules="rules">
        <el-form-item label="受享用户：" size="default" prop="userName">
          <el-input v-model.trim="formData.data.userName" placeholder="请输入受享用户名" />
        </el-form-item>
        <el-form-item>
          <el-divider border-style="hidden" style="margin-bottom: 5px; margin-top: 5px;" />
        </el-form-item>
        <el-form-item style="display: flex;">
          <el-button type="primary" size="default" @click="shareResource(ruleFormRef as FormInstance)">分享</el-button>
          &nbsp;
          &nbsp;
          &nbsp;
          &nbsp;
          &nbsp;
          <el-button type="primary" size="default" @click="closePreviewDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { toRefs, ref, reactive } from 'vue';
import type { FormRules, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Link } from '@element-plus/icons-vue'
import cryptoUtil from '~/utils/cryptoUtil'
import useClipboard from 'vue-clipboard3';
const { toClipboard } = useClipboard();
const props = defineProps({
  isShareResourceDialogShow: {
    type: Boolean,
    default: false
  },
  fileId: {
    type: String,
    default: ''
  },
  fileType: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(["closeShareResourceDialog"])
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '文件夹名称不能为空！', trigger: 'blur' },
  ]
})
const { fileId, fileType, isShareResourceDialogShow } = toRefs(props)
const formData = reactive({
  data: {
    userName: '',
    path: ''
  }
})
const closePreviewDialog = () => {
  emit("closeShareResourceDialog")
}
const shareResource = (formRef: FormInstance) => {

}
const changeSavePath = () => {

}
const copyResourceLink = async () => {
  const val = cryptoUtil.Encrypt(JSON.stringify({
    fileId: fileId.value,
    fileType: fileType.value
  }))
  console.log(JSON.parse(cryptoUtil.Decrypt(val)))
  try {
    await toClipboard(val);
    ElMessage({
      type: 'success',
      message: '复制成功！快去分享吧~'
    })
    // console.log('复制成功!')
  } catch (e) {
    ElMessage({
      type: 'error',
      message: '复制失败！'
    })
  }
}
</script>

<style scoped>
:deep(.el-dialog) {
  border-radius: 20px;
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

.my-header {
  height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-top: 10px;
  font-size: 30px;
}

.header-text {
  flex: 2 1 auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-button {
  display: flex;
  flex: 1 0 auto;
  justify-content: center;
}

.LinkCon {
  cursor: pointer;
  color: rgb(12, 115, 231);
}

.LinkCon:hover {
  color: rgb(3, 19, 73);
}
</style>