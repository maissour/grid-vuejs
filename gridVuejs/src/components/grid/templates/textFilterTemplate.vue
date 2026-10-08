<script setup lang="ts">
// Props
const p = defineProps<{
  templateProps: {
    field: string
    value: any
    onChange: (v: any) => void
  }
}>()
</script>
<template>
  <input
    class="t-filter-input"
    type="text"
    :value="p.templateProps.value"
    @input="p.templateProps.onChange(($event.target as HTMLInputElement).value)"
  />
</template>
<style scoped>
.t-filter-input {
  width: 100%;
  box-sizing: border-box;
  padding: 6px 4px;
  font-size: 13px;
  font-weight: normal;
  color: #111111;
  background: transparent;
  border: none;
  border-bottom: 1px solid #dddddd;
  border-radius: 0;
  outline: none;
  transition: border-color 0.15s ease;
}

.t-filter-input:hover {
  border-bottom-color: #bbbbbb;
}

.t-filter-input:focus {
  border-bottom-color: #666666;
}
</style>
