<script setup lang="ts">
import GridTable from '@/components/grid/GridTable.vue'
import type { GridColumns } from '@/components/grid/index.types'
import { dataItems } from './data'

// Data
const columns: GridColumns[] = [
  {
    title: 'name',
    field: 'name',
    filterable: true,
  },
  {
    title: 'age',
    field: 'age',
    filterable: true,
  },
  {
    title: 'occupation',
    field: 'occupation',
    filterable: true,
  },
  {
    title: 'city',
    field: 'city',
    filterable: true,
  },
  {
    title: 'country',
    field: 'country',
    filterable: true,
  },
  {
    title: 'postalCode',
    field: 'postalCode',
    filterable: true,
  },
  {
    title: 'address',
    field: 'address',
    filterable: true,
  },
  {
    title: 'phoneNumber',
    field: 'phoneNumber',
    filterable: true,
  },
  {
    title: 'createdAt',
    field: 'createdAt',
    filterable: true,
  },
  {
    title: 'createdBy',
    field: 'createdBy',
    filterable: true,
  },
  {
    title: 'modifiedAt',
    field: 'modifiedAt',
    filterable: true,
  },
  {
    title: 'modifiedBy',
    field: 'modifiedBy',
    filterable: true,
  },
]

// Methods
const selectedRows = (selectedData: any[]) => {}
</script>

<template>
  <main>
    <GridTable
      :columns="columns"
      :dataItems="dataItems"
      :rowId="'id'"
      :customHeight="500"
      :filterable="true"
      :groupable="true"
      @selectedRows="selectedRows"
    />
  </main>
</template>
