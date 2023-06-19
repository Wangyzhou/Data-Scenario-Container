<template>
  <div class="all">
    <div class="custom-tree-container">
      <div class="header">
        <div class="btnCon">
          <el-icon size="30" class="backBtn" title="收起图层列表" @click="closeToolPannel">
            <Back />
          </el-icon>
        </div>
        <div class="title">
          <span>工具箱</span>
        </div>
      </div>
      <el-divider style="margin-top: 0; margin-bottom: 0px;"></el-divider>
      <div class="layerEditCon">
        <el-button type="success" :icon="Link" circle title="图层分享" />
        <el-button type="primary" :icon="Upload" circle title="图层导出" />
        <el-button type="danger" :icon="Delete" circle title="图层删除" />
      </div>
      <el-divider style="margin-top: 0; margin-bottom: 0px;"></el-divider>
      <div class="treeCon">
        <!-- <el-divider border-style="hidden"></el-divider> -->
        <el-tree class="filter-tree" :data="toolLab" :props="defaultProps" default-expand-all
          @node-click="handleNodeSelect">
          <template #default="{ node, data }">
            <el-icon>
              <Tools />
            </el-icon>
            <el-divider direction="vertical" border-style="hidden"></el-divider>
            <span class="custom-tree-node">
              <span>{{ node.label }}</span>
            </span>
            <span class="info" :title="data.description">
              <el-icon>
                <InfoFilled />
              </el-icon>
            </span>
          </template>
        </el-tree>
      </div>
    </div>
  </div>
  <ShapeBufferDialog v-if="isShapeBufferToolDialogShow" @update:is-shape-buffer-dialog-show="closeShapeBufferDialog"
    :is-shape-buffer-dialog-show="isShapeBufferToolDialogShow" :tool="selectedTool"  @update:scene-layer-group="renderSceneLayerGroup"/>
</template>

<script setup lang="ts">
import { toRefs, ref, watch, onMounted, reactive } from 'vue'
import {
  Back,
  Delete,
  Upload,
  Link,
  Tools,
  InfoFilled
} from '@element-plus/icons-vue'
import { ElTree } from 'element-plus'
import ShapeBufferDialog from '~/components/tools/ShapeBufferDialog.vue'
interface Tree {
  id: string
  label: string,
  type: string,
  description: string,
  children?: Tree[]
}

const props = defineProps({
  menuWidth: {
    type: String,
    default: '65px'
  },
  toolLab: {
    type: Array<Tree>,
    default: () => []
  }
})
const filterText = ref('')
const isShapeBufferToolDialogShow = ref(false)
const treeRef = ref<InstanceType<typeof ElTree>>()
const selectedTool = reactive({} as any)
watch(filterText, (val: any) => {
  treeRef.value!.filter(val)
})
onMounted(() => {
  console.log(props.toolLab)
})
const emit = defineEmits(['closeToolPannel', 'render:sceneLayerGroup'])
const { menuWidth, toolLab } = toRefs(props)

const closeToolPannel = () => {
  emit('closeToolPannel')
}

const defaultProps = {
  children: 'children',
  label: 'label',
}

const handleNodeSelect = (data: Tree) => {
  selectedTool.id = data.id
  selectedTool.name = data.label
  console.log(selectedTool.value)
  isShapeBufferToolDialogShow.value = true
  console.log(data)
}
const closeShapeBufferDialog = () => {
  isShapeBufferToolDialogShow.value = false
}
const renderSceneLayerGroup = (layer: any) => {
  emit('render:sceneLayerGroup', layer)
}
</script>

<style scoped>
.all {
  display: flex;
  background-color: rgb(255, 255, 255);
  height: 90%;
  width: 300px;
  margin-left: v-bind(menuWidth);
  position: fixed;
  z-index: 999;
}

.custom-tree-container {
  width: 100%;
  height: 100%;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  padding-right: 8px;
  line-height: 20px;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.el-tree {
  background-color: rgb(255, 255, 255);
}

.a {
  color: blue
}

.header {
  height: 8%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: rgb(73, 70, 70);
  width: 100%;
  height: 100%;
  padding: 10px;
}

.btnCon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  padding: 10px;
}

.treeCon {
  padding: 20px;
}

.backBtn:hover {
  transform: scale(1.15);
  cursor: pointer;
}

.layerEditCon {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  /* width: 100%; */
  height: 5%;
  padding: 10px;
}

.info:hover {
  transform: scale(1.15);
  cursor: pointer;
}
</style>