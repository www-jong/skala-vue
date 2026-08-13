<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggle-wrapper">
    <div class="btn-container">
      <label class="switch btn-color-mode-switch">
        <input type="checkbox" id="unit_color_mode" name="unit_color_mode" :checked="configStore.unit === 'fahrenheit'"
          @change="configStore.toggleUnit()" />
        <label class="btn-color-mode-switch-inner" data-off="  ℃ " data-on="  ℉ " for="unit_color_mode"></label>
      </label>
    </div>
  </div>
</template>

<style scoped>
.unit-toggle-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  -webkit-user-select: none;
}

.btn-container {
  display: inline-block;
  vertical-align: middle;
  text-align: center;
}

.btn-color-mode-switch {
  display: inline-block;
  margin: 0px;
  position: relative;
}

.btn-color-mode-switch>label.btn-color-mode-switch-inner {
  margin: 0px;
  width: 140px;
  height: 40px;
  background-color: #fcce8a;
  border-radius: 26px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  display: block;
  cursor: pointer;
}

.btn-color-mode-switch>label.btn-color-mode-switch-inner:before {
  content: attr(data-on);
  position: absolute;
  font-size: 14px;
  font-weight: 700;
  top: 10px;
  right: 30px;
  color: #475569;
  transition: all 0.3s ease;
}

.btn-color-mode-switch>label.btn-color-mode-switch-inner:after {
  content: attr(data-off);
  width: 66px;
  height: 32px;
  background: #ffffff;
  border-radius: 20px;
  position: absolute;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 4px;
  top: 4px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
  color: #1e293b;
  font-weight: 700;
}

.btn-color-mode-switch input[type="checkbox"] {
  cursor: pointer;
  width: 100%;
  height: 100%;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  margin: 0px;
}

.btn-color-mode-switch input[type="checkbox"]:checked+label.btn-color-mode-switch-inner {
  background-color: #fcce8a;
}

.btn-color-mode-switch input[type="checkbox"]:checked+label.btn-color-mode-switch-inner:after {
  content: attr(data-on);
  left: 70px;
}

.btn-color-mode-switch input[type="checkbox"]:checked+label.btn-color-mode-switch-inner:before {
  content: attr(data-off);
  right: auto;
  left: 30px;
}

/* 다크모드 대응 스타일 */
html.dark .btn-color-mode-switch>label.btn-color-mode-switch-inner {
  background-color: #334155 !important;
}

html.dark .btn-color-mode-switch>label.btn-color-mode-switch-inner:before {
  color: #94a3b8 !important;
}

html.dark .btn-color-mode-switch>label.btn-color-mode-switch-inner:after {
  background: #0f172a !important;
  color: #38bdf8 !important;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.4) !important;
}

html.dark .btn-color-mode-switch input[type="checkbox"]:checked+label.btn-color-mode-switch-inner {
  background-color: #334155 !important;
}
</style>
