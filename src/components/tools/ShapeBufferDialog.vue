<template>
  <el-dialog v-model="isShapeBufferDialogShow" title="缓冲区工具" width="30%" center destroy-on-close @close="handleClose">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" :size="formSize"
      status-icon>
      <el-form-item label="选择数据：" prop="layer">
        <el-select v-model="ruleForm.layer.name" placeholder="请选择图层" @change="handleLayerChange">
          <el-option v-for="layer in layerSelectList" :label="layer.name" :value="layer" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择字段：" prop="field">
        <el-select v-model="ruleForm.field" placeholder="未设置(非必要选项)" @change="handleFieldChange">
          <el-option v-for="field in layerFields" :label="field" :value="field" />
        </el-select>
      </el-form-item>
      <el-form-item label="缓冲距离：" prop="distance">
        <el-input v-model="ruleForm.distance" placeholder="单位: km" />
      </el-form-item>
      <el-form-item label="是否融合：" prop="disolved">
        <el-radio-group v-model="ruleForm.disolved">
          <el-radio label="是" />
          <el-radio label="否" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="距离比例：" prop="scale">
        <el-input v-model="ruleForm.scale" />
      </el-form-item>
      <el-form-item label="缓冲区数量：" prop="zonesNum">
        <el-input v-model="ruleForm.zonesNum" />
      </el-form-item>
      <el-form-item label="弧顶距离：" prop="arcVertexDistance">
        <el-input v-model="ruleForm.arcVertexDistance" />
      </el-form-item>
      <el-form-item label="输出路径：" size="default" prop="outputPath">
        <el-input v-model.trim="ruleForm.outputPath" :readonly="true">
          <template #append>
            <el-button type="primary" size="default" text @click="changeSavePath">更改</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          调用
        </el-button>
        <el-divider direction="vertical" border-style="hidden"></el-divider>
        <el-divider direction="vertical" border-style="hidden"></el-divider>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        <el-divider direction="vertical" border-style="hidden"></el-divider>
        <el-divider direction="vertical" border-style="hidden"></el-divider>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <CatalogTree :is-catalog-tree-dialog-show="isCatalogTreeDialogShow"
    @close-catalog-tree-dialog="isCatalogTreeDialogShow = false" @confirm-save-path="handleConfirmSavaPath" />
  <div class="loading" v-if="loading">
    <h4 class="tips">{{ tips }}</h4>
    <!--进度条-->
    <el-progress type="circle" :percentage="percentage" class="progress" :show-text="true"></el-progress>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useSceneStore } from '~/store/scene'
import geoFileApi from '~/http/api/geoFileApi'
import { useCatalogStore } from '~/store/catalog'
import CatalogTree from '~/components/CatalogTree.vue'
import catalogApi from '~/http/api/catalogApi'
import { useUserStore } from '~/store/user'
import toolApi from '~/http/api/toolApi'

