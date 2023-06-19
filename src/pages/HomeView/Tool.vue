<template></template>

<script setup lang="ts">
import UniqueValueRender from 'http://localhost:8998/js/UniqueValueRender.js'
import { onMounted } from 'vue';

onMounted(() => {
  console.log(new UniqueValueRender('11'))
})
</script>

<style scoped></style>