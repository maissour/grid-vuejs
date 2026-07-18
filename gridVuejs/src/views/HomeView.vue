<script setup lang="ts">
import GridTable from '@/components/grid/GridTable.vue'
import type { GridColumns } from '@/components/grid/index.types'

// Data
const columns: GridColumns[] = [
  {
    title: 'name',
    field: 'name',
  },
  {
    title: 'age',
    field: 'age',
  },
  {
    title: 'occupation',
    field: 'occupation',
  },
]

const dataItems = [
  { id: 1, name: 'Alice Johnson', age: 28, occupation: 'Software Engineer' },
  { id: 2, name: 'Brian Smith', age: 34, occupation: 'Teacher' },
  { id: 3, name: 'Catherine Brown', age: 41, occupation: 'Doctor' },
  { id: 4, name: 'David Wilson', age: 25, occupation: 'Graphic Designer' },
  { id: 5, name: 'Emma Davis', age: 30, occupation: 'Accountant' },
  { id: 6, name: 'Frank Miller', age: 45, occupation: 'Architect' },
  { id: 7, name: 'Grace Taylor', age: 27, occupation: 'Nurse' },
  { id: 8, name: 'Henry Anderson', age: 38, occupation: 'Lawyer' },
  { id: 9, name: 'Isabella Thomas', age: 29, occupation: 'Marketing Manager' },
  { id: 10, name: 'Jack Moore', age: 32, occupation: 'Electrician' },
  { id: 11, name: 'Karen Martin', age: 36, occupation: 'Pharmacist' },
  { id: 12, name: 'Liam Jackson', age: 24, occupation: 'Data Analyst' },
  { id: 13, name: 'Mia White', age: 31, occupation: 'HR Specialist' },
  { id: 14, name: 'Nathan Harris', age: 42, occupation: 'Civil Engineer' },
  { id: 15, name: 'Olivia Clark', age: 26, occupation: 'Journalist' },
  { id: 16, name: 'Peter Lewis', age: 39, occupation: 'Police Officer' },
  { id: 17, name: 'Quinn Walker', age: 33, occupation: 'Web Developer' },
  { id: 18, name: 'Rachel Hall', age: 37, occupation: 'Project Manager' },
  { id: 19, name: 'Samuel Allen', age: 44, occupation: 'Chef' },
  { id: 20, name: 'Taylor Young', age: 23, occupation: 'Student' },
  { id: 21, name: 'Uma King', age: 35, occupation: 'Research Scientist' },
  { id: 22, name: 'Victor Scott', age: 40, occupation: 'Mechanical Engineer' },
  { id: 23, name: 'Wendy Green', age: 29, occupation: 'Financial Analyst' },
  { id: 24, name: 'Xavier Adams', age: 27, occupation: 'Photographer' },
  { id: 25, name: 'Yasmine Baker', age: 32, occupation: 'UX Designer' },
  { id: 26, name: 'Zachary Nelson', age: 46, occupation: 'Pilot' },
  { id: 27, name: 'Ava Carter', age: 21, occupation: 'Receptionist' },
  { id: 28, name: 'Benjamin Perez', age: 43, occupation: 'Business Consultant' },
  { id: 29, name: 'Chloe Roberts', age: 28, occupation: 'Dentist' },
  { id: 30, name: 'Daniel Evans', age: 37, occupation: 'Cybersecurity Specialist' },
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
      @selectedRows="selectedRows"
    />
  </main>
</template>
