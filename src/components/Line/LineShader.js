import * as Cesium from 'cesium'
/**
 * 创建失败检测材质
 * @param {*} color
 * @returns
 */
export function createDepthFailMaterial (color) {
  return new Cesium.Material({
    fabric: {
      type: 'PolylineDash',
      uniforms: {
        color: color, // 使用传入的颜色
        gapColor: new Cesium.Color(0.0, 0.0, 0.0, 0.0), // 默认间隔颜色
        dashLength: 16.0, // 默认虚线长度
        dashPattern: 255.0 // 默认虚线模式
      },
      source: `
              uniform vec4 color;
              uniform vec4 gapColor;
              uniform float dashLength;
              uniform float dashPattern;
              in float v_polylineAngle;

              const float maskLength = 16.0;

              mat2 rotate(float rad) {
                  float c = cos(rad);
                  float s = sin(rad);
                  return mat2(
                      c, s,
                      -s, c
                  );
              }

              czm_material czm_getMaterial(czm_materialInput materialInput)
              {
                  czm_material material = czm_getDefaultMaterial(materialInput);

                  vec2 pos = rotate(v_polylineAngle) * gl_FragCoord.xy;

                  // Get the relative position within the dash from 0 to 1
                  float dashPosition = fract(pos.x / (dashLength * czm_pixelRatio));
                  // Figure out the mask index.
                  float maskIndex = floor(dashPosition * maskLength);
                  // Test the bit mask.
                  float maskTest = floor(dashPattern / pow(2.0, maskIndex));
                  vec4 fragColor = (mod(maskTest, 2.0) < 1.0) ? gapColor : color;
                  if (fragColor.a < 0.005) {   // matches 0/255 and 1/255
                      discard;
                  }

                  fragColor = czm_gammaCorrect(fragColor);
                  material.emission = fragColor.rgb;
                  material.alpha = fragColor.a;
                  return material;
              }
          `
    }
  })
}

// 绿线材质
const greenLineMaterilaConfig = {
  fabric: {
    type: 'DJIArrowLine',
    uniforms: {
      color: new Cesium.Color(14 / 255, 211 / 255, 126 / 255, 1.0),
      gapColor: new Cesium.Color(1.0, 1.0, 1.0, 1.0),
      speed: 60.0,        // 降低速度使箭头更容易看到
      repeat: 5.0,        // 减少重复次数使箭头更大
      dashLength: 30.0,
      dashPattern: 255.0,
      image: new Image().src = '/arrow2.svg'
    },
    source: `
      in float v_polylineAngle;
      const float maskLength = 16.0;
      uniform float speed;

      mat2 rotate(float rad) {
          float c = cos(rad);
          float s = sin(rad);
          return mat2(
              c, s,
              -s, c
          );
      }

      czm_material czm_getMaterial(czm_materialInput materialInput)
      {
          czm_material material = czm_getDefaultMaterial(materialInput);

          vec2 pos = rotate(v_polylineAngle) * gl_FragCoord.xy;

          // Calculate a time-based offset for flowing effect
          float time = fract(czm_frameNumber / speed);
          
          // Get the relative position within the dash from 0 to 1
          float dashPosition = fract((pos.x / (dashLength * czm_pixelRatio)) - time);

          vec2 st = materialInput.st;
          vec4 colorImage = texture(image, vec2(fract(dashPosition), st.t)); // 流动

          // Figure out the mask index.
          float maskIndex = floor(dashPosition * maskLength);
          // Test the bit mask.
          float maskTest = floor(dashPattern / pow(2.0, maskIndex));
          vec4 fragColor = colorImage;

          if (fragColor.a < 0.005) {   // matches 0/255 and 1/255
            fragColor = color;
          }

          fragColor = czm_gammaCorrect(fragColor);
          material.emission = fragColor.rgb;
          material.alpha = fragColor.a;
          return material;
      }
    `,
  },
}
export const materialGreen = new Cesium.Material(greenLineMaterilaConfig);
export function createGreenLineMaterial () {
  return new Cesium.Material(greenLineMaterilaConfig)
}
/**
 * 红色材质
 */
