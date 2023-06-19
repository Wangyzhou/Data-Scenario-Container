<template>
  <div class="userdataCon">
    <el-divider border-style="hidden" style="margin-bottom: 20px; margin-top: 10px;" />
    <el-row class="btnRow">
      <div class="uploadBtnCon">
        <el-button type="primary" size="default" :icon="Plus" @click="addNewFolder" text bg round>新建文件夹</el-button>
        <el-button type="primary" size="default" :icon="Upload" @click="uploadFile" text bg round>上传文件</el-button>
        <el-button type="primary" size="default" :icon="Link" @click="importResource" text bg round>引入资源</el-button>
      </div>
      <el-input size="60" v-model="searchValue" placeholder="请输入文件名" class="input-with-select">
        <template #prepend>
          <el-button :icon="Search" />
        </template>
        <!-- <template #append>
          <el-select v-model="select" placeholder="Select" size="50" style="width: 100px">
            <el-option label="Restaurant" value="1" />
            <el-option label="Order No." value="2" />
            <el-option label="Tel" value="3" />
          </el-select><el-icon><Link /></el-icon>
        </template> -->
      </el-input>
    </el-row>
    <el-row class="fileRow">
      <div class="fileCon">
        <el-row class="naviCon">
          <el-icon size="30px" class="backBtn" @click="backCatalog">
            <Back />
          </el-icon>
          <el-divider direction="vertical" border-style="hidden" />
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="catalog in breadcrumbItemData.data" replace="true">
              <a @click="jumpCatalog(catalog)">
                {{ catalog.title }}
              </a>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </el-row>
        <el-scrollbar class="realFileRow">
          <template v-if="catalogList.data.length">
            <el-row :gutter="20" v-for="(row, rowIndex) in Math.floor(catalogList.data.length / 6) + 1">
              <el-col
                v-for="file in catalogList.data.filter((item, index) => index >= rowIndex * 6 && index < (rowIndex + 1) * 6)"
                :key="file.id" :span="4">
                <el-card :body-style="{ padding: '0px', height: '150px', width: '120px' }"
                  @click="clickFileInCatalog(file)" v-contextmenu:contextmenu @click.right="rightClickCard(file)">
                  <img :src="imageSrc(file.fileType)" style="width: 120px;" />
                  <div
                    style="padding: 0px; text-align: center; width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                    <span>{{ file.name }}</span>
                  </div>
                </el-card>
              </el-col>
              <el-divider border-style="hidden" style="margin-bottom: 5px; margin-top: 5px;" />
            </el-row>
          </template>
          <template v-else>
            <div class="noData">
              <span class="noDataFont">空文件夹</span>
            </div>
          </template>
        </el-scrollbar>
      </div>
    </el-row>
  </div>
  <!-- 新建文件夹对话框 -->
  <el-dialog v-model="addNewFolderDialog" title="新建文件夹" width="23%" v-if="addNewFolderDialog" align-center>
    <el-form ref="ruleFormRef" :model="formData.data" label-width="120px" label-position="right" :rules="rules">
      <el-form-item label="文件夹名称：" size="default" prop="name">
        <el-input v-model.trim="formData.data.name" placeholder="请输入文件夹名" />
      </el-form-item>
      <el-form-item>
        <el-divider border-style="hidden" style="margin-bottom: 5px; margin-top: 5px;" />
      </el-form-item>
      <el-form-item style="display: flex;">
        <el-button type="primary" size="default" @click="createNewFolder(ruleFormRef as FormInstance)">创建</el-button>
        <el-button type="primary" size="default" @click="addNewFolderDialog = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!-- 上传文件对话框 -->
  <el-dialog v-model="uploadFileDialog" title="上传文件" width="auto" destroy-on-close align-center>
    <el-form ref="uploadRuleFormRef" :model="uploadFormData.data" label-width="120px" label-position="right"
      :rules="uploadRules">
      <el-form-item label="文件模板：" size="default" prop="fileTemplate">
        <el-select v-model="uploadFormData.data.fileTemplate" @change="selectTemplateChange" placeholder="请选择文件模板">
          <el-option v-for="item in templateList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择文件：" size="default" prop="file">
        <el-upload ref="uploadRef" class="upload-demo" :auto-upload="false" :before-upload="beforeUpload"
          :on-change="handleUploadChange" :file-list="fileList.data" drag>
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
          <template #tip v-if="isSelectedShapefile">
            <div class="el-upload__tip">
              矢量文件请遵循ESRI Shapefile规范，并上传无嵌套文件夹的zip压缩包，单文件大小 ≤ 5GB
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="文件名称：" size="default" prop="fileName">
        <el-input v-model.trim="uploadFormData.data.fileName" placeholder="请输入文件夹名" />
      </el-form-item>
      <el-form-item label="空间参考：" size="default" prop="srid" v-if="isSelectedShapefile">
        <el-select v-model="uploadFormData.data.srid" disabled>
          <el-option v-for="item in sricList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="编码方式：" size="default" prop="code" v-if="isSelectedShapefile">
        <el-select v-model="uploadFormData.data.code" @change="selectCodeChange">
          <el-option v-for="item in codeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-divider border-style="hidden" style="margin-bottom: 5px; margin-top: 5px;" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default"
          @click="submitUploadFile(uploadRuleFormRef as FormInstance)">上传</el-button>
        <el-divider direction="vertical" border-style="hidden" />
        <el-divider direction="vertical" border-style="hidden" />
        <el-divider direction="vertical" border-style="hidden" />
        <el-button type="primary" size="default" @click="uploadFileDialog = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <template v-if="currentSelectedCard.data">
    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item v-if="currentSelectedCard.data.fileType == 'folder'"
        @click="clickFileInCatalog(currentSelectedCard.data)">
        <el-icon>
          <Folder />
        </el-icon>
        打开
      </v-contextmenu-item>
      <v-contextmenu-item v-else @click="previewData(currentSelectedCard.data.fileType)">
        <el-icon>
          <View />
        </el-icon>
        查看
      </v-contextmenu-item>
      <v-contextmenu-item :disabled="currentSelectedCard.data.fileType == 'folder' ? true : false" @click="downloadFile">
        <el-icon>
          <Download />
        </el-icon>
        下载
      </v-contextmenu-item>
      <v-contextmenu-item @click="deleteFileOrCatalog()">
        <el-icon>
          <Delete />
        </el-icon>
        删除
      </v-contextmenu-item>
    </v-contextmenu>
  </template>
  <div class="loading" v-if="loading">
    <h4 class="tips">{{ tips }}</h4>
    <!--进度条-->
    <el-progress type="circle" :percentage="percentage" class="progress" :show-text="true"></el-progress>
  </div>
  <PreviewDialog v-if="isPreviewDialogShow" :is-dialog-show="isPreviewDialogShow"
    :data-name="currentSelectedCard.data.name" :geo-id="currentSelectedCard.data.id"
    @close-preview-dialog="handleClosePreviewDialog" @delete-geo-data="deleteFileOrCatalog" />
  <PdfPreviewDialog v-if="isPdfPreviewDialogShow" :is-pdf-preview-dialog-show="isPdfPreviewDialogShow"
    :data-name="currentSelectedCard.data.name" :pdf-id="currentSelectedCard.data.id"
    @close-pdf-preview-dialog="handleClosePdfPreviewDialog" @delete-pdf="deleteFileOrCatalog" />
  <ImportResourceDialog v-if="isImportResourceDialogShow" :is-import-resource-dialog-show="isImportResourceDialogShow"
    @close-import-resource-dialog="handleCloseImportResourceDialog" :catalog-bread-crumb="breadcrumbItemData.data"
    @change-catalog-bread-crumb="handleChangeCatalogBreadCrumb" @import-resource-confirm="handleImportResourceConfirm" />
