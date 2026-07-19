<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import { SortDirection, type GridColumns, type SortState } from './index.types'

// Emits
const emits = defineEmits(['selectedRows', 'sortChange'])

// Props
const props = defineProps({
  columns: {
    type: Array<GridColumns>,
    defualt: () => [],
  },
  dataItems: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
  },
  rowId: {
    type: String,
    default: 'id',
  },
  customHeight: {
    type: Number,
    default: 0,
  },
})

// Data
const gridMargin = 16
const currentSelection = ref<Record<string, any>[]>([])
const sortState = ref<SortState[]>([])

// Computed
const calcHeight = (): string => {
  if (props.customHeight !== 0) {
    return props.customHeight - gridMargin + 'px'
  }
  return '100%'
}

const selectedRowClass = (dataItem: Record<string, any>): string => {
  const index = currentSelection.value.findIndex((x) => x[props.rowId] == dataItem[props.rowId])
  if (index != -1) {
    return 'selectedRow'
  }
  return ''
}

const computeTotalRows = (): string => {
  if (props.dataItems.length > 0) {
    return props.dataItems.length + ' total rows'
  }
  return ''
}

const computeSelection = (): string => {
  if (currentSelection.value.length == 1) {
    return '1 selected row'
  }

  if (currentSelection.value.length > 1) {
    return currentSelection.value.length + ' selected rows'
  }
  return ''
}

const getDirectionClass = (field: string): string => {
  const col = sortState.value.find((x) => x.field == field)
  if (col) {
    if (col.direction == SortDirection.ascending) {
      return 'fa-solid fa-arrow-up'
    } else if (col.direction == SortDirection.descending) {
      return 'fa-solid fa-arrow-down'
    }
  }
  return ''
}

const sortedDataItems = computed(() => {
  if (sortState.value.length === 0) {
    return props.dataItems
  }

  return [...props.dataItems].sort((a, b) => {
    for (const sort of sortState.value) {
      const aVal = a[sort.field]
      const bVal = b[sort.field]

      const comparison = compareValues(a[sort.field], b[sort.field])
      if (comparison !== 0) {
        return sort.direction === SortDirection.ascending ? comparison : -comparison
      }
    }
    return 0
  })
})

// Methods
const selectionChange = (event: PointerEvent, dataItem: Record<string, any>) => {
  const index = currentSelection.value.findIndex((x) => x[props.rowId] == dataItem[props.rowId])
  if (event.ctrlKey) {
    if (index == -1) {
      currentSelection.value.push(dataItem)
    } else {
      currentSelection.value = currentSelection.value.filter(
        (x) => x[props.rowId] != dataItem[props.rowId],
      )
    }
  }

  if (event.shiftKey) {
    if (index == -1) {
      currentSelection.value.push(dataItem)
    }
    if (currentSelection.value.length == 2) {
      const firstSelection = props.dataItems.findIndex(
        (x) => x[props.rowId] == currentSelection.value[0]![props.rowId],
      )
      const secondSelection = props.dataItems.findIndex(
        (x) => x[props.rowId] == currentSelection.value[1]![props.rowId],
      )
      const startIdx = Math.min(firstSelection, secondSelection)
      const endIdx = Math.max(firstSelection, secondSelection)
      const betweenDataItems = props.dataItems.slice(startIdx + 1, endIdx)
      currentSelection.value = currentSelection.value.concat(betweenDataItems)
    }
  }

  if (!event.ctrlKey && !event.shiftKey) {
    const index = currentSelection.value.findIndex((x) => x[props.rowId] == dataItem[props.rowId])
    if (index == -1) {
      currentSelection.value = [dataItem]
    }
  }

  emits('selectedRows', currentSelection.value)
}

const sortList = (event: PointerEvent, field: string) => {
  const col = sortState.value.find((x) => x.field == field)
  if (col) {
    if (col.direction === SortDirection.ascending) {
      col.direction = SortDirection.descending
    } else if (col.direction === SortDirection.descending) {
      sortState.value = sortState.value.filter((x) => x.field != field)
    }
  } else {
    const colSort: SortState = {
      field: field,
      direction: SortDirection.ascending,
    }
    sortState.value.push(colSort)
  }
  emits('sortChange', sortState.value)
}

// Helpers
const compareValues = (aVal: any, bVal: any): number => {
  // Dates (Date objects or ISO/parseable date strings)
  if (aVal instanceof Date && bVal instanceof Date) {
    return aVal.getTime() - bVal.getTime()
  }

  // Numbers
  if (typeof aVal === 'number' && typeof bVal === 'number') {
    return aVal - bVal
  }

  // Strings — locale-aware, case-insensitive alphabetical
  if (typeof aVal === 'string' && typeof bVal === 'string') {
    return aVal.localeCompare(bVal, undefined, { sensitivity: 'base' })
  }

  // Fallback
  if (aVal < bVal) return -1
  if (aVal > bVal) return 1
  return 0
}
</script>

<template>
  <div class="selectionRows">
    <span>{{ computeSelection() }}</span>
    <span>{{ computeTotalRows() }}</span>
  </div>
  <div class="t-sticky-wrap" :style="{ height: calcHeight(), minHeight: '120px' }">
    <table class="t-sticky">
      <thead>
        <tr>
          <th
            class="t-header"
            v-for="(col, idx) in props.columns"
            :key="idx"
            @click="sortList($event, col.field)"
          >
            <span>{{ col.title }}</span>
            <span class="spaceInLeft" :class="getDirectionClass(col.field)"></span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIdx) in sortedDataItems"
          :class="selectedRowClass(row)"
          @click="selectionChange($event, row)"
          :key="rowIdx"
        >
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

.t-sticky tr:hover td {
  background: #f5f5f5;
}

.t-sticky tbody td {
  user-select: none;
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

.t-header:hover {
  cursor: pointer;
}

.selectionRows {
  display: flex;
  justify-content: space-between;
  height: 30px;
  font-size: 12.5px;
  color: #46468a;
  font-weight: 500;
  padding-inline: 0.3rem;
}

.selectedRow {
  background-color: aqua;
}

.spaceInLeft {
  margin-left: 0.5em;
}
</style>
