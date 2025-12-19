<template>
  <div>
    <div ref="lineContainer" class="line-container"></div>
  </div>
</template>

<script setup lang="ts">
import * as Cesium from "cesium";
import { ref } from "vue";
import LineSegment from "./LineSegment.ts";

function initLine(Viewer: Cesium.Viewer) {
  console.log(Viewer);
}
defineExpose({
  initLine,
});
</script>

<style scoped></style>
