<template>
  <div>
    <el-dialog v-model="isDialogShow" width="70%" align-center @close="closePreviewDialog" destroy-on-close
      :show-close="false">
      <!-- <span>Open the dialog from the center from the screen</span> -->

      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">
          <h2 :id="titleId" :class="titleClass" style="font-size: 25px;">{{ dataName }}</h2>
          <div>
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
      <el-divider style="margin-bottom: 10px; margin-top: 0px;" />
      <el-row class="all">
        <el-col :span="8">
          <el-row style="height: 40%; padding: 0px;">
            <div id="mapContainer"></div>
          </el-row>
          <el-divider style="margin-bottom: 20px; margin-top: 10px;" />

          <el-row style="height: 60%;">
            <el-descriptions v-loading="isloading" element-loading-text="正在加载数据信息..." class="margin-top"
              title="数据信息(ReadOnly)" size="large" :column="1" border>
              <el-descriptions-item align="center">
                <template #label>
                  <div class="cell-item">
                    <!-- <el-icon :style="iconStyle">
                      <user />
                    </el-icon> -->
                    数据名称
                  </div>
                </template>
                {{ preview.data.name }}
              </el-descriptions-item>
              <el-descriptions-item align="center">
                <template #label>
                  <div class="cell-item">
                    <!-- <el-icon :style="iconStyle">
                      <user />
                    </el-icon> -->
                    数据类型
                  </div>
                </template>
                {{ preview.data.type }}
              </el-descriptions-item>
              <el-descriptions-item align="center">
                <template #label>
                  <div class="cell-item">
                    <!-- <el-icon :style="iconStyle">
                      <user />
                    </el-icon> -->
                    空间参考
                  </div>
                </template>
                {{ preview.data.srid }}
              </el-descriptions-item>
              <el-descriptions-item align="center">
                <template #label>
                  <div class="cell-item">
                    <!-- <el-icon :style="iconStyle">
                      <user />
                    </el-icon> -->
                    字符集编码
                  </div>
                </template>
                {{ preview.data.code }}
              </el-descriptions-item>
              <el-descriptions-item align="center">
                <template #label>
                  <div class="cell-item">
                    <!-- <el-icon :style="iconStyle">
                      <user />
                    </el-icon> -->
                    上传时间
                  </div>
                </template>
                {{ preview.data.date }}
              </el-descriptions-item>
              <el-descriptions-item align="center">
                <template #label>
                  <div class="cell-item">
                    <!-- <el-icon :style="iconStyle">
                      <user />
                    </el-icon> -->
                    数据大小
                  </div>
                </template>
                {{ (preview.data.size / 1048576).toFixed(2) }} MB
              </el-descriptions-item>
              <el-descriptions-item align="center">
                <template #label>
                  <div class="cell-item">
                    <!-- <el-icon :style="iconStyle">
                      <user />
                    </el-icon> -->
                    下载量
                  </div>
                </template>
                {{ preview.data.downloadNum }}
              </el-descriptions-item>
            </el-descriptions>
          </el-row>
        </el-col>
        <el-divider direction="vertical" />
        <el-col :span="16">
          <div class="rightCon">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">

              <el-tab-pane label="描述" name="description">

              </el-tab-pane>
              <el-tab-pane label="要素" name="features">
                <el-divider border-style="hidden" style="margin-bottom: 0px; margin-top: 10px;" />
                <div class="tableCon" v-loading="isTableloading" element-loading-text="正在加载要素...">
                  <el-auto-resizer>
                    <template #default="{ height, width }">
                      <el-table-v2 :columns="title" :data="features.data" :width="width" :height="height" fixed />
                    </template>
                  </el-auto-resizer>
                </div>
              </el-tab-pane>
              <el-tab-pane label="元数据" name="metadata">
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
      </el-row>
      <template #footer>
        <el-button type="primary" @click="closePreviewDialog" size="large" text round>关闭</el-button>
      </template>
    </el-dialog>
  </div>
  <ShareResourceDialog :is-share-resource-dialog-show="isShareResourceDialogShow"
    @close-share-resource-dialog="handleCloseShareResourceDialog" :file-id="geoId" file-type="shp" />
</template>

<script setup lang="ts">
import { toRefs, ref, onMounted, reactive, nextTick } from 'vue';
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import geoFileApi from '~/http/api/geoFileApi'
import { AppOptions } from '~/config/index'
import { InfoFilled } from '@element-plus/icons-vue'
import layerStyleProperties from '~/assets/style/layerStyleProperties'
import 'element-plus/theme-chalk/el-loading.css'
import ShareResourceDialog from '~/components/ShareResourceDialog.vue'

mapboxgl.accessToken = 'pk.eyJ1IjoibmluamFhIiwiYSI6ImNsYXYzd3JwaDAyMGwzdm44ZmI3M212eHQifQ.h_dGMMOvQXNfmheNd0_j8A';
type PreviewData = {
  id: string,
  name: string,
  type: string,
  size: number,
  srid: number,
  code: string,
  date: string,
  description?: string,
  downloadNum: number,
  bbox: Array<number>,
  ptName: string
}