</template>

<script setup lang="ts">
import { watch, reactive, ref, onBeforeMount, computed } from 'vue'
import {
  Search,
  Plus,
  Upload,
  Back,
  Delete,
  View,
  Download,
  Folder,
  UploadFilled,
  Link
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadRawFile, UploadFile, FormInstance, FormRules, UploadInstance, UploadUserFile } from 'element-plus'
import catalogApi from '~/http/api/catalogApi'
import geoFileApi from '~/http/api/geoFileApi'
import pdfFileApi from '~/http/api/pdfFileApi'
import { useUserStore } from '~/store/user'
import { useCatalogStore } from '~/store/catalog'
import shpIcon from '/shp.png'
import folderIcon from '/folder.png'
import pdfIcon from '/pdf.png'
import PreviewDialog from '~/components/PreviewDialog.vue'
import PdfPreviewDialog from '~/components/PdfPreviewDialog.vue'
import ImportResourceDialog from '~/components/ImportResourceDialog.vue'
import { Session } from '~/cache'
import cryptoUtil from '~/utils/cryptoUtil'
interface BreadCrumbCatalog {
  id: number,
  title: string,
  catalogId: string
}
interface GetCatalogList {
  userId: string,
  catalogId: string
}
interface CatalogListData {
  id: string,
  name: string,
  fileType: string,
  dataType: string,
  date: string,
}
interface CreateCatalog {
  userId: string,
  parentCatalogId: string,
  catalogName: string
}
const userStore = useUserStore()
const catalogStore = useCatalogStore()
const searchValue = ref('')
let breadcrumbItemData = reactive({
  data: [] as BreadCrumbCatalog[]
})
const catalogList = reactive({
  data: [] as CatalogListData[]
})
const addNewFolderDialog = ref(false)
const uploadFileDialog = ref(false)
const isSelectedShapefile = ref(false)
const formData = reactive({
  data: {
    name: ''
  }
})
const uploadFormData = reactive({
  data: {
    file: null,
    fileName: '',
    fileTemplate: '',
    srid: '4326',
    code: 'UTF-8',
    discription: ''
  }
})
const uploadRef = ref<UploadInstance>()
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '文件夹名称不能为空！', trigger: 'blur' },
  ]
})
const fileList = reactive(
  {
    data: [] as UploadUserFile[]
  }
)
const imageSrc = (dataType: string) => {
  switch (dataType) {
    case 'folder':
      return folderIcon
    case 'shp':
      return shpIcon
    case 'pdf':
      return pdfIcon
  }
}
const validateUploadFile = (rule: any, value: any, callback: (errors?: Error) => void) => {
  if (fileList.data.length === 0) {
    callback(new Error('未添加文件！'));
  } else {
    callback();
  }
}
const uploadRules = reactive<FormRules>({
  file: [
    { validator: validateUploadFile, required: true, trigger: 'change' },
  ],
  fileTemplate: [
    { required: true, message: '文件模板不能为空！', trigger: 'blur' },
  ],
  fileName: [
    { required: true, message: '文件名称不能为空！', trigger: 'blur' },
  ],
  srid: [
    { required: true, message: '空间参考不能为空！', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '编码方式不能为空！', trigger: 'blur' },
  ]
})
const ruleFormRef = ref<FormInstance>()
const uploadRuleFormRef = ref<FormInstance>()
const currentSelectedCard = reactive({
  data: {} as CatalogListData
})
const sricList = reactive([
  {
    label: '4326(WGS-84坐标系)',
    value: '4326'
  }
])
const codeList = reactive([
  {
    label: 'UTF-8',
    value: 'UTF-8'
  },
  {
    label: 'LATIN1',
    value: 'LATIN1'
  }
])
const templateList = reactive([
  {
    label: 'ESRI Shapefile',
    value: 'Shapefile'
  },
  {
    label: 'PDF',
    value: 'PDF'
  },
  {
    label: 'CSV',
    value: 'CSV'
  },
])
const loading = ref(false)
const tips = ref("文件上传中...")
const percentage = ref(0)
const isPreviewDialogShow = ref(false)
const isPdfPreviewDialogShow = ref(false)
const isImportResourceDialogShow = ref(false)
watch(uploadFileDialog, (newV, oldV) => {
  if (newV === false) {
    isSelectedShapefile.value = false
    fileList.data = []
    uploadFormData.data = {
      file: null,
      fileName: '',
      fileTemplate: '',
      srid: '4326',
      code: 'UTF-8',
      discription: ''
    }
    console.log("对话框初始化！")
  }
})
watch(breadcrumbItemData, (newVal, oldVal) => {
  // console.log(newVal.data[newVal.data.length - 1].catalogId)
  catalogStore.setBreadCrumb(newVal.data)
  if (Session.get('breadcrumb')) {
    Session.remove('breadcrumb')
  }
  Session.set('breadcrumb', catalogStore.breadcrumb)
})
onBeforeMount(() => {
  if (catalogStore.currentCatalogId === '' && catalogStore.rootCatalog === null) {
    catalogApi.getRootCatalog({ parentId: '-1', userId: userStore.loginUser.id }).then(res => {
      catalogStore.setRootCatalog(res.data)
      catalogStore.updateCurrentCatalogId(res.data.id)
      breadcrumbItemData.data.push({
        id: 0,
        title: res.data.name,
        catalogId: res.data.id
      })
      Session.set('rootCatalog', catalogStore.rootCatalog)
      Session.set('currentCatalogId', catalogStore.currentCatalogId)
      flushCatalogList()
    })
  } else {
    breadcrumbItemData.data = catalogStore.breadcrumb
    flushCatalogList()
  }
})
const selectCodeChange = (val: any) => {
  console.log(val)
  uploadFormData.data.code = val
}
const flushCatalogList = () => {
  catalogApi.getCatalogList({ userId: userStore.loginUser.id, catalogId: catalogStore.currentCatalogId } as GetCatalogList).then(listRes => {
    console.log(listRes.data)
    catalogList.data = new Array() as CatalogListData[]
    listRes.data.forEach((file: any) => {
      catalogList.data.push(file)
    });
  })
}


