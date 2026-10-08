<script setup lang="ts">
import type { Component } from 'vue'
import { computed, ref, type PropType } from 'vue'
import {
  SortDirection,
  type DisplayItem,
  type FilterState,
  type GridColumns,
  type GroupItem,
  type GroupState,
  type IdTextDto,
  type PageState,
  type RowItem,
  type SortState,
} from './index.types'
import { formatDateDynamic, ISO_DATE } from '.'
import dateFilterTemplate from './templates/dateFilterTemplate.vue'
import dropDownlistTemplate from './templates/dropDownlistTemplate.vue'
import textFilterTemplate from './templates/textFilterTemplate.vue'

// Emits
const emits = defineEmits([
  'selectedRows',
  'sortChange',
  'filterChange',
  'groupChange',
  'pageChange',
])

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
  isClientSort: {
    type: Boolean,
    default: true,
  },
  isClientFilter: {
    type: Boolean,
    default: true,
  },
})

// Data
const dateFilterTemplateSlot = 'dateFilter'
const dropdownListFilterTemplateSlot = 'dropDownlistFilter'
const textFilterTemplateSlot = 'textFilter'
const defaultSelection = 'All'
const gridMargin = 16
const maxVisiblePageNumber = 3
const currentSelection = ref<Record<string, any>[]>([])
const sortState = ref<SortState[]>([])
const filterState = ref<FilterState[]>([])
const groupeState = ref<GroupState[]>([])
const pageSizes = [
  { text: 10, value: 10 },
  { text: 20, value: 20 },
  { text: 50, value: 50 },
  { text: 100, value: 100 },
]
const isDragging = ref(false)
const isDragOver = ref(false)
const disablePrevPage = ref(false)
const disableNextPage = ref(false)
const disableFirstPage = ref(false)
const disableLastPage = ref(false)
const draggedColTitle = ref('')
const dragX = ref(0)
const dragY = ref(0)
const pageSize = ref(pageSizes[0]?.value as number)
const selectedPage = ref(1)
const pageState = ref<PageState>({ skip: 0, take: pageSize.value })
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

const displayCell = (col: GridColumns, row: any): string => {
  const value = row[col.field]

  if (!col.format) return value ?? ''

  const isDateLike = value instanceof Date || (typeof value === 'string' && ISO_DATE.test(value))
  if (!isDateLike) return value ?? ''

  const date = new Date(value)
  if (isNaN(date.getTime())) return String(value)

  return formatDateDynamic(date, col.format)
}

