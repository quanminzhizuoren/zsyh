<template>
  <!-- 歌曲进度条 -->
  <div
    ref="progressRef"
    class="progress-bar"
    :style="{ '--size': pSize, '--progress-width': getDomProgress(progressWidth) + 'px' }"
  >
    <div class="progress-bar-progress">
      <div class="progress-bar-dto"></div>
    </div>
    <input
      class="progress-bar-range"
      type="range"
      ref="rangeRef"
      :max="props.max"
      :value="progressWidth"
      step="0.01"
      @input="input"
      @change="change"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
const props = withDefaults(
  defineProps<{
    size?: number | string
    max: number
    modelValue: number
    percentage?: boolean
  }>(),
  { size: 3, percentage: false, modelValue: 0 }
)
const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'percentage', value: number): void
  (e: 'input', value: number): void
  (e: 'change', value: number): void
}>()

const pSize = computed(() => (typeof props.size === 'string' ? props.size : props.size + 'px'))

const progressWidth = ref(0)

const progressRef = ref<HTMLDivElement>()
const rangeRef = ref<HTMLInputElement>()

let isInput = true

watch(
  () => props.modelValue,
  (val) => {
    if (isInput) progressWidth.value = val
  }
)
const input = () => {
  const val = Number(rangeRef.value?.value) || 0
  progressWidth.value = val
  isInput = false
}
const change = () => {
  isInput = true
  const val = Number(rangeRef.value?.value) || 0
  emit('change', val)
  emit('update:modelValue', val)
  emit('input', val)
  progressWidth.value = val
}

// 元素长度转换实际进度
const getProgress = (num: number) => num * (props.max / width)

// 进度转换元素长度
const getDomProgress = (num: number) => (Number(num) * width) / props.max

let width = 0
// 创建一个 ResizeObserver 对象
const resizeObserver = new ResizeObserver((entries) => {
  const changingElement = entries[0].target as HTMLDivElement
  if (changingElement) {
    width = changingElement.offsetWidth
  }
})

onMounted(() => {
  progressRef.value && resizeObserver.observe(progressRef.value)
})
onUnmounted(() => {
  progressRef.value && resizeObserver.unobserve(progressRef.value)
})
</script>
<style lang="less" scoped>
.progress-bar {
  width: 100%;
  height: var(--size);
  border-radius: var(--size);
  background-color: #ffffff71;
  position: relative;
  &-progress {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: var(--size);
    height: var(--size);
    width: var(--progress-width);
    background: #fff;
  }
  &-dto {
    position: absolute;
    right: 0;
    top: 50%;
    height: calc(var(--size) * 2);
    width: calc(var(--size) * 2);
    background-color: #fff;
    transform: translate(50%, -50%);
    border-radius: var(--size);
    box-shadow: 0 0 5px #00000044;
  }
  &-range {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }

  input[type='range'] {
    width: 100%;
    height: 5px;
    background-color: #ffffff81;
    -webkit-appearance: none;
    appearance: none;
    padding: 0;
    margin: 0;
  }

  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    .range-slider-thumb();
  }
  input[type='range']::-moz-range-thumb {
    -moz-appearance: none;
    .range-slider-thumb();
  }
}

.range-slider-thumb() {
  cursor: default;
  top: 1px;
  height: 9px;
  width: 1px;
  background: none repeat scroll 0 0 #777;
  border-radius: 15px;
}
</style>
