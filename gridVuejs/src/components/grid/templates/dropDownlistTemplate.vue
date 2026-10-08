<script setup lang="ts">
import { ref } from 'vue'
import type { IdTextDto } from '../index.types'

// Props
const p = defineProps<{
  templateProps: {
    field: string
    value: any
    onChange: (v: any) => void
    dataItemList: IdTextDto[]
  }
}>()

// Data
const selectedValue = ref<IdTextDto>({ id: 0, text: 'All' })
const open = ref(false)

// Methods
const pick = (id: number) => {
  const selected = p.templateProps.dataItemList.find((i: IdTextDto) => i.id === id)
  if (selected) {
    selectedValue.value = selected
    p.templateProps.onChange(selected.text)
  }
  open.value = false
}
</script>

<template>
  <div class="t-dropdown" @focusout="open = false" tabindex="-1">
    <button type="button" class="t-select-filter" @click="open = !open">
      {{ selectedValue.text }} <span class="fa-solid fa-chevron-down"></span>
    </button>

    <ul v-if="open" class="t-dropdown-list">
      <li
        v-for="val in p.templateProps.dataItemList"
        :key="val.id"
        class="t-select-option"
        @mousedown.prevent="pick(val.id)"
      >
        {{ val.text }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.t-dropdown {
  position: relative;
  display: inline-block;
}
.t-select-filter {
  background: transparent;
  border: none;
  border-bottom: 1px solid #666;
  padding: 6px 4px;
  cursor: pointer;
}

.t-select-filter span {
  font-size: 10px;
}

.t-dropdown-list {
  position: absolute;
  height: 200px;
  overflow: auto;
  scrollbar-width: thin;
  z-index: 10;
  top: 100%;
  left: 0;
  min-width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  background: white;
  border: 1px solid white;
  border-radius: 0px 0px 4px 4px;
}
.t-select-option {
  display: flex;
  justify-content: left;
  padding: 3px 4px;
  font-size: 12px;
  color: black;
  background: white;
  cursor: pointer;
  white-space: nowrap;
}
.t-select-option:hover {
  background-color: #1479c9;
  color: white;
}

.t-select-option:last-child {
  border-radius: 0px 0px 3px 3px;
}
</style>
