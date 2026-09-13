<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import {
  SortDirection,
  type FilterState,
  type GridColumns,
  type GroupState,
  type SortState,
} from './index.types'

// Emits
const emits = defineEmits(['selectedRows', 'sortChange', 'filterChange', 'groupChange'])

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
  filterable: {
    type: Boolean,
    default: false,
  },
  groupable: {
    type: Boolean,
    default: false,
  },
})

// Data
const gridMargin = 16
const currentSelection = ref<Record<string, any>[]>([])
const sortState = ref<SortState[]>([])
const filterState = ref<FilterState[]>([])
const groupeState = ref<GroupState[]>([])
const isDragging = ref(false)
const isDragOver = ref(false)
const isCollapsed = ref(false)
const draggedColTitle = ref('')
const dragX = ref(0)
const dragY = ref(0)
const transparentImg = new Image()
const isGrouped = computed(() => groupeState.value.length > 0)
const collapsedGroups = ref<Set<string>>(new Set())
transparentImg.src =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

// Computed
const calcHeight = (): string => {
  if (props.customHeight !== 0) {
    return props.customHeight - gridMargin + 'px'
  }
  return '100%'
}

const capitalizeTitleCol = (colname: string): string => {
  if (!colname) return colname
  return colname.charAt(0).toUpperCase() + colname.slice(1)
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
      return 'fa-solid fa-chevron-up'
    } else if (col.direction == SortDirection.descending) {
      return 'fa-solid fa-chevron-down'
    }
  }
  return ''
}

const getCollapseClassIcon = (collapsed: boolean): string => {
  return collapsed ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-down'
}

const toggleCollapse = (groupKey: string) => {
  if (collapsedGroups.value.has(groupKey)) {
    collapsedGroups.value.delete(groupKey)
  } else {
    collapsedGroups.value.add(groupKey)
  }
  collapsedGroups.value = new Set(collapsedGroups.value)
  console.log('collapsedGroups :', collapsedGroups.value)
}

const isGroupCollapsed = (groupKey: string): boolean => {
  return collapsedGroups.value.has(groupKey)
}

const getFilterValue = (field: string): string => {
  return filterState.value.find((f) => f.field === field)?.value ?? ''
}

const groupData = (data: Record<string, any>[], fields: string[]) => {
  return data.reduce(
    (groups, item) => {
      const key = fields.map((field) => `${field} : ${item[field]}`).join(' | ')
      if (!groups[key]) groups[key] = []
      groups[key].push(item)
      return groups
    },
    {} as Record<string, any[]>,
  )
}