const props = defineProps({
  isDialogShow: {
    default: false,
    type: Boolean
  },
  dataName: {
    default: "No data has been selected!",
    type: String
  },
  geoId: {
    default: '',
    type: String
  }
})
const emits = defineEmits(["closePreviewDialog", "deleteGeoData"])
const { isDialogShow, dataName, geoId } = toRefs(props)
const scene = reactive({
  map: null as any
})
const activeName = ref('features')
const preview = reactive({
  data: {} as PreviewData
})
const isloading = ref(true)
const isTableloading = ref(true)
const isShareResourceDialogShow = ref(false)
const features = reactive({
  data: [] as any
})
const title = ref([] as any)
onMounted(() => {
  // console.log(document.getElementById("mapContainer"))
  nextTick(async () => {
    await initMap()
    preview.data = await requestPreviewData() as PreviewData
    isloading.value = false
    const loadLayerResult = await previewDataInMap()
    // console.log(loadLayerResult)
    geoFileApi.getShpFeatures(preview.data.ptName).then(res => {
      if (res.code === 200) {
        features.data = res.data
        for (const keyV in res.data[0]) {
          title.value.push({
            key: keyV,
            dataKey: keyV,
            title: keyV,
            width: 120
          })
        }
        isTableloading.value = false
      }
    })
  })
})

const initMap = () => {
  return new Promise(resolve => {
    scene.map = new mapboxgl.Map({
      container: 'mapContainer', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [116.4, 39.9], // starting position [lng, lat]
      zoom: 8 // starting zoom
    })
    scene.map.addControl(new MapboxLanguage({
      defaultLanguage: 'zh-Hans'
    }));
    scene.map.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      })
    );
    // 添加比例尺
    let scale = new mapboxgl.ScaleControl({
      maxWidth: 120,
    });
    scene.map.addControl(scale)
    scale.setUnit("metric");


    // 添加全局缩放
    scene.map.addControl(new mapboxgl.FullscreenControl());

    //添加定位控件
    scene.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );
    scene.map.on('load', () => {
      console.log("地图初始化完毕")
      resolve(true)
    })
  })
}
const requestPreviewData = () => {
  return new Promise((resolve, reject) => {
    geoFileApi.getGeoPreview(geoId.value).then(res => {
      // console.log(res)
      if (res.code === 200) {
        resolve(res.data)
      } else {
        reject(res.msg)
      }
    })
  })
}
const closePreviewDialog = () => {
  emits("closePreviewDialog")
}

const handleClick = () => {

}
const previewDataInMap = () => {
  return new Promise(resolve => {
    // console.log(getPaintType())
    let geoType = getPaintType() as string
    let paint_new = JSON.parse(JSON.stringify(layerStyleProperties[geoType].paint));
    // console.log(paint_new)
    delete paint_new[`${geoType}-pattern`];
    let source_id = 'preview_source_' + geoId.value
    let source_url = AppOptions.backend_ip + "/mvt/" + preview.data.ptName + "/{z}/{x}/{y}.pbf"
    scene.map.addSource(source_id, {
      "type": "vector",
      "tiles": [source_url,]
    })
    // console.log(scene.map.getSource("preview_source_" + geoId.value))
    let layerOption = {
      id: "preview_layer_" + geoId.value,
      type: geoType,
      layout: JSON.parse(
        JSON.stringify(layerStyleProperties[geoType].layout)
      ), //防止同类型图层样式改变间影响
      // filter: ["all"],
      source: source_id,
      "source-layer": preview.data.ptName,     //source-layer要和pg中的表名对应
      paint: paint_new
    }
    if (geoType !== "symbol") {
      layerOption.paint[geoType + "-color"] =
        "#" + Math.random().toString(16).substr(2, 6);
    }
    // console.log(layerOption)
    scene.map.addLayer(layerOption)
    scene.map.fitBounds(preview.data.bbox, {
      padding: { top: 10, bottom: 25, left: 15, right: 5 },
    });
    resolve("资源加载完毕")
  })
}

const getPaintType = () => {
  if (preview.data.type === "POINT") {
    return 'circle'
  } else if (preview.data.type === 'MULTILINESTRING') {
    return 'line'
  } else if (preview.data.type === 'MULTIPOLYGON') {
    return 'fill'
  }
}
const confirmEvent = () => {
  emits("closePreviewDialog")
  emits("deleteGeoData")
  // console.log('confirm!')
}
const cancelEvent = () => {
  // console.log('cancel!')
}
const shareResource = () => {
  isShareResourceDialogShow.value = true
}
const handleCloseShareResourceDialog = () => {
  isShareResourceDialogShow.value = false
}
</script>

<style scoped>
#mapContainer {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  border: 1 px solid black;
  border-radius: 10px;

}

.all {
  height: 700px;
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

:deep(.el-dialog) {
  border-radius: 20px;
}

.rightCon {
  width: 98%;
  height: 90%;
  padding-left: 20px;
  /* background-color: aqua; */
}

.el-tab-paneCon {
  width: 100%;
  height: 100%;
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
}

:deep(.el-descriptions) {
  width: 100%;
}

.el-divider--vertical {
  height: 100%;
  margin-left: 10px;
}

.bigDataTips {
  /* background-color: aqua; */
  height: 400px;
  width: 600px;
  font-size: 20px;
  text-align: center;
  font-weight: 600;
  margin-top: 100px;
  margin-left: 100px;
}

.tableCon {
  width: 100%;
  height: 600px;
}

/* :deep(.el-scrollbar__wrap) {
  height: 600px;
} */

/* .el-tabs {
  --el-tabs-header-height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
} */
</style>