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

// Cesium 내부 라벨 노이즈(자글거림)를 100% 해결하는 고화질 2D Canvas Billboard 생성기
function createLabelCanvas(text, isStar = false) {
  const canvas = document.createElement('canvas')
  canvas.width = 280
  canvas.height = 70
  const ctx = canvas.getContext('2d')

  // 1. 선명한 다크 슬레이트 캡슐형 배경
  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)'
  ctx.beginPath()
  ctx.roundRect(8, 8, 264, 54, 16)
  ctx.fill()

  // 은은한 테두리 하이라이트 선
  ctx.strokeStyle = isStar ? '#f59e0b' : '#6366f1'
  ctx.lineWidth = 3
  ctx.stroke()

  // 2. Razor-sharp 선명한 텍스트 렌더링
  ctx.font = 'bold 24px sans-serif'
  ctx.fillStyle = isStar ? '#fbbf24' : '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 140, 35)

  return canvas
}

// Cesium Viewer 초기화 및 3D 실사 지구본 구축
const initCesium = async () => {
  if (!globeContainerRef.value || !window.Cesium) return

  const Cesium = window.Cesium
  Cesium.Ion.defaultAccessToken = ''

  // 1. 기본 뷰어 인스턴스 생성
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

  // Cesium 로고 제거
  if (viewer.cesiumWidget && viewer.cesiumWidget.creditContainer) {
    viewer.cesiumWidget.creditContainer.style.display = 'none'
  }

  // 2. ArcGIS HD 실사 위성 지도 타일 비동기 추가 (3D 구체 표면에 100% 매핑)
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

  // 3. 지구 대기 분위기 & 명암 보정 (enableLighting = false로 전 세계 대륙 선명 노출)
  viewer.scene.globe.enableLighting = false
  viewer.scene.globe.showGroundAtmosphere = true
  viewer.scene.skyAtmosphere.show = true

  // 4. 유휴 상태(3초 동안 조작이 없으면) 3D 지구 자동 자전 회전 렌더링
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

  // 5. 마우스/터치 조작 감지 이벤트 연동
  window.addEventListener('mousemove', resetIdleTimer)
  window.addEventListener('mousedown', resetIdleTimer)
  window.addEventListener('wheel', resetIdleTimer)
  window.addEventListener('touchstart', resetIdleTimer)

  // 6. 즐겨찾기 핀 렌더링
  renderFavorites()

  // 선택된 도시가 있을 때만 비행 및 타겟 핀 렌더링
  if (weatherStore.activeTargetCoords) {
    flyToLocation(
      weatherStore.activeTargetCoords.lat,
      weatherStore.activeTargetCoords.lon,
      weatherStore.activeTargetCoords.name,
      1.8
    )
  }
}

// 지정된 (lat, lon) 위치로 3D 카메라 슈루룩 비행 (FlyTo)
const flyToLocation = (lat, lon, name = '관측지', duration = 2.2) => {
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

  // 선택된 관측지 3D 마커 및 100% 노이즈 없는 Canvas Billboard 라벨
  activeEntity = viewer.entities.add({
    name: name,
    position: targetPosition,
    point: {
      pixelSize: 16,
      color: Cesium.Color.fromCssColorString('#f59e0b'),
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 3,
    },
    billboard: {
      image: createLabelCanvas(`📍 ${name}`, false),
      scale: 0.5,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -20),
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
    complete: () => {
      isCameraFlying = false
      resetIdleTimer()
    },
    cancel: () => {
      isCameraFlying = false
      resetIdleTimer()
    },
  })
}

// ⭐ 즐겨찾기 도시들 3D 핀 표출
const renderFavorites = () => {
  if (!viewer || !window.Cesium) return
  const Cesium = window.Cesium

  favEntities.forEach((ent) => viewer.entities.remove(ent))
  favEntities = []

  weatherStore.favorites.forEach((city) => {
    if (!city.location || city.location.lat === undefined) return
    const { lat, lon, name } = city.location

    const ent = viewer.entities.add({
      name: `Fav_${name}`,
      position: Cesium.Cartesian3.fromDegrees(lon, lat, 0),
      point: {
        pixelSize: 14,
        color: Cesium.Color.fromCssColorString('#ef4444'),
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
      },
      billboard: {
        image: createLabelCanvas(`⭐ ${name}`, true),
        scale: 0.5,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -18),
      },
    })
    favEntities.push(ent)
  })
}

// 스토어 타겟 좌표 변경 감지
watch(
  () => weatherStore.activeTargetCoords,
  (newCoords) => {
    if (newCoords && newCoords.lat !== undefined && newCoords.lon !== undefined) {
      flyToLocation(newCoords.lat, newCoords.lon, newCoords.name)
    } else if (!newCoords && activeEntity && viewer) {
      viewer.entities.remove(activeEntity)
      activeEntity = null
    }
  },
  { deep: true }
)

// 즐겨찾기 도시 변경 감지
watch(
  () => weatherStore.favorites,
  () => {
    renderFavorites()
  },
  { deep: true }
)

onMounted(() => {
  initCesium()
})

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
