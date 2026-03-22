<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export interface LineDataset {
  label: string
  data: number[]
  borderColor: string
  backgroundColor: string | CanvasGradient
  gradientFrom?: string
  gradientTo?: string
}

const props = defineProps<{
  labels: string[]
  datasets: LineDataset[]
  height?: number
}>()

const chartRef = ref<InstanceType<typeof Line> | null>(null)

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map(ds => ({
    ...ds,
    tension: 0.4,
    fill: true,
    pointRadius: 2,
    pointHoverRadius: 6,
    pointBackgroundColor: ds.borderColor,
    pointBorderColor: '#ffffff',
    pointBorderWidth: 2,
    borderWidth: 2.5
  }))
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index' as const
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#1e1e2d',
      padding: 14,
      titleFont: { size: 13, weight: '600' as const },
      bodyFont: { size: 12 },
      cornerRadius: 8,
      boxPadding: 6,
      usePointStyle: true
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      border: { display: false },
      grid: { color: 'rgba(0, 0, 0, 0.04)', drawBorder: false },
      ticks: {
        font: { size: 12 },
        padding: 8,
        color: '#a1a5b7'
      }
    },
    x: {
      border: { display: false },
      grid: { display: false },
      ticks: {
        font: { size: 11 },
        maxRotation: 0,
        autoSkipPadding: 20,
        color: '#a1a5b7'
      }
    }
  }
}
</script>

<template>
  <div :style="{ height: (height ?? 320) + 'px' }">
    <Line ref="chartRef" :data="chartData" :options="chartOptions" />
  </div>
</template>