const jumpCatalog = (catalog: BreadCrumbCatalog) => {
  catalogStore.updateCurrentCatalogId(catalog.catalogId)
  Session.remove('currentCatalogId')
  Session.set('currentCatalogId', catalogStore.currentCatalogId)
  popBreadCrumbItem(catalog.id)
  flushCatalogList()
}

const popBreadCrumbItem = (id: number) => {
  breadcrumbItemData.data = breadcrumbItemData.data.filter(item => item.id <= id)
  console.log(breadcrumbItemData.data)
}

const clickFileInCatalog = (file: CatalogListData) => {

  currentSelectedCard.data = file
  //1、判断file.type, shp or folder

  //2、发送请求，查看文件信息或进入文件夹api

  //3、弹出文件信息窗口或更新catalogList.data

  //4、是否更新breadcrumbItemData.data

  switch (file.fileType) {
    case 'folder':
      catalogStore.updateCurrentCatalogId(file.id)
      Session.remove('currentCatalogId')
      Session.set('currentCatalogId', catalogStore.currentCatalogId)
      catalogList.data = new Array() as CatalogListData[]
      breadcrumbItemData.data.push({
        id: breadcrumbItemData.data.length,
        title: file.name,
        catalogId: file.id
      })
      flushCatalogList()
      break;
    default:
      previewData(file.fileType)
      break;
  }
}
const backCatalog = () => {
  // console.log(breadcrumbItemData.data[breadcrumbItemData.data.length - 1].id)
  const index = breadcrumbItemData.data.length - 1
  catalogStore.updateCurrentCatalogId(breadcrumbItemData.data[index - 1].catalogId)
  Session.remove('currentCatalogId')
  Session.set('currentCatalogId', catalogStore.currentCatalogId)
  popBreadCrumbItem(breadcrumbItemData.data[index].id)
  jumpCatalog(breadcrumbItemData.data[index - 1])
}

