<template>
  <div>
    <el-dialog v-model="isPdfPreviewDialogShow" width="40%" align-center @close="closePreviewDialog" destroy-on-close
      :show-close="false">
      <template #header="{ titleId, titleClass }">
        <div class="my-header">
          <div class="header-text">
            <h2 :id="titleId" :class="titleClass" style="font-size: 25px;">{{ dataName }}</h2>
          </div>
          <div class="header-button">
            <el-popconfirm width="220" confirm-button-text="OK" cancel-button-text="No, Thanks" :icon="InfoFilled"
              icon-color="#626AEF" title="Are you sure to delete this?" @confirm="confirmEvent" @cancel="cancelEvent">
              <template #reference>
                <el-button type="danger" size="large" text round>删除</el-button>
              </template>
            </el-popconfirm>
            <el-button type="primary" size="large" @click="shareResource" text round>分享</el-button>
          </div>
        </div>
      </template>
      <div class="all">
        <div class="pdf-preview">
          <div class="pdf-wrap">
            <vue-pdf-embed :source="state.source" :style="scale" class="vue-pdf-embed" :page="state.pageNum" />
          </div>
          <div class="page-tool">
            <div class="page-tool-item" @click="lastPage">上一页</div>
            <div class="page-tool-item" @click="nextPage">下一页</div>
            <div class="page-tool-item">{{ state.pageNum }}/{{ state.numPages }}</div>
            <div class="page-tool-item" @click="pageZoomOut">放大</div>
            <div class="page-tool-item" @click="pageZoomIn">缩小</div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="closePreviewDialog" size="large" text round>关闭</el-button>
      </template>
    </el-dialog>
  </div>
  <ShareResourceDialog :is-share-resource-dialog-show="isShareResourceDialogShow"
    @close-share-resource-dialog="handleCloseShareResourceDialog" :file-id="pdfId" file-type="pdf" />
</template>

<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue'
import { onMounted, toRefs, reactive, ref, computed } from 'vue'
import VuePdfEmbed from "vue-pdf-embed";
import { createLoadingTask } from "vue3-pdfjs/esm"; // 获得总页数
import pdfFileApi from '~/http/api/pdfFileApi';
import cryptoUtil from '~/utils/cryptoUtil'
import ShareResourceDialog from '~/components/ShareResourceDialog.vue'
const props = defineProps({
  isPdfPreviewDialogShow: {
    type: Boolean,
    default: false
  },
  dataName: {
    default: "No data has been selected!",
    type: String
  },
  pdfId: {
    default: '',
    type: String
  },
  pdfUrl: {
    default: '',
    type: String
  }
})


const emit = defineEmits(["closePdfPreviewDialog", "deletePdf"])
const { isPdfPreviewDialogShow, dataName, pdfId, pdfUrl } = toRefs(props)

const state = reactive({
  source: 'http://localhost:8998/pdffile/getPdfFile?fileId=' + pdfId.value, //预览pdf文件地址
  pageNum: 1, //当前页面
  scale: 1, // 缩放比例
  numPages: 0, // 总页数
});
const isShareResourceDialogShow = ref(false)
onMounted(async () => {
  const loadingTask = createLoadingTask(state.source);
  loadingTask.promise.then((pdf: { numPages: number }) => {
    state.numPages = pdf.numPages;
  });
  const encrypStr = cryptoUtil.Encrypt(JSON.stringify({
    fileId: "6437b43d5dce5005b93d2304",
    fileType: "pdf"
  }))

  console.log(encrypStr)
  console.log(JSON.parse(cryptoUtil.Decrypt(encrypStr)))
})
const scale = computed(() => `transform:scale(${state.scale})`)
function lastPage() {
  if (state.pageNum > 1) {
    state.pageNum -= 1;
  }
}
function nextPage() {
  if (state.pageNum < state.numPages) {
    state.pageNum += 1;
  }
}
function pageZoomOut() {
  if (state.scale < 2) {
    state.scale += 0.1;
  }
}
function pageZoomIn() {
  if (state.scale > 1) {
    state.scale -= 0.1;
  }
}

const closePreviewDialog = () => {
  emit("closePdfPreviewDialog")
}
const confirmEvent = () => {
  emit("closePdfPreviewDialog")
  emit("deletePdf")
}
const cancelEvent = () => {

}
const shareResource = () => {
  isShareResourceDialogShow.value = true
}
const handleCloseShareResourceDialog = () => {
  isShareResourceDialogShow.value = false
}
</script>

<style scoped>
:deep(.el-dialog) {
  border-radius: 20px;
}

.my-header {
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-top: 10px;
  font-size: 30px;
}

:deep(.el-dialog__body) {
  padding-top: 5px;
  padding-bottom: 0px;
}

:deep(.el-dialog__footer) {
  padding: 5px;
}

.titleClass {
  font-size: 30px;
  width: 200px;
}



.all {
  height: 770px;
  width: auto;
  display: flex;
  flex-wrap: nowrap;
  position: relative;
  box-sizing: border-box;
  border: 1 px solid;
  flex-direction: row;
  justify-content: center;
  padding-top: 5px;
}

.pdf-preview {
  position: relative;
  height: 100%;
  padding: 0;
  box-sizing: border-box;
  background-color: e9e9e9;
}

.pdf-wrap {
  overflow-y: auto;
}

.vue-pdf-embed {
  text-align: center;
  width: 515px;
  border: 1px solid #e5e5e5;
  margin: 0 auto;
  box-sizing: border-box;
}

.page-tool {
  position: absolute;
  bottom: 0px;
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  align-items: center;
  background: rgb(66, 66, 66);
  color: white;
  border-radius: 19px;
  z-index: 10;
  cursor: pointer;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 58%;
  opacity: 0.3;
  user-select: none;
}

.page-tool:hover {
  opacity: 1;
}

.page-tool-item {
  padding: 8px 15px;
  padding-left: 10px;
  cursor: pointer;
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
  justify-content: flex-end;
}
</style>