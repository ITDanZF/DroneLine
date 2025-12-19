import { Viewer } from "cesium";
export default class Cesium {
  private Viewer: Viewer;
  constructor(DomElementId: string, options: {} = {}) {
    this.Viewer = new Viewer(DomElementId, {
      ...options,
    });
  }

  setUpOptions(options: {}) {}

  get ViewerInstance() {
    return this.Viewer;
  }
}

// 仅类型导出：表示 Cesium 实例的类型
export type CesiumInstance = InstanceType<typeof Cesium>;
