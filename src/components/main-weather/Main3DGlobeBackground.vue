<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useWeatherStore } from '@/stores/weatherStore'

defineProps({
  isInteractive: {
    type: Boolean,
    default: false,
  },
})

// 🌍 3D 지구 유휴 자전 회전 속도 설정 (숫자를 올릴수록 빠르게 자전합니다)
const GLOBE_ROTATION_SPEED = 0.0005

const weatherStore = useWeatherStore()
const globeContainerRef = ref(null)

let viewer = null
let activeEntity = null
let favEntities = []
let isCameraFlying = false
let preUpdateListener = null

// 유휴 자전 회전 타이머 (마지막 조작 시각)
let lastInteractionTime = Date.now()

// 사용자 인터랙션 발생 시 유휴 타이머 갱신
const resetIdleTimer = () => {
  lastInteractionTime = Date.now()
}

// ────────────────────────────────────────────
// 온도 숫자를 아이콘처럼 렌더링하는 Canvas
// temp: number(°C), name: string
// ────────────────────────────────────────────
function createTempLabelCanvas(temp, name, isStar = false) {
  const tempStr = temp !== null && temp !== undefined ? `${Math.round(temp)}°` : '?°'
  // 이름을 공백 기준으로 분리하여 두 줄 표시 (울산광역시 남구 → 1줄: 울산광역시, 2줄: 남구)
  const parts = (name || '').trim().split(' ')
  const line1 = parts.length > 1 ? parts.slice(0, -1).join(' ') : parts[0]
  const line2 = parts.length > 1 ? parts[parts.length - 1] : ''

  const canvas = document.createElement('canvas')
  canvas.width = 240
  canvas.height = line2 ? 100 : 80
  const ctx = canvas.getContext('2d')

  const tempColor = temp >= 30 ? '#ef4444' : temp >= 25 ? '#f97316' : temp >= 18 ? '#22c55e' : temp >= 10 ? '#38bdf8' : '#818cf8'
  const shadowColor = 'rgba(2, 6, 23, 0.95)'

  // ── 온도 숫자 (크게)
  ctx.font = 'bold 36px "Segoe UI", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  for (let i = 0; i < 6; i++) {
    ctx.shadowColor = shadowColor
    ctx.shadowBlur = 8 + i * 2
    ctx.fillStyle = shadowColor
    ctx.fillText(tempStr, 120, 28)
  }
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.fillStyle = isStar ? '#fbbf24' : tempColor
  ctx.fillText(tempStr, 120, 28)

  // ── 도시명 1줄 (region or full name)
  ctx.font = 'bold 15px "Segoe UI", sans-serif'
  const y1 = line2 ? 64 : 62
  for (let i = 0; i < 4; i++) {
    ctx.shadowColor = shadowColor
    ctx.shadowBlur = 6 + i
    ctx.fillStyle = shadowColor
    ctx.fillText(line1, 120, y1)
  }
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.fillStyle = '#e2e8f0'
  ctx.fillText(line1, 120, y1)

  // ── 도시명 2줄 (name) — region이 있을 때만
  if (line2) {
    const y2 = 84
    for (let i = 0; i < 4; i++) {
      ctx.shadowColor = shadowColor
      ctx.shadowBlur = 6 + i
      ctx.fillStyle = shadowColor
      ctx.fillText(line2, 120, y2)
    }
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.fillStyle = '#ffffff'
    ctx.fillText(line2, 120, y2)
  }

  return canvas
}

// Cesium Viewer 초기화 및 3D 실사 지구본 구축
const initCesium = async () => {
  if (!globeContainerRef.value || !window.Cesium) return

  const Cesium = window.Cesium
  Cesium.Ion.defaultAccessToken = ''

  viewer = new Cesium.Viewer(globeContainerRef.value, {
    imageryProvider: false,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    animation: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    scene3DOnly: true,
  })

  if (viewer.cesiumWidget && viewer.cesiumWidget.creditContainer) {
    viewer.cesiumWidget.creditContainer.style.display = 'none'
  }

  // ArcGIS HD 실사 위성 지도
  try {
    const arcgisProvider = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
      'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
    )
    viewer.imageryLayers.addImageryProvider(arcgisProvider)
  } catch {
    try {
      const osmProvider = await Cesium.OpenStreetMapImageryProvider.fromUrl(
        'https://tile.openstreetmap.org/'
      )
      viewer.imageryLayers.addImageryProvider(osmProvider)
    } catch (e) {
      console.warn('Fallback imagery provider error:', e)
    }
  }

  viewer.scene.globe.enableLighting = false
  viewer.scene.globe.showGroundAtmosphere = true
  viewer.scene.skyAtmosphere.show = true

  // 줌 범위 제한
  const controller = viewer.scene.screenSpaceCameraController
  controller.minimumZoomDistance = 1200000.0
  controller.maximumZoomDistance = 8500000.0

  // 유휴 자전
  let lastFrameTime = Date.now()
  preUpdateListener = () => {
    const now = Date.now()
    const dt = (now - lastFrameTime) / 1000
    lastFrameTime = now
    if (!isCameraFlying && now - lastInteractionTime > 3000) {
      viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -GLOBE_ROTATION_SPEED * dt)
    }
  }
  viewer.scene.preUpdate.addEventListener(preUpdateListener)

  window.addEventListener('mousemove', resetIdleTimer)
  window.addEventListener('mousedown', resetIdleTimer)
  window.addEventListener('wheel', resetIdleTimer)
  window.addEventListener('touchstart', resetIdleTimer)

  renderFavorites()

  if (weatherStore.activeTargetCoords) {
    const { lat, lon, name, temp } = weatherStore.activeTargetCoords
    flyToLocation(lat, lon, name, temp, 1.8)
  }
}