const addNewFolder = () => {
  addNewFolderDialog.value = true
  formData.data.name = ''
}

const createNewFolder = (formEl: FormInstance | undefined) => {
  console.log(111)
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log(formData.data)
      catalogApi.createNewCatalog({ userId: userStore.loginUser.id, parentCatalogId: breadcrumbItemData.data[breadcrumbItemData.data.length - 1].catalogId, catalogName: formData.data.name } as CreateCatalog).then(res => {
        if (res.code == 200) {
          flushCatalogList()
          ElMessage({
            type: 'success',
            message: '新建文件夹成功！'
          })
        }
      })
      addNewFolderDialog.value = false
    } else {
      console.log('error submit!')
      return false
    }
  })
}
const rightClickCard = (file: CatalogListData) => {
  // console.log(file)
  currentSelectedCard.data = file
  // console.log(currentSelectedCard.data)
}
const deleteFileOrCatalog = () => {
  switch (currentSelectedCard.data.fileType) {
    case 'folder':
      catalogApi.deleteCatalog({ userId: userStore.loginUser.id, parentId: currentSelectedCard.data.id }).then(res => {
        if (res.code == 200) {
          flushCatalogList()
          ElMessage({
            type: 'success',
            message: '删除文件夹成功！'
          })
        }
      })
      break;
    case 'shp':
      geoFileApi.deleteShp({ userId: userStore.loginUser.id, catalogId: breadcrumbItemData.data[breadcrumbItemData.data.length - 1].catalogId, fileId: currentSelectedCard.data.id }).then(res => {
        if (res.code == 200) {
          flushCatalogList()
          ElMessage({
            type: 'success',
            message: '删除文件成功！'
          })
        }
      })
      break;
    case 'pdf':
      pdfFileApi.deletePdf({
        id: currentSelectedCard.data.id,
        userId: userStore.loginUser.id,
        catalogId: breadcrumbItemData.data[breadcrumbItemData.data.length - 1].catalogId
      }).then(res => {
        if (res.code == 200) {
          flushCatalogList()
          ElMessage({
            type: 'success',
            message: '删除文件成功！'
          })
        }
      })
      break;
  }
}
const uploadFile = () => {
  uploadFileDialog.value = true
  // uploadFormData.data.fileName = ''
}
const submitUploadFile = (formEl: FormInstance) => {
  if (!formEl) return
  formEl.validate(valid => {
    if (valid) {
      uploadFileDialog.value = false
      loading.value = true
      uploadRef.value!.submit()
    }
  })
}
const beforeUpload = (rawFile: UploadRawFile) => {
  console.log(rawFile)
  let formData = new FormData()
  let config = {
    onUploadProgress: (progressEvent: ProgressEvent) => {
      let complete = parseFloat((progressEvent.loaded / progressEvent.total).toFixed(2)) * 100;
      percentage.value = complete
    },
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  switch (uploadFormData.data.fileTemplate) {
    case 'Shapefile':
      formData.append('file', rawFile)
      formData.append('fileName', uploadFormData.data.fileName)
      formData.append('srid', uploadFormData.data.srid)
      formData.append('code', uploadFormData.data.code)
      formData.append('userId', userStore.loginUser.id)
      formData.append('catalogId', breadcrumbItemData.data[breadcrumbItemData.data.length - 1].catalogId)
      geoFileApi.uploadShp(formData, config).then(res => {
        console.log(res)
        if (res.code == 200) {
          ElMessage({
            type: 'success',
            message: '文件上传成功！'
          })
        } else {
          ElMessage({
            type: 'error',
            message: res.msg
          })
        }
        loading.value = false
        percentage.value = 0
        flushCatalogList()
      })
      break;
    case 'PDF':
      formData.append('file', rawFile)
      formData.append('fileName', uploadFormData.data.fileName)
      formData.append('userId', userStore.loginUser.id)
      formData.append('catalogId', breadcrumbItemData.data[breadcrumbItemData.data.length - 1].catalogId)
      pdfFileApi.uploadPdf(formData, config).then(res => {
        console.log(res)
        if (res.code == 200) {
          ElMessage({
            type: 'success',
            message: '文件上传成功！'
          })
        } else {
          ElMessage({
            type: 'error',
            message: res.msg
          })
        }
        loading.value = false
        percentage.value = 0
        flushCatalogList()
      })
      break;
    case 'CSV':

      break;
    default:
      break;
  }


}
const handleUploadChange = (rawFile: UploadFile, uploadFileList: UploadUserFile[]) => {
  fileList.data = uploadFileList
  uploadFormData.data.fileName = rawFile.name.substring(0, rawFile.name.lastIndexOf("."))
}

const downloadFile = () => {
  switch (currentSelectedCard.data.fileType) {
    case 'shp':
      geoFileApi.downloadFile(currentSelectedCard.data.id).then(res => {
        console.log(res)
      })
      break;
    case 'pdf':
      pdfFileApi.downloadFile(currentSelectedCard.data.id).then(res => {
        console.log(res)
      })
  }

}
const previewData = (fileType: any) => {
  switch (fileType) {
    case 'shp':
      isPreviewDialogShow.value = true
      break;
    case 'pdf':
      isPdfPreviewDialogShow.value = true
      break;
  }
}
const handleClosePreviewDialog = () => {
  isPreviewDialogShow.value = false
  console.log(isPreviewDialogShow.value)
}
const handleClosePdfPreviewDialog = () => {
  isPdfPreviewDialogShow.value = false
}
const selectTemplateChange = (val: any) => {
  if (val === 'Shapefile') {
    isSelectedShapefile.value = true
  } else {
    isSelectedShapefile.value = false
  }
  uploadFormData.data.fileTemplate = val
}
const importResource = () => {
  isImportResourceDialogShow.value = true
  console.log(isImportResourceDialogShow.value)
}
const handleCloseImportResourceDialog = () => {
  isImportResourceDialogShow.value = false
}
const handleChangeCatalogBreadCrumb = (catalogBreadCrumb: any) => {
  breadcrumbItemData.data = catalogBreadCrumb
  catalogStore.updateCurrentCatalogId(breadcrumbItemData.data[breadcrumbItemData.data.length - 1].catalogId)
  flushCatalogList()
  console.log(catalogBreadCrumb)
}
const handleImportResourceConfirm = (resourceLink: any) => {
  const linkObj = JSON.parse(cryptoUtil.Decrypt(resourceLink))
  switch (linkObj.fileType) {
    case 'pdf':
      console.log(catalogStore.currentCatalogId)
      pdfFileApi.importPdfResource({ id: linkObj.fileId, userId: userStore.loginUser.id, catalogId: catalogStore.currentCatalogId }).then(res => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: res.msg
          })
          flushCatalogList()
        }
      })
      break;
    case 'shp':
      geoFileApi.importShpResource({ fileId: linkObj.fileId, userId: userStore.loginUser.id, catalogId: catalogStore.currentCatalogId }).then(res => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: res.msg
          })
          flushCatalogList()
        }
      })
      break;
  }
  console.log(linkObj)
}
</script>

