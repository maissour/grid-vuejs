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
  { name: 'Alice Johnson', age: 28, occupation: 'Software Engineer' },
  { name: 'Brian Smith', age: 34, occupation: 'Teacher' },
  { name: 'Catherine Brown', age: 41, occupation: 'Doctor' },
  { name: 'David Wilson', age: 25, occupation: 'Graphic Designer' },
  { name: 'Emma Davis', age: 30, occupation: 'Accountant' },
  { name: 'Frank Miller', age: 45, occupation: 'Architect' },
  { name: 'Grace Taylor', age: 27, occupation: 'Nurse' },
  { name: 'Henry Anderson', age: 38, occupation: 'Lawyer' },
  { name: 'Isabella Thomas', age: 29, occupation: 'Marketing Manager' },
  { name: 'Jack Moore', age: 32, occupation: 'Electrician' },
  { name: 'Karen Martin', age: 36, occupation: 'Pharmacist' },
  { name: 'Liam Jackson', age: 24, occupation: 'Data Analyst' },
  { name: 'Mia White', age: 31, occupation: 'HR Specialist' },
  { name: 'Nathan Harris', age: 42, occupation: 'Civil Engineer' },
  { name: 'Olivia Clark', age: 26, occupation: 'Journalist' },
  { name: 'Peter Lewis', age: 39, occupation: 'Police Officer' },
  { name: 'Quinn Walker', age: 33, occupation: 'Web Developer' },
  { name: 'Rachel Hall', age: 37, occupation: 'Project Manager' },
  { name: 'Samuel Allen', age: 44, occupation: 'Chef' },
  { name: 'Taylor Young', age: 23, occupation: 'Student' },
  { name: 'Uma King', age: 35, occupation: 'Research Scientist' },
  { name: 'Victor Scott', age: 40, occupation: 'Mechanical Engineer' },
  { name: 'Wendy Green', age: 29, occupation: 'Financial Analyst' },
  { name: 'Xavier Adams', age: 27, occupation: 'Photographer' },
  { name: 'Yasmine Baker', age: 32, occupation: 'UX Designer' },
  { name: 'Zachary Nelson', age: 46, occupation: 'Pilot' },
  { name: 'Ava Carter', age: 21, occupation: 'Receptionist' },
  { name: 'Benjamin Perez', age: 43, occupation: 'Business Consultant' },
  { name: 'Chloe Roberts', age: 28, occupation: 'Dentist' },
  { name: 'Daniel Evans', age: 37, occupation: 'Cybersecurity Specialist' },
]
</script>

<template>
  <main>
    <GridTable :columns="columns" :dataItems="dataItems" :customHeight="500" />
  </main>
</template>
