<script setup lang="ts">
import GridTable from '@/components/grid/GridTable.vue'
import type { GridColumns } from '@/components/grid/index.types'

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
  },
  {
    title: 'occupation',
    field: 'occupation',
    filterable: true,
  },
]

const dataItems = [
  { id: 1, name: 'Alice Johnson', age: 28, occupation: 'Software Engineer' },
  { id: 2, name: 'Brian Smith', age: 28, occupation: 'Teacher' },
  { id: 3, name: 'Catherine Brown', age: 41, occupation: 'Doctor' },
  { id: 4, name: 'David Wilson', age: 32, occupation: 'Graphic Designer' },
  { id: 5, name: 'Emma Davis', age: 30, occupation: 'Accountant' },
  { id: 6, name: 'Frank Miller', age: 45, occupation: 'Architect' },
  { id: 7, name: 'Grace Taylor', age: 30, occupation: 'Nurse' },
  { id: 8, name: 'Henry Anderson', age: 38, occupation: 'Lawyer' },
  { id: 9, name: 'Isabella Thomas', age: 29, occupation: 'Marketing Manager' },
  { id: 10, name: 'Jack Moore', age: 32, occupation: 'Electrician' },
  { id: 11, name: 'Karen Martin', age: 32, occupation: 'Pharmacist' },
  { id: 12, name: 'Liam Jackson', age: 24, occupation: 'Data Analyst' },
  { id: 13, name: 'Mia White', age: 31, occupation: 'HR Specialist' },
  { id: 14, name: 'Nathan Harris', age: 29, occupation: 'Civil Engineer' },
  { id: 15, name: 'Olivia Clark', age: 26, occupation: 'Journalist' },
  { id: 16, name: 'Peter Lewis', age: 39, occupation: 'Police Officer' },
  { id: 17, name: 'Quinn Walker', age: 32, occupation: 'Web Developer' },
  { id: 18, name: 'Rachel Hall', age: 29, occupation: 'Project Manager' },
  { id: 19, name: 'Samuel Allen', age: 39, occupation: 'Chef' },
  { id: 20, name: 'Taylor Young', age: 23, occupation: 'Student' },
  { id: 21, name: 'Uma King', age: 28, occupation: 'Research Scientist' },
  { id: 22, name: 'Victor Scott', age: 40, occupation: 'Mechanical Engineer' },
  { id: 23, name: 'Wendy Green', age: 30, occupation: 'Financial Analyst' },
  { id: 24, name: 'Xavier Adams', age: 28, occupation: 'Photographer' },
  { id: 25, name: 'Yasmine Baker', age: 32, occupation: 'UX Designer' },
  { id: 26, name: 'Zachary Nelson', age: 39, occupation: 'Pilot' },
  { id: 27, name: 'Ava Carter', age: 23, occupation: 'Receptionist' },
  { id: 28, name: 'Benjamin Perez', age: 39, occupation: 'Business Consultant' },
  { id: 29, name: 'Chloe Roberts', age: 28, occupation: 'Dentist' },
  { id: 30, name: 'Daniel Evans', age: 37, occupation: 'Cybersecurity Specialist' },
  { id: 31, name: 'Ethan Collins', age: 27, occupation: 'Backend Developer' },
  { id: 32, name: 'Fiona Stewart', age: 34, occupation: 'Biologist' },
  { id: 33, name: 'George Sanchez', age: 43, occupation: 'Business Analyst' },
  { id: 34, name: 'Hannah Morris', age: 25, occupation: 'Content Writer' },
  { id: 35, name: 'Ian Rogers', age: 36, occupation: 'Network Engineer' },
  { id: 36, name: 'Julia Reed', age: 33, occupation: 'Interior Designer' },
  { id: 37, name: 'Kevin Cook', age: 44, occupation: 'Financial Advisor' },
  { id: 38, name: 'Laura Morgan', age: 27, occupation: 'Veterinarian' },
  { id: 39, name: 'Matthew Bell', age: 35, occupation: 'Database Administrator' },
  { id: 40, name: 'Nora Murphy', age: 30, occupation: 'Architect' },
  { id: 41, name: 'Oscar Bailey', age: 42, occupation: 'Sales Manager' },
  { id: 42, name: 'Paula Rivera', age: 26, occupation: 'Fashion Designer' },
  { id: 43, name: 'Robert Cooper', age: 31, occupation: 'DevOps Engineer' },
  { id: 44, name: 'Sofia Richardson', age: 24, occupation: 'Social Worker' },
  { id: 45, name: 'Thomas Cox', age: 37, occupation: 'Electrical Engineer' },
  { id: 46, name: 'Victoria Howard', age: 34, occupation: 'Product Manager' },
  { id: 47, name: 'William Ward', age: 29, occupation: 'Photographer' },
  { id: 48, name: 'Zoe Torres', age: 40, occupation: 'Medical Researcher' },
  { id: 49, name: 'Andrew Peterson', age: 33, occupation: 'Systems Administrator' },
  { id: 50, name: 'Bella Gray', age: 28, occupation: 'Event Planner' },
  { id: 51, name: 'Christopher Ramirez', age: 45, occupation: 'Construction Manager' },
  { id: 52, name: 'Diana James', age: 32, occupation: 'Business Developer' },
  { id: 53, name: 'Edward Watson', age: 38, occupation: 'Machine Learning Engineer' },
  { id: 54, name: 'Samantha Brooks', age: 27, occupation: 'Public Relations Specialist' },
  { id: 55, name: 'Jonathan Kelly', age: 41, occupation: 'Civil Engineer' },
  { id: 56, name: 'Claire Sanders', age: 23, occupation: 'Graphic Artist' },
  { id: 57, name: 'Richard Price', age: 35, occupation: 'Operations Manager' },
  { id: 58, name: 'Natalie Bennett', age: 30, occupation: 'Software Tester' },
  { id: 59, name: 'Stephen Wood', age: 43, occupation: 'Project Engineer' },
  { id: 60, name: 'Emily Barnes', age: 26, occupation: 'Digital Marketer' },
  { id: 61, name: 'Radu Istonia', age: 43, occupation: 'Senior Developer' },
  { id: 62, name: 'Ionut Swarze', age: 37, occupation: 'Senior Developer' },
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