const selectedRowClass = (dataItem: Record<string, any>): string => {
  const index = currentSelection.value.findIndex((x) => x[props.rowId] == dataItem[props.rowId])
  if (index != -1) {
    return 'selectedRow'
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
}

const isGroupCollapsed = (groupKey: string): boolean => {
  return collapsedGroups.value.has(groupKey)
}

const getFilterValue = (field: string): string => {
  return filterState.value.find((f) => f.field === field)?.value ?? ''
}

const groupData = (
  data: Record<string, any>[],
  fields: string[],
  level = 0,
  ancestors: string[] = [],
): DisplayItem[] => {
  if (level >= fields.length) {
    return data.map((row) => ({ type: 'row', row, ancestors }))
  }

  const field = fields[level]

  const groups = new Map<any, Record<string, any>[]>()
  data.forEach((item) => {
    const value = item[field as string]
    if (!groups.has(value)) groups.set(value, [])
    groups.get(value)!.push(item)
  })

  const result: DisplayItem[] = []
  groups.forEach((items, value) => {
    const label = `${field} : ${value}`
    const parentKey = ancestors[ancestors.length - 1]
    const key = parentKey ? `${parentKey} | ${label}` : label

    result.push({ type: 'group', key, label, level, ancestors })
    result.push(...groupData(items, fields, level + 1, [...ancestors, key]))
  })

  return result
}

const localDataItem = computed(() => {
  let data: Record<string, any>[] = props.dataItems

  // Filter
  if (filterState.value.length > 0 && props.filterable && props.isClientFilter) {
    data = data.filter((item) =>
      filterState.value.every((filter) => {
        const cellValue = item[filter.field]
        if (cellValue == null) return false
        return String(cellValue).toLowerCase().includes(filter.value.toLowerCase())
      }),
    )
  }

  // Sort
  if (sortState.value.length > 0 && props.isClientSort) {
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
  if (groupeState.value.length > 0 && props.groupable) {
    const fields = groupeState.value.map((g) => g.field)

    const ordered = groupData(data, fields)
      .filter((i): i is RowItem => i.type === 'row')
      .map((i) => i.row)

    const pageRows = ordered.slice(pageState.value.skip, pageState.value.take)
    const result = groupData(pageRows, fields)
    return result
  }

  data = data.slice(pageState.value.skip, pageState.value.take)

  return data
})

const groupedItems = computed(() => localDataItem.value as DisplayItem[])

const isGroupItem = (item: DisplayItem): item is GroupItem => item.type === 'group'

const computeTotalRows = (): string => {
  if (filterState.value.length > 0 && props.filterable && props.isClientFilter) {
    const rowsCount = localDataItem.value.filter(
      (item: Record<string, any>) => item.type !== 'group',
    ).length
    return rowsCount + ' total rows'
  } else {
    return props.dataItems.length + ' total rows'
  }
}

const pageCount = computed(() => {
  if (filterState.value.length > 0 && props.filterable && props.isClientFilter) {
    return Math.ceil(localDataItem.value.length / pageSize.value)
  } else {
    return Math.ceil(props.dataItems.length / pageSize.value)
  }
})

const visiblePages = computed(() => {
  let rangeArray = Array.from({ length: pageCount.value }, (_, i) => i + 1)
  let pages = []
  const start = Math.floor((selectedPage.value - 1) / maxVisiblePageNumber) * maxVisiblePageNumber
  const end = start + maxVisiblePageNumber
  pages = rangeArray.slice(start, end)
  return pages
})

// Methods
const baseProps = (col: GridColumns) => ({
  field: col.field,
  value: getFilterValue(col.field),
})

const getDateFilterProps = (col: GridColumns) => ({
  templateProps: {
    ...baseProps(col),
    format: col.format as string,
    onChange: (v: any) => setFilterValue(col.field, v),
  },
})

const dropdownListItems = (col: GridColumns): IdTextDto[] => {
  if (props.dataItems.length === 0) {
    return []
  }

  const uniqueValues = new Set(
    props.dataItems
      .map((item: any) => item[col.field])
      .filter((v: any) => v !== null && v !== undefined && v !== ''),
  )
  const all: IdTextDto = { id: 0, text: defaultSelection }
  let list = Array.from(uniqueValues)
    .sort()
    .map((value: any, idx: number) => ({
      id: idx + 1,
      text: String(value),
    }))
  list.unshift(all)
  return list
}

const getDropdownFilterProps = (col: GridColumns) => ({
  templateProps: {
    ...baseProps(col),
    onChange: (v: any) => setFilterValue(col.field, v),
    dataItemList: dropdownListItems(col),
  },
})

const getTextFilterProps = (col: GridColumns) => ({
  templateProps: {
    ...baseProps(col),
    onChange: (v: any) => setFilterValue(col.field, v),
  },
})

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
    if (value === '' || value == defaultSelection) {
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
  emits('groupChange', groupeState.value)
}

const removeGroup = (field: string) => {
  groupeState.value = groupeState.value.filter((g) => g.field !== field)
}

const selectPage = (pageNumber: number) => {
  selectedPage.value = pageNumber
  pageState.value = {
    skip: pageSize.value * (pageNumber - 1),
    take: pageSize.value * pageNumber,
  }

  emits('pageChange', { pageState: pageState.value, pageNumber })
}

const nextPage = () => {
  const pageNumber = selectedPage.value + 1

  if (pageNumber > pageCount.value) {
    disableNextPage.value = true
    disableLastPage.value = true
    return
  }
  selectPage(pageNumber)
  disablePrevPage.value = false
  disableFirstPage.value = false
}

const previousPage = () => {
  const pageNumber = selectedPage.value - 1
  if (pageNumber <= 0) {
    disablePrevPage.value = true
    return
  }
  selectPage(pageNumber)
  disableNextPage.value = false
  disableLastPage.value = false
}

const lastPage = () => {
  if (disableLastPage.value) {
    return
  }
  selectPage(pageCount.value)
  disableNextPage.value = true
  disableLastPage.value = true
  disablePrevPage.value = false
  disableFirstPage.value = false
}

const firstPage = () => {
  if (disableFirstPage.value) {
    return
  }
  selectPage(1)
  disablePrevPage.value = true
  disableFirstPage.value = true
  disableNextPage.value = false
  disableLastPage.value = false
}

const onPageChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  pageSize.value = Number(value)
  selectPage(1)
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
  <div class="t-sticky-wrap" :style="{ height: calcHeight(), minHeight: '120px' }">
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
            <template v-if="col.filterable">
              <dateFilterTemplate
                v-if="col.filterCell == dateFilterTemplateSlot"
                :templateProps="getDateFilterProps(col).templateProps"
              />

              <dropDownlistTemplate
                v-if="col.filterCell == dropdownListFilterTemplateSlot"
                :templateProps="getDropdownFilterProps(col).templateProps"
              />

              <textFilterTemplate
                v-if="col.filterCell == textFilterTemplateSlot || col.filterCell == undefined"
                :templateProps="getTextFilterProps(col).templateProps"
              />
            </template>
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- grouped mode -->
        <template v-if="isGrouped">
          <template v-for="(item, idx) in groupedItems" :key="idx">
            <template v-if="!item.ancestors.some((k) => isGroupCollapsed(k))">
              <!-- group row -->
              <tr v-if="isGroupItem(item)" class="group-row">
                <td :colspan="props.columns?.length">
                  <div class="group-row-label" :style="{ paddingLeft: item.level * 20 + 'px' }">
                    <span
                      :class="getCollapseClassIcon(isGroupCollapsed(item.key))"
                      @click="toggleCollapse(item.key)"
                    ></span>
                    <p class="group-label">{{ capitalizeTitleCol(item.label) }}</p>
                  </div>
                </td>
              </tr>

              <!-- data row -->
              <tr
                v-else
                :class="selectedRowClass(item.row)"
                @click="selectionChange($event, item.row)"
              >
                <td v-for="(col, colIdx) in props.columns" :key="colIdx">
                  {{ displayCell(col, item.row) }}
                </td>
              </tr>
            </template>
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
              {{ displayCell(col, row) }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
  <div class="t-footer-container">
    <div class="t-footer-pagination">
      <span
        class="fa-solid fa-angles-left"
        @click="firstPage"
        :class="disableFirstPage || selectedPage == 1 ? 't-disable-change-page' : 't-change-page'"
      ></span>
      <span
        class="fa-solid fa-angle-left"
        @click="previousPage"
        :class="disablePrevPage || selectedPage == 1 ? 't-disable-change-page' : 't-change-page'"
      ></span>
      <div class="t-page-number">
        <div
          class="t-page-number-item"
          :class="selectedPage == n ? 't-page-number-item-selected' : ''"
          v-for="n in visiblePages"
          :key="n"
          @click="selectPage(n)"
        >
          {{ n }}
        </div>
      </div>
      <span
        class="fa-solid fa-angle-right"
        @click="nextPage"
        :class="
          disableNextPage || selectedPage == pageCount ? 't-disable-change-page' : 't-change-page'
        "
      ></span>
      <span
        class="fa-solid fa-angles-right"
        @click="lastPage"
        :class="
          disableLastPage || selectedPage == pageCount ? 't-disable-change-page' : 't-change-page'
        "
      ></span>
    </div>
    <div class="t-page-size-container">
      <select
        class="t-page-size"
        name="pageSize"
        id="pageSize"
        @change="onPageChange"
        :value="pageSize"
      >
        <option v-for="size in pageSizes" :value="size.value">{{ size.text }}</option>
      </select>
      <span>items per page</span>
    </div>
  </div>
</template>

<style scoped>
@import url('@/assets/style.css');
</style>