// 지정된 위치로 3D 카메라 비행
const flyToLocation = (lat, lon, name = '관측지', temp = null, duration = 2.2) => {
  if (!viewer || !window.Cesium) return
  const Cesium = window.Cesium

  isCameraFlying = true
  resetIdleTimer()

  if (activeEntity) {
    viewer.entities.remove(activeEntity)
    activeEntity = null
  }

  if (!lat || !lon) {
    isCameraFlying = false
    return
  }

  const targetPosition = Cesium.Cartesian3.fromDegrees(lon, lat, 0)

  activeEntity = viewer.entities.add({
    name: name,
    position: targetPosition,
    billboard: {
      image: createTempLabelCanvas(temp, name, false),
      scale: 0.65,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -8),
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
  })

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(lon, lat, 2600000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-85),
      roll: 0,
    },
    duration: duration,
    easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
    complete: () => { isCameraFlying = false; resetIdleTimer() },
    cancel: () => { isCameraFlying = false; resetIdleTimer() },
  })
}

// ⭐ 즐겨찾기 도시 3D 핀
const renderFavorites = () => {
  if (!viewer || !window.Cesium) return
  const Cesium = window.Cesium

  favEntities.forEach((ent) => viewer.entities.remove(ent))
  favEntities = []

  weatherStore.favorites.forEach((city) => {
    if (!city.location || city.location.lat === undefined) return
    const { lat, lon, name, region } = city.location
    const temp = city.current ? city.current.temp_c : null
    const displayName = region && region !== name ? `${region} ${name}` : name

    const ent = viewer.entities.add({
      name: `Fav_${name}`,
      position: Cesium.Cartesian3.fromDegrees(lon, lat, 0),
      billboard: {
        image: createTempLabelCanvas(temp, displayName, true),
        scale: 0.55,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -6),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    })
    favEntities.push(ent)
  })
}

watch(
  () => weatherStore.activeTargetCoords,
  (newCoords) => {
    if (newCoords && newCoords.lat !== undefined && newCoords.lon !== undefined) {
      flyToLocation(newCoords.lat, newCoords.lon, newCoords.name, newCoords.temp)
    } else if (!newCoords && activeEntity && viewer) {
      viewer.entities.remove(activeEntity)
      activeEntity = null
    }
  },
  { deep: true }
)

watch(
  () => weatherStore.favorites,
  () => { renderFavorites() },
  { deep: true }
)

onMounted(() => { initCesium() })

onUnmounted(() => {
  window.removeEventListener('mousemove', resetIdleTimer)
  window.removeEventListener('mousedown', resetIdleTimer)
  window.removeEventListener('wheel', resetIdleTimer)
  window.removeEventListener('touchstart', resetIdleTimer)

  if (viewer && !viewer.isDestroyed()) {
    if (preUpdateListener) {
      viewer.scene.preUpdate.removeEventListener(preUpdateListener)
    }
    viewer.destroy()
  }
})
</script>

<template>
  <div class="cesium-globe-wrapper" :class="{ interactive: isInteractive }">
    <div ref="globeContainerRef" class="cesium-container"></div>
  </div>
</template>

<style scoped>
.cesium-globe-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  opacity: 0.95;
  transition: opacity 0.5s ease, z-index 0.3s ease;
}

.cesium-globe-wrapper.interactive {
  pointer-events: auto !important;
  z-index: 100 !important;
  opacity: 1 !important;
}

.cesium-container {
  width: 100vw;
  height: 100vh;
  background-color: #020617;
}

:deep(.cesium-viewer-bottom) {
  display: none !important;
}
</style>