<style scoped>
.userdataCon {
  /* background-color: aqua; */
  height: 100%;
}

.backBtn:hover {
  transform: scale(1.1);
  cursor: pointer;
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

.btnRow {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.input-with-select {
  width: 300px;
}

.fileRow {
  height: 600px;
  width: 100%;
  margin-top: 30px;
  padding-top: 10px;
  border-style: outset;
  /* background-color: aqua; */
}

.fileCon {
  height: 100%;
  width: 100%;
}

.fileRealCon {
  width: 100%;
}

.realFileRow {
  height: 85%;
  padding: 30px;
  /* background-color: antiquewhite; */
}

.el-card {
  display: flex;
  justify-content: center;
  align-content: space-around;
}

:deep(.el-card__body) {
  padding: var(--el-card-padding);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

:deep(.el-card:hover) {
  background-color: rgba(69, 137, 240, 0.3);
  border-color: rgba(7, 57, 196, 0.781);
  cursor: pointer;
  transform: scale(0.95);
}

.naviCon {
  display: flex;
  align-items: center;
  height: 7%;
  padding-left: 20px;
}

.noData {
  width: 120px;
  height: 120px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  display: flex;
  /* 有了这个就自动居中了 */
  /* 50%为自身尺寸的一半 */

}

.noDataFont {
  font-size: 30px;
  font-style: italic;
  color: rgba(85, 84, 84, 0.7);
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

#right-click-menu {
  background: #FAFAFA;
  border: 1px solid #BDBDBD;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);
  display: block;
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  width: 250px;
  z-index: 999999;
}

#right-click-menu li {
  border-bottom: 1px solid #E0E0E0;
  margin: 0;
  padding: 5px 35px;
}

#right-click-menu li:last-child {
  border-bottom: none;
}

#right-click-menu li:hover {
  background: #1E88E5;
  color: #FAFAFA;
}

.v-contextmenu-item:hover {
  background-color: rgb(56, 91, 204);
}

.v-contextmenu-item {
  width: 60px;
  text-align: center;
  font-size: 15px;
}

.upload-demo {
  height: auto;
}

.loading {
  background: rgba(128, 128, 128, 0.5);
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  /* display: none; */
  z-index: 20;
  /* filter: alpha(opacity=60); */
  /* opacity: 0.5; */
}

.tips {
  color: #0b70d4;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -80px;
  margin-top: -150px;
  opacity: 1;
}

.progress {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -100px;
  margin-top: -100px;
}
</style>