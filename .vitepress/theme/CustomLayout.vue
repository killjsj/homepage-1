<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import AprilFools from "./AprilFools.vue";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #layout-bottom>
      <AprilFools />
    </template>
  </Layout>
</template>
