<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps<{
  labels: string[]
  data: number[]
  label?: string
  color?: string
}>()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.label ?? 'Count',
      data: props.data,
      backgroundColor: props.color ?? 'rgba(0, 158, 247, 0.7)',
      borderColor: props.color ?? '#009EF7',
      borderWidth: 1,
      borderRadius: 4,
      maxBarThickness: 40
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      cornerRadius: 8
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: { drawBorder: false, color: 'rgba(0, 0, 0, 0.04)' },
      ticks: { font: { size: 12 } }
    },
    y: {
      grid: { display: false },
      ticks: { font: { size: 12 } }
    }
  }
}
</script>

<template>
  <div style="height: 300px">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
