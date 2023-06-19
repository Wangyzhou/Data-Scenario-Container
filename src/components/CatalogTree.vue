<template>
  <div>
    <el-dialog v-model="isCatalogTreeDialogShow" title="选择目录" width="25%" align-center @close="closePreviewDialog"
      destroy-on-close center>
      <el-tree :props="treeProps" :load="loadNode" @node-click="handleTreeNodeClick" lazy>
      </el-tree>
      <template #footer>
        <el-button type="primary" size="default" @click="confirmCatalog">确定</el-button>
        &nbsp;
        <el-button type="primary" @click="closePreviewDialog" size="large">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { toRefs, ref, reactive, computed } from 'vue';
import catalogApi from '~/http/api/catalogApi';
import { useUserStore } from '~/store/user';
import { useCatalogStore } from '~/store/catalog';
import type Node from 'element-plus/es/components/tree/src/model/node'
import { ElMessage } from 'element-plus';

interface Tree {
  id: string,
  name: string,
  type: string,
  leaf?: boolean
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

const treeProps = {
  label: 'name',
  children: 'zones',
  isLeaf: 'leaf',
}
const props = defineProps({
  isCatalogTreeDialogShow: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(["closeCatalogTreeDialog", "confirmSavePath"])
const { isCatalogTreeDialogShow } = toRefs(props)
const userStore = useUserStore()
const catalogStore = useCatalogStore()

const clickNode = reactive({
  obj: null as any
})
// const data = [] as Tree[]
const closePreviewDialog = () => {
  emit("closeCatalogTreeDialog")
}
const confirmCatalog = () => {
  // console.log(1)
  if (clickNode.obj === null) {
    ElMessage({
      type: 'error',
      message: '未选择存放目录！'
    })
    return
  } else if (clickNode.obj.type !== 'folder') {
    ElMessage({
      type: 'error',
      message: '请选择目录进行存放！'
    })
    return
  }
  emit("confirmSavePath", clickNode.obj.id)
  emit("closeCatalogTreeDialog")
  // console.log(clickNode.obj)
}
const loadNode = async (node: Node, resolve: (data: Tree[]) => void) => {
  await handleTreeNodeClick()
  console.log(node)
  if (node.level === 0) {
    return resolve([{ name: 'Mydata', type: 'folder', id: catalogStore.rootCatalog.id }])
  }
  if (node.level === 1) {
    const catalogRes = await getCatalogList(catalogStore.rootCatalog.id) as any
    console.log(catalogRes)
    const data: Tree[] = []
    catalogRes.forEach((file: any) => {
      data.push({
        id: file.id,
        name: file.name,
        type: file.fileType,
        leaf: file.fileType == 'folder' ? false : true
      })
    })
    return resolve(data)
  }
  else {
    const catalogRes = await getCatalogList(clickNode.obj.id) as any
    if (catalogRes.length === 0) {
      return resolve([])
    }
    console.log(catalogRes)
    const data: Tree[] = []
    catalogRes.forEach((file: any) => {
      data.push({
        id: file.id,
        name: file.name,
        type: file.fileType,
        leaf: file.fileType == 'folder' ? false : true
      })
    })
    return resolve(data)
  }
}
const getCatalogList = (catalogId: string) => {
  return new Promise((resolve, reject) => {
    catalogApi.getCatalogList({ userId: userStore.loginUser.id, catalogId: catalogId } as GetCatalogList).then(listRes => {
      // console.log(listRes.data)
      if (listRes.code === 200) {
        resolve(listRes.data)
      }
    }).catch(err => {
      reject(err)
    })
  })

}
const handleTreeNodeClick = (node?: any) => {
  console.log(node)
  return new Promise(resolve => {
    clickNode.obj = node
    resolve(true)
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