const localDataItem = computed(() => {
  let data: Record<string, any>[] = props.dataItems
  // Filter
  if (filterState.value.length > 0) {
    data = data.filter((item) =>
      filterState.value.every((filter) => {
        const cellValue = item[filter.field]
        if (cellValue == null) return false
        return String(cellValue).toLowerCase().includes(filter.value.toLowerCase())
      }),
    )
  }
  // Sort
  if (sortState.value.length > 0) {
    data = [...data].sort((a, b) => {
      for (const sort of sortState.value) {
        const comparison = compareValues(a[sort.field], b[sort.field])
        if (comparison !== 0) {
          return sort.direction === SortDirection.ascending ? comparison : -comparison
        }
      }
      return 0
    })
  }
  // Group
  if (groupeState.value.length > 0) {
    const fields = groupeState.value.map((g) => g.field)
    return groupData(data, fields)
  }
  return data
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

  if (event.shiftKey && currentSelection.value.length == 1) {
    if (index == -1) {
      currentSelection.value.push(dataItem)
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

const setFilterValue = (field: string, value: string) => {
  const existing = filterState.value.find((f) => f.field === field)
  if (existing) {
    if (value === '') {
      filterState.value = filterState.value.filter((f) => f.field !== field)
    } else {
      existing.value = value
    }
  } else if (value !== '') {
    filterState.value.push({ field, value })
  }
  emits('filterChange', filterState.value)
}

const onHeaderDragStart = (event: DragEvent, col: GridColumns) => {
  event.dataTransfer?.setData(
    'application/json',
    JSON.stringify({ field: col.field, title: col.title }),
  )
  event.dataTransfer!.effectAllowed = 'move'
  event.dataTransfer?.setDragImage(transparentImg, 0, 0)

  draggedColTitle.value = col.title
  dragX.value = event.clientX + 12
  dragY.value = event.clientY + 12
  document.addEventListener('dragover', onDocumentDragOver)
  isDragging.value = true
}

const onDocumentDragOver = (event: DragEvent) => {
  event.preventDefault()
  dragX.value = event.clientX + 12
  dragY.value = event.clientY + 12
}

const onHeaderDragEnd = () => {
  isDragging.value = false
  isDragOver.value = false
  document.removeEventListener('dragover', onDocumentDragOver)
}

const onGroupDragOver = () => {
  isDragOver.value = true
}

const onGroupDragLeave = () => {
  isDragOver.value = false
}

const onGroupDrop = (event: DragEvent) => {
  isDragOver.value = false
  isDragging.value = false
  const data = event.dataTransfer?.getData('application/json')
  if (!data) return

  const dropped: GroupState = JSON.parse(data)
  const alreadyGrouped = groupeState.value.some((g) => g.field === dropped.field)
  if (!alreadyGrouped) {
    groupeState.value.push(dropped)
  }
  emits('sortChange', groupeState.value)
}

const removeGroup = (field: string) => {
  groupeState.value = groupeState.value.filter((g) => g.field !== field)
}

// Helpers
const compareValues = (aVal: any, bVal: any): number => {
  if (aVal instanceof Date && bVal instanceof Date) {
    return aVal.getTime() - bVal.getTime()
  }

  if (typeof aVal === 'number' && typeof bVal === 'number') {
    return aVal - bVal
  }

  if (typeof aVal === 'string' && typeof bVal === 'string') {
    return aVal.localeCompare(bVal, undefined, { sensitivity: 'base' })
  }

  if (aVal < bVal) return -1
  if (aVal > bVal) return 1
  return 0
}
</script>

<template>
  <div
    v-if="isDragging"
    class="t-drag-ghost"
    :class="{ 't-drag-ghost-over-zone': isDragOver }"
    :style="{ left: dragX + 'px', top: dragY + 'px' }"
  >
    <i :class="isDragOver ? 'fa-solid fa-circle-plus' : 'fa-regular fa-circle-xmark'"></i>
    <span>{{ draggedColTitle }}</span>
  </div>
  <div class="selectionRows">
    <span>{{ computeSelection() }}</span>
    <span>{{ computeTotalRows() }}</span>
  </div>
  <div class="t-sticky-wrap" :style="{ height: calcHeight(), minHeight: '120px' }">
    <div
      class="t-group-container"
      v-if="groupable"
      :class="{ 't-group-container-drag-over': isDragOver }"
      @dragover.prevent="onGroupDragOver"
      @dragleave="onGroupDragLeave"
      @drop.prevent="onGroupDrop"
    >
      <div v-if="groupeState.length === 0" class="t-group-placeholder">
        Drag a column here to group
      </div>
      <span v-for="(group, idx) in groupeState" :key="idx" class="t-group-chip">
        {{ capitalizeTitleCol(group.title) }}
        <button class="t-group-chip-remove" @click="removeGroup(group.field)">×</button>
      </span>
    </div>
    <table class="t-sticky">
      <thead>
        <tr>
          <th
            class="t-header"
            v-for="(col, idx) in props.columns"
            :key="idx"
            draggable="true"
            @dragstart="onHeaderDragStart($event, col)"
            @drag=""
            @dragend="onHeaderDragEnd"
            @click="sortList($event, col.field)"
          >
            <span>{{ capitalizeTitleCol(col.title) }}</span>
            <span class="spaceInLeft" :class="getDirectionClass(col.field)"></span>
          </th>
        </tr>
        <tr class="t-filter-row" v-if="props.filterable">
          <th v-for="(col, idx) in props.columns" :key="idx">
            <input
              class="t-filter-input"
              type="text"
              :value="getFilterValue(col.field)"
              @input="setFilterValue(col.field, ($event.target as HTMLInputElement).value)"
              v-if="col.filterable == true"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- grouped mode -->
        <template v-if="isGrouped">
          <template v-for="(groupRows, groupKey) in localDataItem" :key="groupKey">
            <tr class="group-row">
              <td :colspan="props.columns?.length">
                <span
                  :class="getCollapseClassIcon(isGroupCollapsed(groupKey as string))"
                  @click="toggleCollapse(groupKey as string)"
                ></span>
                <p class="group-label">{{ capitalizeTitleCol(groupKey as string) }}</p>
              </td>
            </tr>
            <tr
              v-for="(row, rowIdx) in groupRows"
              :key="rowIdx"
              :class="[
                selectedRowClass(row),
                isGroupCollapsed(groupKey as string) ? 'hideElement' : '',
              ]"
              @click="selectionChange($event, row)"
            >
              <td v-for="(col, colIdx) in props.columns" :key="colIdx">
                {{ row[col.field] }}
              </td>
            </tr>
          </template>
        </template>

        <!-- flat mode -->
        <template v-else>
          <tr
            v-for="(row, rowIdx) in localDataItem"
            :key="rowIdx"
            :class="selectedRowClass(row)"
            @click="selectionChange($event, row)"
          >
            <td v-for="(col, colIdx) in props.columns" :key="colIdx">
              {{ row[col.field] }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
@import url('@/assets/style.css');
</style>
