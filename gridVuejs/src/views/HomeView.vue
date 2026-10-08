<script setup lang="ts">
import GridTable from '@/components/grid/GridTable.vue'
import type { GridColumns } from '@/components/grid/index.types'
import { dataItems } from './data'

// Data
const columns: GridColumns[] = [
  {
    title: 'id',
    field: 'id',
    hidden: true,
    filterable: false,
  },
  {
    title: 'name',
    field: 'name',
    filterable: true,
  },
  {
    title: 'age',
    field: 'age',
    filterable: true,
    filterCell: 'dropDownlistFilter',
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
    title: 'postal Code',
    field: 'postalCode',
    filterable: true,
  },
  {
    title: 'address',
    field: 'address',
    filterable: true,
  },
  {
    title: 'phone Number',
    field: 'phoneNumber',
    filterable: true,
  },
  {
    title: 'created At',
    field: 'createdAt',
    filterable: true,
    format: 'MM/dd/yyyy',
    filterCell: 'dateFilter',
  },
  {
    title: 'created By',
    field: 'createdBy',
    filterable: true,
  },
  {
    title: 'modified At',
    field: 'modifiedAt',
    filterable: true,
    format: 'MM/dd/yyyy',
    filterCell: 'dateFilter',
  },
  {
    title: 'modified By',
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
