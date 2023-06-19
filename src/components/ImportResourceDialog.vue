<template>
  <div>
    <el-dialog v-model="isImportResourceDialogShow" title="引入资源" width="23%" align-center @close="closePreviewDialog"
      destroy-on-close center>
      <el-form ref="ruleFormRef" :model="formData.data" label-width="120px" label-position="right" :rules="rules">
        <el-form-item label="资源链接：" size="default" prop="link">
          <el-input v-model.trim="formData.data.link" placeholder="请输入资源链接" />
        </el-form-item>
        <el-form-item label="存放路径：" size="default" prop="path">
          <el-input v-model.trim="formData.data.path" :readonly="false">
            <template #append>
              <el-button type="primary" size="default" text @click="changeSavePath">更改</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-divider border-style="hidden" style="margin-bottom: 5px; margin-top: 5px;" />
        </el-form-item>
        <el-form-item style="display: flex;">
          <el-button type="primary" size="default" @click="importResource(ruleFormRef as FormInstance)">引入</el-button>
          &nbsp;
          &nbsp;
          &nbsp;
          &nbsp;
          <el-button type="primary" size="default" @click="closePreviewDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <CatalogTreeDialog v-if="isCatalogTreeDialogShow" :is-catalog-tree-dialog-show="isCatalogTreeDialogShow"
      @confirm-save-path="handleConfirmSavePath" @close-catalog-tree-dialog="handleCloseCatalogTreeDialog" />
  </div>
</template>

<script setup lang="ts">
import { toRefs, ref, reactive, computed, onMounted, toRef, watch } from 'vue';
import type { FormRules, FormInstance } from 'element-plus'
import CatalogTreeDialog from '~/components/CatalogTree.vue'
import { useCatalogStore } from '~/store/catalog';
import catalogApi from '~/http/api/catalogApi'
const props = defineProps({
  isImportResourceDialogShow: {
    type: Boolean,
    default: false
  },
  catalogBreadCrumb: {
    type: Object,
    default: []
  }
})
const { catalogBreadCrumb, isImportResourceDialogShow } = toRefs(props)

const emit = defineEmits(["closeImportResourceDialog", "changeCatalogBreadCrumb", "importResourceConfirm"])
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  link: [
    { required: true, message: '资源链接不能为空！', trigger: 'blur' },
  ]
})
const path = computed(() => {
  let pathStr = ''
  catalogBreadCrumb.value.forEach((catalog: any) => {
    pathStr = pathStr + catalog.title + ' / '
  })
  return pathStr
})
const formData = reactive({
  data: {
    link: '',
    path: path
  },
})
const isCatalogTreeDialogShow = ref(false)
watch(isImportResourceDialogShow, (val) => {
  if (val === false) {
    formData.data.link = ''
  }
})
onMounted(() => {

})
const closePreviewDialog = () => {
  emit("closeImportResourceDialog")
}
const importResource = (formRef: FormInstance) => {
  if (!formRef) {
    return
  }
  formRef.validate(valid => {
    if (valid) {
      emit("importResourceConfirm", formData.data.link)
      emit("closeImportResourceDialog")
    }
  })
}
const changeSavePath = () => {
  isCatalogTreeDialogShow.value = true
}
const handleCloseCatalogTreeDialog = () => {
  isCatalogTreeDialogShow.value = false
}
const handleConfirmSavePath = (catalogId: string) => {
  catalogApi.getCatalogBreadCrumb(catalogId).then(res => {
    if (res.code === 200) {
      console.log(res.data)
      emit("changeCatalogBreadCrumb", res.data)
    }
  })
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
</style>