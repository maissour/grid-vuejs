<script setup lang="ts">
import type { GridColumns } from './index.types'

// Props
const props = defineProps({
  columns: {
    type: Array<GridColumns>,
    defualt: () => [],
  },
  dataItems: {
    type: Array<any>,
    defualt: () => [],
  },
  customHeight: {
    type: Number,
    default: 0,
  },
})

// Data
const gridMargin = 16

// Computed
const calcHeight = (): string => {
  if (props.customHeight !== 0) {
    return props.customHeight - gridMargin + 'px'
  }
  return '100%'
}
</script>

<template>
  <div class="t-sticky-wrap" :style="{ height: calcHeight(), minHeight: '120px' }">
    <table class="t-sticky">
      <thead>
        <tr>
          <th class="t-header" v-for="(col, idx) in props.columns" :key="idx">{{ col.title }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIdx) in props.dataItems" :key="rowIdx">
          <td v-for="(col, colIdx) in props.columns" :key="colIdx">
            {{ row[col.field] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.t-sticky-wrap {
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.t-sticky {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.t-sticky td {
  padding: 10px 14px;
  color: #111111;
  border-bottom: 1px solid #eeeeee;
}

/* .t-sticky tr:last-child td {
  border-bottom: none;
} */

.t-sticky tr:hover td {
  background: #f5f5f5;
}

.t-header {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #ffffff;
  color: black;
  font-weight: bold;
  text-align: left;
  padding: 10px 14px;
  border-bottom: 1px solid #cccccc;
}
</style>
