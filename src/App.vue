<script setup lang="ts">
import { onMounted, ref } from "vue";
import Cesium from "./Cesium/Cesiumjs";
import Line from "./components/Line/Line.vue";

const lineRef = ref(null);
onMounted(() => {
  const cesium = new Cesium("cesiumContainer", {
    // 禁用查找工具
    geocoder: false,
    // 禁用图层选择器
    baseLayerPicker: false,
    // 禁用时间轴
    timeline: false,
    // 禁用导航帮助按钮
    homeButton: false,
    // 禁用场景模式选择器
    sceneModePicker: false,
    // 禁用缩放控件
    navigationHelpButton: false,
    // 禁用版权信息
    creditContainer: null,
    // 禁用全屏按钮
    fullscreenButton: false,
    // 禁用播放器
    animation: false,
    // 禁用VR按钮
    vrButton: false,
    // 天空盒：使用 cesium 包的 SkyBox 类并配置静态资源路径
    // skyBox: new SkyBox({
    //   sources: {
    //     positiveX: "/skybox/lantian/Right.jpg",
    //     negativeX: "/skybox/lantian/Left.jpg",
    //     positiveY: "/skybox/lantian/Front.jpg",
    //     negativeY: "/skybox/lantian/Back.jpg",
    //     positiveZ: "/skybox/lantian/Up.jpg",
    //     negativeZ: "/skybox/lantian/Down.jpg",
    //   },
    // }),
  });
  /**
   * 
    positiveX: 右（Right.jpg）
    negativeX: 左（Left.jpg）
    positiveY: 上（Up.jpg）
    negativeY: 下（Down.jpg）
    positiveZ: 前（Front.jpg）
    negativeZ: 后（Back.jpg）
   * 
   */

  // 显示帧率
  cesium.ViewerInstance.scene.debugShowFramesPerSecond = true;

  if (lineRef.value) {
    lineRef.value.initLine(cesium.ViewerInstance);
  }
});
</script>

<template>
  <div id="cesiumContainer" style="width: 100%; height: 100vh"></div>
</template>

<style scoped></style>
