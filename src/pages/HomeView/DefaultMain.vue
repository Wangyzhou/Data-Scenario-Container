<template>
  <div id="defaultMain">
    <el-aside>
      <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" :collapse="isCollapse" :router="true">
        <div class="topMenuCon">
          <el-divider border-style="hidden" style="margin-top: 5px;" />

          <el-menu-item index="1" route="/home">
            <el-icon><icon-menu /></el-icon>
            <template #title>功能概览</template>
          </el-menu-item>
          <el-menu-item index="2" route="/home/data">
            <el-icon>
              <Coin />
            </el-icon>
            <template #title>数据资源</template>
          </el-menu-item>
          <el-menu-item index="3" route="/home/tool">
            <el-icon>
              <Tools />
            </el-icon>
            <template #title>工具资源</template>
          </el-menu-item>
          <el-menu-item index="4" route="/home/scene">
            <el-icon>
              <DataLine />
            </el-icon>
            <template #title>场景中心</template>
          </el-menu-item>
        </div>
        <!-- <el-divider /> -->
        <div class="bottomMenuCon">
          <el-divider border-style="hidden" />
          <el-menu-item index="6">
            <el-icon>
              <UserFilled />
            </el-icon>
            <template #title>我的账户</template>
          </el-menu-item>
          <el-menu-item index="7">
            <el-icon>
              <Message />
            </el-icon>
            <template #title>消息中心</template>
          </el-menu-item>
        </div>
      </el-menu>
    </el-aside>
    <el-main>
      <RouterView />
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  Menu as IconMenu,
  Tools,
  DataLine,
  Files,
  Coin,
  UserFilled,
  Message
} from '@element-plus/icons-vue'
import { usePublicStore } from '~/store/publicStore';
import { storeToRefs } from 'pinia';

const isCollapse = ref(false)
const route = useRoute()
const publicStore = usePublicStore()
const currentRoutePath = ref(route.path)
const { activeIndex } = storeToRefs(publicStore)
</script>

<style scoped>
#defaultMain {
  height: 100%;
  width: 100%;
  padding: 0px;
  /* background-color: aqua; */
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  flex-direction: row;
  flex-wrap: nowrap;
}

.menuCon {
  height: 100%;
  width: 100%;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  background-color: rgb(255, 255, 255);
  height: 100%;
}

.el-menu-item {
  font-size: 20px;
}

.el-aside {
  height: 100%;
  width: 201px;
  border-right: 1px solid rgb(212, 209, 209);
}

.el-main {
  height: 100%;
  padding: 0px;
}

.topMenuCon {
  display: flex;
  height: 50%;
  flex-direction: column;
  justify-content: flex-start;
}

.bottomMenuCon {
  display: flex;
  height: 50%;
  flex-direction: column-reverse;
}
</style>