export const materialRed = new Cesium.Material({
  fabric: {
    type: 'PolylineDash',
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 1.0), // 使用传入的颜色
      gapColor: new Cesium.Color(0.0, 0.0, 0.0, 0.0), // 默认间隔颜色
      dashLength: 16.0, // 默认虚线长度
      dashPattern: 255.0 // 默认虚线模式
    },
    source: `
            uniform vec4 color;
            uniform vec4 gapColor;
            uniform float dashLength;
            uniform float dashPattern;
            in float v_polylineAngle;

            const float maskLength = 16.0;

            mat2 rotate(float rad) {
                float c = cos(rad);
                float s = sin(rad);
                return mat2(
                    c, s,
                    -s, c
                );
            }

            czm_material czm_getMaterial(czm_materialInput materialInput)
            {
                czm_material material = czm_getDefaultMaterial(materialInput);

                vec2 pos = rotate(v_polylineAngle) * gl_FragCoord.xy;

                // Get the relative position within the dash from 0 to 1
                float dashPosition = fract(pos.x / (dashLength * czm_pixelRatio));
                // Figure out the mask index.
                float maskIndex = floor(dashPosition * maskLength);
                // Test the bit mask.
                float maskTest = floor(dashPattern / pow(2.0, maskIndex));
                vec4 fragColor = (mod(maskTest, 2.0) < 1.0) ? gapColor : color;
                if (fragColor.a < 0.005) {   // matches 0/255 and 1/255
                    discard;
                }

                fragColor = czm_gammaCorrect(fragColor);
                material.emission = fragColor.rgb;
                material.alpha = fragColor.a;
                return material;
            }
        `
  }
})

/**
 * 白色材质
 */

const whiteLineMaterilaConfig = {
  fabric: {
    type: 'DJIWhiteLine',
    uniforms: {
      color: new Cesium.Color(1.0, 1.0, 1.0, 1.0),
      index: -1.0
    },
    source: `
      uniform vec4 color; // 从 uniforms 获取颜色
      uniform float index;
      in float v_batchId; 
      czm_material czm_getMaterial(czm_materialInput materialInput) {
        czm_material material = czm_getDefaultMaterial(materialInput);
        
        // 创建柔和的渐变效果
        float gradient = smoothstep(0.0, 1.0, materialInput.st.t);
        vec3 baseColor = color.rgb;
        // baseColor.b = v_batchId;
        // baseColor.g = index;
        if (index >= 0.0 && v_batchId == index) {
            baseColor = vec3(1.0, 0.9, 0.3);
        }
        
        material.diffuse = mix(baseColor, baseColor * 0.85, gradient);
        material.alpha = mix(1.0, 0.7, gradient);
        
        // 添加细微的光泽
        material.specular = 0.3;
        material.shininess = 10.0;
        
        return material;
      }
    `
  }
}
export const materialWhite = new Cesium.Material(whiteLineMaterilaConfig)
export function createWhiteLineMaterial () {
  return new Cesium.Material(whiteLineMaterilaConfig)
}

/**
 * 线的顶点着色器
 * @type {string}
 */
