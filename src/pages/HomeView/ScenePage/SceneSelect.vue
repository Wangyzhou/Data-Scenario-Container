<template>
  <div class="mainCon">
    <el-row style="width: 100%;margin:0; padding-left: 400px;padding-right: 400px;padding-top: 200px;" :gutter="20">
      <el-col v-for="typeItem in sceneTypes" :key="typeItem.id" :span="6">
        <el-card :body-style="{ padding: '0px' }" @click="selectScene(typeItem)">
          <div class="imgCon">
            <img :src="typeItem.imgSrc" class="image" fit="fill" />
          </div>
          <div style="padding: 14px; text-align: center; font-weight: 600; font-size: 18px;">
            <span>{{ typeItem.label }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import analysisIcon from '/analysis.png'
import serveVisualizationIcon from '/serve-visualization.png'
import codeVisualizationIcon from '/code-visualization.png'
import tagIcon from '/tag.png'
import { usePublicStore } from '~/store/publicStore'

const publicStore = usePublicStore()
const sceneTypes = reactive([
  {
    id: 0,
    imgSrc: analysisIcon,
    label: '数据分析场景',
    value: 'analysis'
  },
  {
    id: 1,
    imgSrc: serveVisualizationIcon,
    label: '服务式数据可视场景',
    value: 'visualization_service'
  },
  {
    id: 2,
    imgSrc: codeVisualizationIcon,
    label: '编码式数据可视场景',
    value: 'visualization_code'
  },
  {
    id: 3,
    imgSrc: tagIcon,
    label: '数据标注场景',
    value: 'tag'
  }
])

const selectScene = (typeItem: any) => {
  publicStore.createSceneObj.type = typeItem.value
  publicStore.setCreateSceneCurrentStep(1)
  // active.value = 1
}
</script>

<style scoped>
.el-card.is-always-shadow {
  box-shadow: var(--el-box-shadow-light);
  width: 200px;
}

.image {
  width: 100%;
  display: block;
  height: 170px;
}

.imgCon {
  padding: 10px;
}

.el-card:hover {
  cursor: pointer;
  transform: scale(1.1);
  background-color: rgba(69, 137, 240, 0.3);
  border-color: rgba(7, 57, 196, 0.781);
}
</style>