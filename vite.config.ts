import { defineConfig } from "vite";
import Cesium from "vite-plugin-cesium";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), Cesium()],
});