export const vertexShaderSource = `
    #define CLIP_POLYLINE 
    void clipLineSegmentToNearPlane(
    vec3 p0,
    vec3 p1,
    out vec4 positionWC,
    out bool clipped,
    out bool culledByNearPlane,
    out vec4 clippedPositionEC)
{
    culledByNearPlane = false;
    clipped = false;

    vec3 p0ToP1 = p1 - p0;
    float magnitude = length(p0ToP1);
    vec3 direction = normalize(p0ToP1);

    float endPoint0Distance =  czm_currentFrustum.x + p0.z;

    float denominator = -direction.z;

    if (endPoint0Distance > 0.0 && abs(denominator) < czm_epsilon7)
    {
        culledByNearPlane = true;
    }
    else if (endPoint0Distance > 0.0)
    {
        float t = endPoint0Distance / denominator;
        if (t < 0.0 || t > magnitude)
        {
            culledByNearPlane = true;
        }
        else
        {
            // Segment crosses the near plane, update p0 to lie exactly on it.
            p0 = p0 + t * direction;

            // Numerical noise might put us a bit on the wrong side of the near plane.
            // Don't let that happen.
            p0.z = min(p0.z, -czm_currentFrustum.x);

            clipped = true;
        }
    }

    clippedPositionEC = vec4(p0, 1.0);
    positionWC = czm_eyeToWindowCoordinates(clippedPositionEC);
}

vec4 getPolylineWindowCoordinatesEC(vec4 positionEC, vec4 prevEC, vec4 nextEC, float expandDirection, float width, bool usePrevious, out float angle)
{
#ifdef POLYLINE_DASH
    vec4 positionWindow = czm_eyeToWindowCoordinates(positionEC);
    vec4 previousWindow = czm_eyeToWindowCoordinates(prevEC);
    vec4 nextWindow = czm_eyeToWindowCoordinates(nextEC);

    // Determine the relative screen space direction of the line.
    vec2 lineDir;
    if (usePrevious) {
        lineDir = normalize(positionWindow.xy - previousWindow.xy);
    }
    else {
        lineDir = normalize(nextWindow.xy - positionWindow.xy);
    }
    angle = atan(lineDir.x, lineDir.y) - 1.570796327;
    angle = floor(angle / czm_piOverFour + 0.5) * czm_piOverFour;
#endif

    vec4 clippedPrevWC, clippedPrevEC;
    bool prevSegmentClipped, prevSegmentCulled;
    clipLineSegmentToNearPlane(prevEC.xyz, positionEC.xyz, clippedPrevWC, prevSegmentClipped, prevSegmentCulled, clippedPrevEC);

    vec4 clippedNextWC, clippedNextEC;
    bool nextSegmentClipped, nextSegmentCulled;
    clipLineSegmentToNearPlane(nextEC.xyz, positionEC.xyz, clippedNextWC, nextSegmentClipped, nextSegmentCulled, clippedNextEC);

    bool segmentClipped, segmentCulled;
    vec4 clippedPositionWC, clippedPositionEC;
    clipLineSegmentToNearPlane(positionEC.xyz, usePrevious ? prevEC.xyz : nextEC.xyz, clippedPositionWC, segmentClipped, segmentCulled, clippedPositionEC);

    if (segmentCulled)
    {
        return vec4(0.0, 0.0, 0.0, 1.0);
    }

    vec2 directionToPrevWC = normalize(clippedPrevWC.xy - clippedPositionWC.xy);
    vec2 directionToNextWC = normalize(clippedNextWC.xy - clippedPositionWC.xy);

    if (prevSegmentCulled)
    {
        directionToPrevWC = -directionToNextWC;
    }
    else if (nextSegmentCulled)
    {
        directionToNextWC = -directionToPrevWC;
    }

    vec2 thisSegmentForwardWC, otherSegmentForwardWC;
    if (usePrevious)
    {
        thisSegmentForwardWC = -directionToPrevWC;
        otherSegmentForwardWC = directionToNextWC;
    }
    else
    {
        thisSegmentForwardWC = directionToNextWC;
        otherSegmentForwardWC =  -directionToPrevWC;
    }

    vec2 thisSegmentLeftWC = vec2(-thisSegmentForwardWC.y, thisSegmentForwardWC.x);

    vec2 leftWC = thisSegmentLeftWC;
    float expandWidth = width * 0.5;
    if (!czm_equalsEpsilon(prevEC.xyz - positionEC.xyz, vec3(0.0), czm_epsilon1) && !czm_equalsEpsilon(nextEC.xyz - positionEC.xyz, vec3(0.0), czm_epsilon1))
    {
        vec2 otherSegmentLeftWC = vec2(-otherSegmentForwardWC.y, otherSegmentForwardWC.x);

        vec2 leftSumWC = thisSegmentLeftWC + otherSegmentLeftWC;
        float leftSumLength = length(leftSumWC);
        leftWC = leftSumLength < czm_epsilon6 ? thisSegmentLeftWC : (leftSumWC / leftSumLength);

        vec2 u = -thisSegmentForwardWC;
        vec2 v = leftWC;
        float sinAngle = abs(u.x * v.y - u.y * v.x);
        expandWidth = clamp(expandWidth / sinAngle, 0.0, width * 2.0);
    }

    vec2 offset = leftWC * expandDirection * expandWidth * czm_pixelRatio;
    return vec4(clippedPositionWC.xy + offset, -clippedPositionWC.z, 1.0) * (czm_projection * clippedPositionEC).w;
}

vec4 getPolylineWindowCoordinates(vec4 position, vec4 previous, vec4 next, float expandDirection, float width, bool usePrevious, out float angle)
{
    vec4 positionEC = czm_modelViewRelativeToEye * position;
    vec4 prevEC = czm_modelViewRelativeToEye * previous;
    vec4 nextEC = czm_modelViewRelativeToEye * next;
    return getPolylineWindowCoordinatesEC(positionEC, prevEC, nextEC, expandDirection, width, usePrevious, angle);
}

in vec3 position3DHigh;
in vec3 position3DLow;
in vec3 prevPosition3DHigh;
in vec3 prevPosition3DLow;
in vec3 nextPosition3DHigh;
in vec3 nextPosition3DLow;
in vec2 expandAndWidth;
in vec2 st;
in float batchId;

out float v_width;
out vec2 v_st;
out float v_polylineAngle;
out float v_batchId;

void main()
{
    float expandDir = expandAndWidth.x;
    float width = abs(expandAndWidth.y) + 0.5;
    bool usePrev = expandAndWidth.y < 0.0;

    vec4 p = czm_computePosition();
    vec4 prev = czm_computePrevPosition();
    vec4 next = czm_computeNextPosition();

    float angle;
    vec4 positionWC = getPolylineWindowCoordinates(p, prev, next, expandDir, width, usePrev, angle);
    gl_Position = czm_viewportOrthographic * positionWC;

    v_width = width;
    v_st.s = st.s;
    v_st.t = czm_writeNonPerspective(st.t, gl_Position.w);
    v_polylineAngle = angle;
    v_batchId = batchId;
}
  `
