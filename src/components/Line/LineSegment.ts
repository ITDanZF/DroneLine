import LinkedList from "./LinkedList";
import * as Cesium from "cesium";
import { materialGreen } from "./LineShader";
import { generatorUUID } from "./utils";
type PointValue = {
  position: Array<number>;
};
type LineNode = {
  prePointer: Node | null;
  nextPointer: Node | null;
  value: PointValue;
};
export default class LineSegment {
  private linkedList: LinkedList<LineNode>;
  private polylinePrimitive: Cesium.Primitive;
  private instances: Cesium.GeometryInstance[] = [];
  private isRendering: boolean;

  constructor() {
    this.linkedList = new LinkedList<LineNode>();
    this.polylinePrimitive = new Cesium.Primitive();
    this.isRendering = false;
  }

  /**
   * 单次渲染函数
   * @param Viewer
   */
  public Render(Viewer: Cesium.Viewer) {
    if (!this.isRendering) {
      return;
    }
    const primitives = Viewer.scene.primitives;
    if (!this.polylinePrimitive) {
      this.polylinePrimitive = this.GeneratorLinePrimitive();
    }

    if (primitives.contains(this.polylinePrimitive)) {
      this.polylinePrimitive.destroy();
      primitives.remove(this.polylinePrimitive);
      this.polylinePrimitive = this.GeneratorLinePrimitive();
    }
    primitives.add(this.polylinePrimitive);

    this.isRendering = false;
  }

  public addOneLine(
    startPoint: Cesium.Cartesian3,
    endPoint: Cesium.Cartesian3
  ) {
    const id = generatorUUID();
    this.CreateLineGeometry(id, startPoint, endPoint);
  }

  private CreateLineGeometry(
    id: string,
    startPoint: Cesium.Cartesian3,
    endPoint: Cesium.Cartesian3,
    width = 8.0
  ) {
    let Line = [startPoint, endPoint];
    const instance = new Cesium.GeometryInstance({
      id: id,
      geometry: new Cesium.PolylineGeometry({
        positions: Line,
        width: width,
        vertexFormat: Cesium.VertexFormat.ALL,
      }),
    });
    this.instances.push(instance);
    // 启用更新
    this.isRendering = true;
    return instance;
  }

  private GeneratorLinePrimitive() {
    return new Cesium.Primitive({
      geometryInstances: this.instances,
      appearance: new Cesium.PolylineMaterialAppearance({
        translucent: true,
        material: materialGreen,
      }),
    });
  }
}