interface SeletLayer {
  id: string,
  name: string
}
interface InvokeToolParam {
  toolId: string,
  toolName: string,
  toolConfig: {
    layerId: string,
    field: string,
    distance: number,
    disolved: boolean,
    scale: number,
    zonesNum: number,
    arcVertexDistance: number,
    outputPath: string
  }
}
const props = defineProps({
  isShapeBufferDialogShow: {
    type: Boolean,
    default: false
  },
  tool: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['update:isShapeBufferDialogShow', 'update:sceneLayerGroup'])
const sceneStore = useSceneStore()
const catalogStore = useCatalogStore()
const userStore = useUserStore()
const { isShapeBufferDialogShow, tool } = toRefs(props)
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const isCatalogTreeDialogShow = ref(false)
const layerSelectList = ref([] as SeletLayer[])
const layerFields = ref([] as any)
const loading = ref(false)
const percentage = ref(0)
const tips = ref("缓冲区分析执行中...")
const path = computed(() => {
  let pathStr = ''
  catalogStore.breadcrumb.forEach((catalog: any) => {
    pathStr = pathStr + catalog.title + ' / '
  })
  return pathStr
})
const ruleForm = reactive({
  layer: { id: '', name: '' },
  field: '',
  distance: 0.2,
  disolved: '否',
  scale: 1,
  zonesNum: 1,
  arcVertexDistance: 5,
  outputPath: path
})
onMounted(() => {
  sceneStore.currentSceneConfig.sceneLayerGroup.forEach((layer: any) => {
    layerSelectList.value.push({
      id: layer.id,
      name: layer.layerName
    })
  })
  console.log(layerSelectList.value)
})
const validatePass = (rule: any, value: any, callback: any) => {
  console.log(value)
  if (value.name === '') {
    callback(new Error('未选择图层！'))
  }
  callback()
}

const rules = reactive<FormRules>({
  layer: [
    { validator: validatePass, required: true, trigger: 'change' }
  ],
  field: [
    {
      required: false,
    },
  ],
  distance: [
    {
      required: true,
      message: '未设置缓冲距离',
      trigger: 'blur',
    },
  ],
  disolved: [
    {
      required: true,
      trigger: 'change',
    },
  ],
  scale: [
    {
      required: true,
      message: '未设置缓冲距离尺度',
      trigger: 'blur',
    },
  ],
  zonesNum: [
    {
      required: true,
      message: '未设置缓冲区数量',
      trigger: 'blur',
    },
  ],
  arcVertexDistance: [
    {
      required: true,
      message: '未设置弧顶距离',
      trigger: 'blur',
    },
  ],
  outputPath: [
    {
      required: true,
      trigger: 'blur',
    }
  ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  // const bufferData = new FormData()
  await formEl.validate((valid, fields) => {
    if (valid) {
      const invokeParams = {} as InvokeToolParam
      isShapeBufferDialogShow.value = false
      loading.value = true

      console.log(tool.value)
      invokeParams.toolId = tool.value.id
      invokeParams.toolName = tool.value.name
      invokeParams.toolConfig = {
        layerId: ruleForm.layer.id,
        field: ruleForm.field === '' ? 'null' : ruleForm.field,
        distance: ruleForm.distance,
        disolved: ruleForm.disolved === '是' ? true : false,
        scale: ruleForm.scale,
        zonesNum: ruleForm.zonesNum,
        arcVertexDistance: ruleForm.arcVertexDistance,
        outputPath: catalogStore.currentCatalogId
      }
      // bufferData.append('toolId', tool.value.id)
      // bufferData.append('toolName', tool.value.name)
      // bufferData.append('toolConfig', JSON.stringify({
      //   layerId: ruleForm.layer.id,
      //   field: ruleForm.field,
      //   distance: ruleForm.distance,
      //   disolved: ruleForm.disolved === '是' ? true : false,
      //   scale: ruleForm.scale,
      //   zonesNum: ruleForm.zonesNum,
      //   arcVertexDistance: ruleForm.arcVertexDistance,
      //   outputPath: catalogStore.currentCatalogId
      // }))
      // console.log(bufferData.get('outputPath'))
      // console.log(bufferData.get('toolConfig'))
      const intervalId = setInterval(() => {
        let plus = Math.random() * 40
        if (percentage.value + plus >= 100) {
          clearInterval(intervalId)
          return
        }
        percentage.value += parseFloat(plus.toFixed(2))
      }, 500)
      toolApi.invokeTool(invokeParams).then(res => {
        if (res.code === 200) {
          clearInterval(intervalId)
          percentage.value = 100
          loading.value = false
          ElMessage.success('缓冲区分析执行成功')
          emit('update:isShapeBufferDialogShow', false)
          
          UpdateSceneLayers(res.data)
        }
      }).catch(err => {
        loading.value = false
        ElMessage.error(err + '缓冲区分析执行失败')
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const options = Array.from({ length: 10000 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}))
const handleClose = () => {
  emit('update:isShapeBufferDialogShow', false)
}
const handleLayerChange = (val: any) => {
  // console.log(val)
  ruleForm.layer = { id: val.id, name: val.name }
  geoFileApi.getFields(val.id).then(res => {
    layerFields.value = res.data
  })
}
const handleFieldChange = (val: any) => {
  ruleForm.field = val
}
const changeSavePath = () => {
  isCatalogTreeDialogShow.value = true
}
const handleConfirmSavaPath = (catalogId: string) => {
  catalogStore.updateCurrentCatalogId(catalogId)
  catalogApi.getCatalogBreadCrumb(catalogId).then(res => {
    if (res.code === 200) {
      console.log(res.data)
      catalogStore.setBreadCrumb(res.data)
    }
  })
}
const UpdateSceneLayers = (layer: any) => {
  // sceneStore.currentSceneConfig.sceneLayerGroup.push(layer)
  emit('update:sceneLayerGroup', layer)
}
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}

.loading {
  background: rgba(128, 128, 128, 0.5);
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  /* display: none; */
  z-index: 99999;
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
  margin-left: -80px;
  margin-top: -100px;
}
</style>
