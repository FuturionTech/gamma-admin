<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">

          <!-- ───── Hero Welcome Strip ───── -->
          <section class="gn-hero mb-6">
            <div class="gn-hero__glow" aria-hidden="true"></div>
            <div class="gn-hero__body d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-5">
              <div class="d-flex align-items-center">
                <div class="gn-hero__avatar me-4">
                  <span>{{ userInitials || 'GN' }}</span>
                </div>
                <div>
                  <div class="gn-hero__eyebrow">{{ todayLabel }}</div>
                  <h1 class="gn-hero__title mb-1">
                    {{ greeting }}<template v-if="firstName">, {{ firstName }}</template>
                  </h1>
                  <div class="gn-hero__subtitle">
                    <template v-if="userEmail">
                      {{ userEmail }}
                      <span v-if="primaryRoleLabel" class="gn-hero__role">{{ primaryRoleLabel }}</span>
                    </template>
                    <template v-else>
                      Gamma Neutral Consulting · Content & Operations Hub
                    </template>
                  </div>
                </div>
              </div>

              <div class="gn-hero__actions d-flex align-items-center gap-2">
                <button
                  type="button"
                  class="btn btn-sm gn-btn-glass"
                  :disabled="loading"
                  @click="refreshData"
                >
                  <i class="ki-duotone ki-arrows-circle fs-3 me-1">
                    <span class="path1"></span><span class="path2"></span>
                  </i>
                  <span>{{ loading ? 'Refreshing…' : 'Refresh' }}</span>
                </button>
                <NuxtLink to="/analytics" class="btn btn-sm gn-btn-primary">
                  <i class="ki-duotone ki-chart-line-up fs-3 me-1">
                    <span class="path1"></span><span class="path2"></span>
                  </i>
                  View Analytics
                </NuxtLink>
                <NuxtLink to="/logout" class="btn btn-sm gn-btn-ghost" aria-label="Sign out">
                  <i class="ki-duotone ki-exit-right fs-3 me-1">
                    <span class="path1"></span><span class="path2"></span>
                  </i>
                  Sign out
                </NuxtLink>
              </div>
            </div>
          </section>

          <!-- ───── Error State ───── -->
          <div v-if="error" class="alert alert-danger d-flex align-items-center p-5 mb-10">
            <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
              <span class="path1"></span><span class="path2"></span><span class="path3"></span>
            </i>
            <div>
              <h4 class="mb-1 text-dark">Dashboard Error</h4>
              <span>{{ error }}</span>
            </div>
          </div>

          <!-- ───── Loading State ───── -->
          <DashboardSkeleton v-else-if="loading && !counts" />

          <!-- ───── Main Dashboard Content ───── -->
          <template v-else-if="counts">

            <!-- Quick Insights Strip -->
            <div class="row g-5 g-xl-6 mb-6">
              <div class="col-xl-3 col-md-6">
                <div class="gn-insight gn-insight--primary">
                  <div class="gn-insight__icon">
                    <i class="ki-duotone ki-setting-2 fs-2x">
                      <span class="path1"></span><span class="path2"></span>
                    </i>
                  </div>
                  <div>
                    <div class="gn-insight__value">{{ counts.services + counts.solutions }}</div>
                    <div class="gn-insight__label">Active Offerings</div>
                    <div class="gn-insight__hint">{{ counts.services }} services · {{ counts.solutions }} solutions</div>
                  </div>
                </div>
              </div>

              <div class="col-xl-3 col-md-6">
                <div class="gn-insight gn-insight--info">
                  <div class="gn-insight__icon">
                    <i class="ki-duotone ki-book fs-2x">
                      <span class="path1"></span><span class="path2"></span>
                      <span class="path3"></span><span class="path4"></span>
                    </i>
                  </div>
                  <div>
                    <div class="gn-insight__value">{{ counts.blogPosts }}</div>
                    <div class="gn-insight__label">Blog Articles</div>
                    <div class="gn-insight__hint">{{ blogSubtitle || '—' }}</div>
                  </div>
                </div>
              </div>

              <div class="col-xl-3 col-md-6">
                <div class="gn-insight gn-insight--success">
                  <div class="gn-insight__icon">
                    <i class="ki-duotone ki-people fs-2x">
                      <span class="path1"></span><span class="path2"></span>
                      <span class="path3"></span><span class="path4"></span>
                      <span class="path5"></span>
                    </i>
                  </div>
                  <div>
                    <div class="gn-insight__value">{{ counts.team + counts.clients + counts.partners }}</div>
                    <div class="gn-insight__label">People in Network</div>
                    <div class="gn-insight__hint">{{ counts.team }} team · {{ counts.clients }} clients · {{ counts.partners }} partners</div>
                  </div>
                </div>
              </div>

              <div class="col-xl-3 col-md-6">
                <div class="gn-insight gn-insight--warning">
                  <div class="gn-insight__icon">
                    <i class="ki-duotone ki-sms fs-2x">
                      <span class="path1"></span><span class="path2"></span>
                    </i>
                  </div>
                  <div>
                    <div class="gn-insight__value">{{ counts.contactRequests }}</div>
                    <div class="gn-insight__label">Contact Requests</div>
                    <div class="gn-insight__hint">{{ contactSubtitle || 'No new inquiries' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section: Content -->
            <div class="d-flex flex-wrap align-items-end justify-content-between mb-4">
              <div>
                <h2 class="gn-section-title mb-1">Content library</h2>
                <div class="gn-section-subtitle">All published assets across the Gamma Neutral site</div>
              </div>
              <NuxtLink to="/blog/list" class="btn btn-sm btn-light-primary">Manage content</NuxtLink>
            </div>

            <div class="row g-5 g-xl-6 mb-6 mb-xl-10">
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Services" :count="counts.services" icon="ki-duotone ki-setting-2" color="#7239EA" link="/services/list" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Solutions" :count="counts.solutions" icon="ki-duotone ki-abstract-26" color="#17C653" link="/solutions/list" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Blog Posts" :count="counts.blogPosts" icon="ki-duotone ki-book" color="#009EF7" link="/blog/list" :subtitle="blogSubtitle" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Projects" :count="counts.projects" icon="ki-duotone ki-briefcase" color="#F1416C" link="/projects/list" />
              </div>
            </div>

            <!-- Section: Operations -->
            <div class="d-flex flex-wrap align-items-end justify-content-between mb-4">
              <div>
                <h2 class="gn-section-title mb-1">Operations & People</h2>
                <div class="gn-section-subtitle">Team, clients, partners and customer engagement</div>
              </div>
              <NuxtLink to="/contact-requests" class="btn btn-sm btn-light-primary">Review inquiries</NuxtLink>
            </div>

            <div class="row g-5 g-xl-6 mb-6 mb-xl-10">
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Team Members" :count="counts.team" icon="ki-duotone ki-people" color="#FFC700" link="/team/list" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Clients" :count="counts.clients" icon="ki-duotone ki-user-tick" color="#7239EA" link="/clients" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Partners" :count="counts.partners" icon="ki-duotone ki-handshake" color="#17C653" link="/partners" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Contact Requests" :count="counts.contactRequests" icon="ki-duotone ki-sms" color="#009EF7" link="/contact-requests" :subtitle="contactSubtitle" />
              </div>
            </div>

            <div class="row g-5 g-xl-6 mb-6 mb-xl-10">
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Testimonials" :count="counts.testimonials" icon="ki-duotone ki-like" color="#F1416C" link="/testimonials" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Certifications" :count="counts.certifications" icon="ki-duotone ki-shield-tick" color="#FFC700" link="/certifications" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="FAQs" :count="counts.faqs" icon="ki-duotone ki-question" color="#7239EA" link="/faqs/list" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Job Positions" :count="counts.jobPositions" icon="ki-duotone ki-rocket" color="#17C653" link="/careers" :subtitle="jobSubtitle" />
              </div>
            </div>

            <!-- Section: Taxonomy -->
            <div class="row g-5 g-xl-6 mb-6 mb-xl-10">
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Industries" :count="counts.industries" icon="ki-duotone ki-bank" color="#50CD89" link="/industries" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Process Steps" :count="counts.processSteps" icon="ki-duotone ki-chart" color="#009EF7" link="/process-steps" />
              </div>
              <div class="col-xl-6 d-none d-xl-block">
                <NuxtLink to="/analytics" class="gn-cta-card">
                  <div>
                    <div class="gn-cta-card__eyebrow">Explore</div>
                    <div class="gn-cta-card__title">Power Analytics Dashboard</div>
                    <div class="gn-cta-card__subtitle">Visitors, traffic sources, funnels and country insights in real time.</div>
                  </div>
                  <i class="ki-duotone ki-arrow-right fs-2x">
                    <span class="path1"></span><span class="path2"></span>
                  </i>
                </NuxtLink>
              </div>
            </div>

            <!-- Recent Activity Row -->
            <div class="row g-5 g-xl-6 mb-6 mb-xl-10">
              <!-- Recent Contact Requests -->
              <div class="col-xl-6">
                <div class="card card-flush h-xl-100 border-0 shadow-sm">
                  <div class="card-header pt-7">
                    <h3 class="card-title align-items-start flex-column">
                      <span class="card-label fw-bold text-gray-900 fs-4">Recent Contact Requests</span>
                      <span class="text-gray-500 mt-1 fw-semibold fs-7">Latest inquiries from clients</span>
                    </h3>
                    <div class="card-toolbar">
                      <NuxtLink to="/contact-requests" class="btn btn-sm btn-light-primary">View all</NuxtLink>
                    </div>
                  </div>
                  <div class="card-body pt-4">
                    <div v-if="recentContacts.length === 0" class="text-center text-muted py-10">
                      <i class="ki-duotone ki-inbox fs-3x text-gray-300 d-block mb-3">
                        <span class="path1"></span><span class="path2"></span>
                      </i>
                      No contact requests yet
                    </div>
                    <div v-else class="gn-timeline">
                      <div
                        v-for="contact in recentContacts"
                        :key="contact.id"
                        class="d-flex align-items-center py-3 border-bottom border-gray-100"
                      >
                        <div class="symbol symbol-45px me-4">
                          <span class="symbol-label bg-light-primary text-primary fw-bolder fs-5">
                            {{ (contact.first_name?.[0] || '') + (contact.last_name?.[0] || '') }}
                          </span>
                        </div>
                        <div class="flex-grow-1">
                          <span class="text-gray-900 fw-bold d-block fs-6">
                            {{ contact.first_name }} {{ contact.last_name }}
                          </span>
                          <span class="text-gray-500 fw-semibold d-block fs-7 text-truncate" style="max-width: 240px;">
                            {{ contact.subject || contact.email }}
                          </span>
                        </div>
                        <span
                          class="badge fs-8"
                          :class="contactStatusClass(contact.status)"
                        >
                          {{ contact.status }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recent Blog Posts -->
              <div class="col-xl-6">
                <div class="card card-flush h-xl-100 border-0 shadow-sm">
                  <div class="card-header pt-7">
                    <h3 class="card-title align-items-start flex-column">
                      <span class="card-label fw-bold text-gray-900 fs-4">Recent Blog Posts</span>
                      <span class="text-gray-500 mt-1 fw-semibold fs-7">Latest articles on the Gamma site</span>
                    </h3>
                    <div class="card-toolbar">
                      <NuxtLink to="/blog/list" class="btn btn-sm btn-light-primary">View all</NuxtLink>
                    </div>
                  </div>
                  <div class="card-body pt-4">
                    <div v-if="recentPosts.length === 0" class="text-center text-muted py-10">
                      <i class="ki-duotone ki-book fs-3x text-gray-300 d-block mb-3">
                        <span class="path1"></span><span class="path2"></span>
                        <span class="path3"></span><span class="path4"></span>
                      </i>
                      No blog posts yet
                    </div>
                    <div v-else>
                      <div
                        v-for="post in recentPosts"
                        :key="post.id"
                        class="d-flex align-items-center py-3 border-bottom border-gray-100"
                      >
                        <div class="symbol symbol-45px me-4">
                          <span class="symbol-label bg-light-info text-info fw-bold">
                            <i class="ki-duotone ki-book fs-3">
                              <span class="path1"></span><span class="path2"></span>
                              <span class="path3"></span><span class="path4"></span>
                            </i>
                          </span>
                        </div>
                        <div class="flex-grow-1 text-truncate" style="min-width: 0;">
                          <NuxtLink :to="`/blog/edit/${post.id}`" class="text-gray-900 fw-bold d-block fs-6 text-hover-primary text-truncate">
                            {{ post.title }}
                          </NuxtLink>
                          <span class="text-gray-500 fw-semibold d-block fs-7">
                            {{ post.view_count }} views
                          </span>
                        </div>
                        <span
                          class="badge fs-8"
                          :class="post.status === 'published' ? 'badge-light-success' : 'badge-light-warning'"
                        >
                          {{ post.status }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="card card-flush border-0 shadow-sm mb-6">
              <div class="card-header pt-7">
                <h3 class="card-title align-items-start flex-column">
                  <span class="card-label fw-bold text-gray-900 fs-4">Quick Actions</span>
                  <span class="text-gray-500 mt-1 fw-semibold fs-7">Jump straight into the most common tasks</span>
                </h3>
              </div>
              <div class="card-body pt-4">
                <div class="row g-5">
                  <div class="col-lg-3 col-md-6">
                    <NuxtLink to="/blog/create" class="gn-quick-action">
                      <div class="gn-quick-action__icon bg-light-primary text-primary">
                        <i class="ki-duotone ki-book fs-2x">
                          <span class="path1"></span><span class="path2"></span>
                          <span class="path3"></span><span class="path4"></span>
                        </i>
                      </div>
                      <div>
                        <div class="fw-bold fs-6 text-gray-900">New Blog Post</div>
                        <div class="fs-7 text-gray-500">Write a new article</div>
                      </div>
                    </NuxtLink>
                  </div>
                  <div class="col-lg-3 col-md-6">
                    <NuxtLink to="/projects/create" class="gn-quick-action">
                      <div class="gn-quick-action__icon bg-light-success text-success">
                        <i class="ki-duotone ki-briefcase fs-2x">
                          <span class="path1"></span><span class="path2"></span>
                        </i>
                      </div>
                      <div>
                        <div class="fw-bold fs-6 text-gray-900">New Project</div>
                        <div class="fs-7 text-gray-500">Add a case study</div>
                      </div>
                    </NuxtLink>
                  </div>
                  <div class="col-lg-3 col-md-6">
                    <NuxtLink to="/team/create" class="gn-quick-action">
                      <div class="gn-quick-action__icon bg-light-warning text-warning">
                        <i class="ki-duotone ki-people fs-2x">
                          <span class="path1"></span><span class="path2"></span>
                          <span class="path3"></span><span class="path4"></span>
                          <span class="path5"></span>
                        </i>
                      </div>
                      <div>
                        <div class="fw-bold fs-6 text-gray-900">Add Team Member</div>
                        <div class="fs-7 text-gray-500">Grow the team</div>
                      </div>
                    </NuxtLink>
                  </div>
                  <div class="col-lg-3 col-md-6">
                    <NuxtLink to="/contact-requests" class="gn-quick-action">
                      <div class="gn-quick-action__icon bg-light-danger text-danger">
                        <i class="ki-duotone ki-sms fs-2x">
                          <span class="path1"></span><span class="path2"></span>
                        </i>
                      </div>
                      <div>
                        <div class="fw-bold fs-6 text-gray-900">Contact Requests</div>
                        <div class="fs-7 text-gray-500">View incoming inquiries</div>
                      </div>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </template>

        </div>
      </div>
    </div>

    <!-- Footer -->
    <div id="kt_app_footer" class="app-footer">
      <div class="app-container container-fluid d-flex flex-column flex-md-row flex-center flex-md-stack py-3">
        <div class="text-gray-900 order-2 order-md-1">
          <span class="text-muted fw-semibold me-1">{{ currentYear }}&copy;</span>
          <a href="https://futurion.tech" target="_blank" class="text-gray-800 text-hover-primary">Futurion</a>
        </div>
        <div class="text-muted fw-semibold order-1 order-md-2 fs-7">
          Gamma Neutral Consulting · Admin Console
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import { useDashboardData } from '../composables/useDashboardData'
import { useCurrentUser } from '~/composables/useCurrentUser'
import DashboardSkeleton from '../components/DashboardSkeleton.vue'
import MetricCard from '../components/metrics/MetricCard.vue'

definePageMeta({
  middleware: 'auth',
})

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.setBreadcrumb([{ title: 'Dashboard', path: '/' }])

const currentYear = computed(() => new Date().getFullYear())

const {
  user,
  fullName,
  initials,
  primaryRole,
} = useCurrentUser()

const firstName = computed(() => {
  if (fullName.value) return fullName.value.split(' ')[0]
  if (user.value?.first_name) return user.value.first_name
  return ''
})

const userInitials = computed(() => initials.value || '')
const userEmail = computed(() => user.value?.email || '')
const primaryRoleLabel = computed(() => primaryRole.value?.display_name || primaryRole.value?.name || '')

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

const todayLabel = computed(() => {
  try {
    return new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return ''
  }
})

const {
  loading,
  error,
  counts,
  blogBreakdown,
  jobBreakdown,
  recentContacts,
  recentPosts,
  fetchDashboardData,
} = useDashboardData()

const blogSubtitle = computed(() => {
  if (!blogBreakdown.value) return ''
  return `${blogBreakdown.value.published} published · ${blogBreakdown.value.draft} draft`
})

const jobSubtitle = computed(() => {
  if (!jobBreakdown.value) return ''
  return `${jobBreakdown.value.active} open · ${jobBreakdown.value.closed} closed`
})

const contactSubtitle = computed(() => {
  if (!recentContacts.value.length) return ''
  const newCount = recentContacts.value.filter((c: any) => c.status === 'new').length
  return newCount > 0 ? `${newCount} new` : ''
})

const contactStatusClass = (status: string) => {
  const map: Record<string, string> = {
    new: 'badge-light-primary',
    in_progress: 'badge-light-warning',
    resolved: 'badge-light-success',
  }
  return map[status] || 'badge-light-secondary'
}

const refreshData = async () => {
  await fetchDashboardData()
}

onMounted(async () => {
  await fetchDashboardData()
})
</script>

<style scoped>
/* ── Hero ───────────────────────────────────────────── */
.gn-hero {
  position: relative;
  overflow: hidden;
  border-radius: 1.25rem;
  padding: 1.75rem 1.75rem;
  color: #fff;
  background: linear-gradient(135deg, #0b0b16 0%, #12121f 45%, #1d1833 100%);
  box-shadow: 0 24px 48px -24px rgba(139, 92, 246, 0.35);
}

.gn-hero__glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 85% 20%, rgba(139, 92, 246, 0.45), transparent 55%),
    radial-gradient(circle at 10% 110%, rgba(59, 130, 246, 0.25), transparent 55%);
}

.gn-hero__body {
  position: relative;
  z-index: 1;
}

.gn-hero__avatar {
  width: 64px;
  height: 64px;
  border-radius: 1rem;
  background: linear-gradient(135deg, #8b5cf6 0%, #4338ca 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: 0 12px 28px -12px rgba(139, 92, 246, 0.6);
}

.gn-hero__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 600;
}

.gn-hero__title {
  font-size: 1.9rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
}

.gn-hero__subtitle {
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.gn-hero__role {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: rgba(139, 92, 246, 0.2);
  color: #c4b5fd;
  border: 1px solid rgba(139, 92, 246, 0.35);
}

.gn-btn-glass,
.gn-btn-ghost {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 0.6rem;
  padding: 0.5rem 0.9rem;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
}

.gn-btn-glass:hover,
.gn-btn-ghost:hover {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  transform: translateY(-1px);
}

.gn-btn-primary {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: #fff;
  border: 0;
  border-radius: 0.6rem;
  padding: 0.5rem 0.95rem;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
  box-shadow: 0 10px 24px -14px rgba(139, 92, 246, 0.8);
}

.gn-btn-primary:hover {
  transform: translateY(-1px);
  color: #fff;
  box-shadow: 0 14px 28px -14px rgba(139, 92, 246, 0.85);
}

/* ── Insight Cards ──────────────────────────────────── */
.gn-insight {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem 1.25rem;
  background: #fff;
  border-radius: 1rem;
  border: 1px solid #edf1f5;
  box-shadow: 0 8px 20px -12px rgba(15, 23, 42, 0.08);
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.gn-insight:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px -12px rgba(15, 23, 42, 0.12);
}

.gn-insight__icon {
  width: 52px;
  height: 52px;
  border-radius: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.gn-insight__value {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.1;
  color: #121519;
  letter-spacing: -0.02em;
}

.gn-insight__label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #576071;
  margin-top: 0.15rem;
}

.gn-insight__hint {
  font-size: 0.75rem;
  color: #858c97;
  margin-top: 0.25rem;
}

.gn-insight--primary .gn-insight__icon { background: rgba(139, 92, 246, 0.12); color: #7239ea; }
.gn-insight--info .gn-insight__icon { background: rgba(59, 130, 246, 0.12); color: #3b82f6; }
.gn-insight--success .gn-insight__icon { background: rgba(5, 150, 105, 0.12); color: #059669; }
.gn-insight--warning .gn-insight__icon { background: rgba(217, 119, 6, 0.12); color: #d97706; }

/* ── Section titles ─────────────────────────────────── */
.gn-section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #121519;
  letter-spacing: -0.01em;
}

.gn-section-subtitle {
  font-size: 0.8rem;
  color: #858c97;
  font-weight: 500;
}

/* ── CTA Card ───────────────────────────────────────── */
.gn-cta-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  height: 100%;
  min-height: 140px;
  padding: 1.5rem 1.75rem;
  border-radius: 1rem;
  overflow: hidden;
  color: #fff;
  text-decoration: none;
  background: linear-gradient(135deg, #0b0b16 0%, #1d1833 55%, #382773 100%);
  box-shadow: 0 20px 40px -24px rgba(139, 92, 246, 0.45);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.gn-cta-card:hover {
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 24px 48px -24px rgba(139, 92, 246, 0.55);
}

.gn-cta-card__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 600;
}

.gn-cta-card__title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-top: 0.35rem;
  letter-spacing: -0.01em;
}

.gn-cta-card__subtitle {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.35rem;
  max-width: 420px;
}

/* ── Quick action tile ──────────────────────────────── */
.gn-quick-action {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 0.9rem;
  background: #f6f9fc;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.gn-quick-action:hover {
  transform: translateY(-2px);
  background: #fff;
  border-color: rgba(139, 92, 246, 0.25);
  box-shadow: 0 14px 28px -18px rgba(15, 23, 42, 0.18);
}

.gn-quick-action__icon {
  width: 56px;
  height: 56px;
  border-radius: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ── Dark mode tweaks ───────────────────────────────── */
:global([data-bs-theme='dark']) .gn-insight {
  background: #1b1d22;
  border-color: #2a2c34;
}

:global([data-bs-theme='dark']) .gn-insight__value {
  color: #f6f9fc;
}

:global([data-bs-theme='dark']) .gn-quick-action {
  background: #1b1d22;
}

:global([data-bs-theme='dark']) .gn-quick-action:hover {
  background: #22252c;
}
</style>
