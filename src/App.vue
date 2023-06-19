<script setup lang="ts">
import userRequest from '~/http/api/userApi'
import { ref, reactive } from 'vue';
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
