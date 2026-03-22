<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = withDefaults(defineProps<{
  labels: string[]
  data: number[]
  colors?: string[]
  centerText?: string
  centerSubtext?: string
  height?: number
}>(), {
  height: 300
})

const defaultColors = [
  '#8b5cf6',
  '#3b82f6',
  '#059669',
  '#d97706',
  '#dc2626',
  '#6366f1'
]

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.data,
      backgroundColor: props.colors ?? defaultColors.slice(0, props.data.length),
      borderWidth: 3,
      borderColor: '#ffffff',
      hoverOffset: 8
    }
  ]
}))

const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart: ChartJS) {
    if (!props.centerText) return

    const { ctx, width, height } = chart
    ctx.save()

    // Main number
    ctx.font = 'bold 22px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#181c32'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const centerX = width / 2
    const centerY = height / 2 - (props.centerSubtext ? 8 : 0)
    ctx.fillText(props.centerText, centerX, centerY)

    // Subtext
    if (props.centerSubtext) {
      ctx.font = '500 12px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#a1a5b7'
      ctx.fillText(props.centerSubtext, centerX, centerY + 22)
    }

    ctx.restore()
  }
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 16,
        font: { size: 12 },
        color: '#7e8299'
      }
    },
    tooltip: {
      backgroundColor: '#1e1e2d',
      padding: 12,
      cornerRadius: 8,
      boxPadding: 4,
      callbacks: {
        label: (context: { parsed: number; label: string; dataset: { data: number[] } }) => {
          const value = context.parsed
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
          return ` ${context.label}: ${value.toLocaleString()} (${percentage}%)`
        }
      }
    }
  }
}
</script>

<template>
  <div :style="{ height: height + 'px' }">
    <Doughnut :data="chartData" :options="chartOptions" :plugins="[centerTextPlugin]" />
  </div>
</template>
