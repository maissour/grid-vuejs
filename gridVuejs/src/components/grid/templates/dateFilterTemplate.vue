<script setup lang="ts">
import { ref } from 'vue'

const p = defineProps<{
  templateProps: { field: string; format: string; value: any; onChange: (v: any) => void }
}>()

const dateInput = ref<HTMLInputElement | null>(null)

const openCalendar = () => {
  const el = dateInput.value
  if (!el) return
  try {
    el.showPicker()
  } catch {
    el.focus()
    el.click()
  }
}

const clear = () => p.templateProps.onChange('')
</script>

<template>
  <div class="date-filter">
    <input
      type="text"
      class="t-filtercell"
      :placeholder="p.templateProps.format"
      :value="p.templateProps.value"
      @input="p.templateProps.onChange(($event.target as HTMLInputElement).value)"
    />

    <button type="button" class="t-calendar-btn" @click="openCalendar">
      <span class="fa-solid fa-calendar-days"></span>
    </button>
    <button v-if="p.templateProps.value" type="button" class="t-calendar-btn" @click="clear">
      <span class="fa-solid fa-filter-circle-xmark"></span>
    </button>

    <input
      ref="dateInput"
      type="date"
      class="hidden-date"
      tabindex="-1"
      :value="p.templateProps.value"
      @change="p.templateProps.onChange(($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style scoped>
.date-filter {
  position: relative;
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #666666;
}

.hidden-date {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.t-filtercell {
  background-color: transparent;
  border: none;
  padding: 6px 4px;
  field-sizing: content;
  min-width: 10ch;
  max-width: 100%;
  box-sizing: border-box;
  outline: none;
}

.t-calendar-btn {
  background-color: transparent;
  border: none;
  color: #1479c9;
  cursor: pointer;
}
</style>
