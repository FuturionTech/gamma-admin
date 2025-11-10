<template>
  <div class="row g-5 g-xl-8 mb-5 mb-xl-10">
    <!-- Total Engagement -->
    <div class="col-xl-4">
      <EnhancedAnalyticsCard
        title="Total Engagement"
        subtitle="Overall site performance"
        icon="ki-duotone ki-chart-line"
        color="success"
        :main-metric="totalRevenue"
        :growth-percentage="revenueGrowthPercentage"
        :secondary-metrics="[
          { label: 'This month', value: monthlyRevenue, type: 'currency' },
          { label: 'Previous month', value: previousRevenue, type: 'currency' },
          { label: 'Average per visitor', value: averageRevenuePerUser, type: 'currency' }
        ]"
      />
    </div>

    <!-- Conversion Rate -->
    <div class="col-xl-4">
      <EnhancedAnalyticsCard
        title="Conversion Rate"
        subtitle="Visitor to lead conversions"
        icon="ki-duotone ki-check-circle"
        color="primary"
        :main-metric="paymentSuccessRate"
        :secondary-metrics="[
          { label: 'Total visitors', value: totalPayments, type: 'number' },
          { label: 'Converted visitors', value: successfulPayments, type: 'number' },
          { label: 'Average time on site', value: averageTransactionAmount, type: 'currency' }
        ]"
      />
    </div>

    <!-- Traffic Sources -->
    <div class="col-xl-4">
      <EnhancedAnalyticsCard
        title="Traffic Sources"
        subtitle="Visitor origin distribution"
        icon="ki-duotone ki-abstract-39"
        color="warning"
        :main-metric="totalSubscriptions"
        :distribution-data="planDistributionData"
        :secondary-metrics="[
          { label: 'Active sources', value: activePlans, type: 'number' },
          { label: 'Top referrer traffic', value: subscriptionRevenue, type: 'currency' }
        ]"
      />
    </div>
  </div>
  
  <!-- Detailed Analytics Breakdown -->
  <div class="row g-5 g-xl-8 mb-5 mb-xl-10">
    <!-- Top Pages -->
    <div class="col-xl-6">
      <div class="card card-flush h-xl-100">
        <div class="card-header pt-7">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-gray-800">Top Pages</span>
            <span class="text-gray-500 mt-1 fw-semibold fs-6">Most viewed content</span>
          </h3>
        </div>
        <div class="card-body pt-6">
          <div v-if="paymentMethods && paymentMethods.length > 0">
            <div v-for="method in paymentMethods" :key="method.method"
                 class="d-flex align-items-center justify-content-between py-3">
              <div class="d-flex align-items-center">
                <div class="symbol symbol-35px me-3">
                  <span class="symbol-label bg-light-primary text-primary fw-bold">
                    {{ method.method.substring(0, 2).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <div class="text-gray-900 fw-bold fs-6">{{ method.method }}</div>
                  <div class="text-gray-500 fs-7">{{ method.count }} views</div>
                </div>
              </div>
              <div class="text-end">
                <div class="text-gray-900 fw-bold fs-6">{{ formatCurrency(method.totalAmount) }}</div>
                <div class="text-gray-500 fs-7">{{ method.percentage.toFixed(1) }}%</div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <div class="text-gray-500">No page data available</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Engagement Metrics -->
    <div class="col-xl-6">
      <div class="card card-flush h-xl-100">
        <div class="card-header pt-7">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-gray-800">Engagement Metrics</span>
            <span class="text-gray-500 mt-1 fw-semibold fs-6">User interaction data</span>
          </h3>
        </div>
        <div class="card-body pt-6">
          <div v-if="couponData">
            <!-- Total Engagement Score -->
            <div class="d-flex align-items-center mb-7">
              <div class="symbol symbol-45px me-5">
                <i class="ki-duotone ki-chart-pie-simple fs-2x text-danger">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
              </div>
              <div class="flex-grow-1">
                <span class="fs-2x fw-bold text-gray-900 me-2">
                  {{ formatCurrency(couponData.totalDiscountGiven) }}
                </span>
                <span class="badge badge-light-success fs-base">Score</span>
              </div>
            </div>

            <!-- Engagement Stats -->
            <div class="row">
              <div class="col-6">
                <div class="border border-gray-300 border-dashed rounded p-4 text-center mb-3">
                  <span class="fs-6 fw-bold text-gray-900">{{ couponData.totalCoupons }}</span>
                  <div class="text-gray-500 fs-7">Total Sessions</div>
                </div>
              </div>
              <div class="col-6">
                <div class="border border-gray-300 border-dashed rounded p-4 text-center mb-3">
                  <span class="fs-6 fw-bold text-gray-900">{{ couponData.activeCoupons }}</span>
                  <div class="text-gray-500 fs-7">Active Users</div>
                </div>
              </div>
              <div class="col-6">
                <div class="border border-gray-300 border-dashed rounded p-4 text-center">
                  <span class="fs-6 fw-bold text-gray-900">{{ couponData.totalUses }}</span>
                  <div class="text-gray-500 fs-7">Interactions</div>
                </div>
              </div>
              <div class="col-6">
                <div class="border border-gray-300 border-dashed rounded p-4 text-center">
                  <span class="fs-6 fw-bold text-gray-900">{{ couponData.averageDiscountPercentage.toFixed(1) }}%</span>
                  <div class="text-gray-500 fs-7">Engagement Rate</div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <div class="text-gray-500">No engagement data available</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EnhancedAnalyticsCard from './EnhancedAnalyticsCard.vue';
import type { PlatformStatistics, PaymentMethodMetric, CouponUsageMetric } from '../types';
import { formatCurrency as formatCurrencyUtil, formatFCFA, convertCurrency, type SupportedCurrency } from '../utils/currency';

interface Props {
  platformStatistics?: PlatformStatistics | null;
  paymentMethods?: PaymentMethodMetric[];
  couponData?: CouponUsageMetric | null;
  isLoading?: boolean;
  selectedCurrency?: SupportedCurrency;
}

const props = withDefaults(defineProps<Props>(), {
  platformStatistics: null,
  paymentMethods: () => [],
  couponData: null,
  isLoading: false,
  selectedCurrency: 'XOF'
});

// Format currency using centralized utility with currency conversion
const formatCurrency = (amount: number, compact: boolean = false): string => {
  // Convert amount to selected currency if needed
  const convertedAmount = props.selectedCurrency !== 'XOF' 
    ? convertCurrency(amount, 'XOF', props.selectedCurrency)
    : amount;
    
  if (props.selectedCurrency === 'XOF') {
    return compact ? formatFCFA(convertedAmount, true) : formatCurrencyUtil(convertedAmount, 'XOF');
  } else {
    return formatCurrencyUtil(convertedAmount, props.selectedCurrency);
  }
};

// Revenue metrics
const totalRevenue = computed(() => props.platformStatistics?.totalRevenue || 0);
const monthlyRevenue = computed(() => props.platformStatistics?.monthlyRevenue || 0);
const averageRevenuePerUser = computed(() => props.platformStatistics?.averageRevenuePerUser || 0);
const revenueGrowthPercentage = computed(() => props.platformStatistics?.revenueGrowth?.percentage || 0);
const previousRevenue = computed(() => props.platformStatistics?.revenueGrowth?.previous || 0);

// Payment metrics
const totalPayments = computed(() => props.platformStatistics?.totalPayments || 0);
const paymentSuccessRate = computed(() => `${props.platformStatistics?.paymentSuccessRate?.toFixed(1) || 0}%`);
const successfulPayments = computed(() => {
  const rate = props.platformStatistics?.paymentSuccessRate || 0;
  return Math.floor((totalPayments.value * rate) / 100);
});
const averageTransactionAmount = computed(() => {
  return totalPayments.value > 0 ? totalRevenue.value / totalPayments.value : 0;
});

// Subscription metrics
const totalSubscriptions = computed(() => props.platformStatistics?.totalSubscriptions || 0);
const activePlans = computed(() => props.platformStatistics?.planDistribution?.length || 0);
const subscriptionRevenue = computed(() => {
  return props.platformStatistics?.planDistribution?.reduce((sum, plan) => sum + plan.monthlyRevenue, 0) || 0;
});

// Plan distribution for chart
const planDistributionData = computed(() => {
  return props.platformStatistics?.planDistribution?.map(plan => ({
    label: plan.planName,
    value: plan.count,
    percentage: plan.percentage,
    color: plan.color
  })) || [];
});
</script>

<style scoped>
.symbol-label {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>