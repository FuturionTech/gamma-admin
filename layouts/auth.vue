<template>
  <div class="d-flex flex-column flex-root min-h-100vh" id="kt_app_root">
    <div class="d-flex flex-column flex-lg-row flex-column-fluid">
      <!-- Colonne visuelle --------------------------------------------------->
      <div class="d-flex flex-lg-row-fluid w-lg-50 hero-bg position-relative overflow-hidden">
        <!-- Vagues animées -->
        <div class="wave wave1"></div>
        <div class="wave wave2"></div>
        
        <!-- Éléments décoratifs -->
        <div class="hero-pattern"></div>
        <div class="animated-gradient"></div>
        <span class="shape shape-1"></span>
        <span class="shape shape-2"></span>
        <span class="shape shape-3"></span>
        
        <!-- Particles -->
        <div class="particles-container">
          <div class="particle particle-1"></div>
          <div class="particle particle-2"></div>
          <div class="particle particle-3"></div>
          <div class="particle particle-4"></div>
          <div class="particle particle-5"></div>
        </div>
        
        <!-- Effet de lumière -->
        <div class="light-effect"></div>
        
        <div class="d-flex flex-column flex-center p-6 p-lg-10 w-100 text-center">
          <!-- Logo avec effet -->
          <div class="logo-frame mb-7 mt-5 slide-in-top">
            <div class="logo-border"></div>
            <NuxtLink to="/" class="logo-link">
              <img
                src="/assets/media/logos/logo.png"
                alt="Gamma Neutral Consulting logo"
                class="h-80px h-lg-150px logo-hover"
              />
            </NuxtLink>
          </div>

          <!-- Contenu avec typographie améliorée -->
          <div class="hero-content mb-5 px-lg-10">
            <div class="brand-container">
              <h1 class="text-white fs-1 fs-lg-2qx fw-bolder glowing-text slide-in-bottom">
                <span class="text-shadow">Gamma Neutral Consulting</span>
              </h1>
              <div class="brand-line"></div>
            </div>

            <p class="text-white fs-base fs-lg-4 fw-medium lh-lg mb-0 slide-in-bottom" style="animation-delay: 0.3s">
              <span class="text-emphasis">Your Data Solutions</span><br class="d-none d-lg-block">
              Empowering businesses to harness the full potential of their data
            </p>
            <div class="tagline-container mt-4 slide-in-bottom" style="animation-delay: 0.5s">
              <p class="text-white fw-medium fs-base bg-glass py-2 px-4 d-inline-block rounded-pill">
                <span class="tag-highlight">Analyze.</span> <span class="tag-highlight">Optimize.</span> <span class="tag-highlight">Succeed.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Colonne formulaire -------------------------------------------------->
      <div class="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10">
        <div class="d-flex flex-center flex-column flex-lg-row-fluid">
          <div class="w-lg-500px p-10">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* --- Background and patterns ----------------------------------------- */
.hero-bg {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 35%, #c084fc 65%, #f3e8ff 100%);
  position: relative;
  z-index: 0;
}

.hero-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.4;
  z-index: -1;
}

.animated-gradient {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.1) 25%, rgba(192, 132, 252, 0.05) 50%, rgba(243, 232, 255, 0) 70%);
  z-index: -1;
  animation: pulse-gradient 15s ease-in-out infinite alternate;
}

/* Wave animation */
.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.3-200 0.7-250 49.3-394.5 49.3v31.8h800v-31.8z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E");
  background-size: 800px 100px;
  background-repeat: repeat-x;
  z-index: 1;
}

.wave1 {
  animation: wave-animation 20s linear infinite;
  z-index: 2;
  opacity: 0.5;
  bottom: 0;
  height: 80px;
}

.wave2 {
  animation: wave-animation 15s linear reverse infinite;
  z-index: 1;
  opacity: 0.3;
  bottom: 10px;
  height: 60px;
}

@keyframes wave-animation {
  0% { background-position-x: 0; }
  100% { background-position-x: 800px; }
}

/* Light effect */
.light-effect {
  position: absolute;
  top: 20%;
  left: 40%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  filter: blur(30px);
  opacity: 0.6;
  z-index: 0;
  animation: light-pulse 10s ease-in-out infinite alternate;
}

@keyframes light-pulse {
  0% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.2); }
  100% { opacity: 0.4; transform: scale(1); }
}

@keyframes pulse-gradient {
  0% { transform: scale(1) rotate(0deg); opacity: 0.5; }
  50% { transform: scale(1.1) rotate(5deg); opacity: 0.7; }
  100% { transform: scale(1) rotate(0deg); opacity: 0.5; }
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: float 18s ease-in-out infinite;
  z-index: 0;
}

.shape-1 {
  width: 500px;
  height: 500px;
  background: #8b5cf6;
  top: -150px;
  left: -120px;
}

.shape-2 {
  width: 400px;
  height: 400px;
  background: #7c3aed;
  bottom: -100px;
  right: -120px;
  animation-delay: 3s;
}

.shape-3 {
  width: 250px;
  height: 250px;
  background: #c084fc;
  top: 40%;
  left: 20%;
  animation-delay: 6s;
  opacity: 0.2;
}

/* Particles */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float-particle 15s linear infinite;
}

.particle-1 {
  top: 20%;
  left: 20%;
  width: 4px;
  height: 4px;
}

.particle-2 {
  top: 70%;
  left: 10%;
  width: 6px;
  height: 6px;
  animation-delay: 2s;
  animation-duration: 25s;
}

.particle-3 {
  top: 40%;
  left: 60%;
  width: 8px;
  height: 8px;
  animation-delay: 4s;
  animation-duration: 20s;
}

.particle-4 {
  top: 80%;
  left: 40%;
  width: 5px;
  height: 5px;
  animation-delay: 6s;
}

.particle-5 {
  top: 30%;
  left: 80%;
  width: 3px;
  height: 3px;
  animation-delay: 8s;
  animation-duration: 30s;
}

@keyframes float-particle {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-30vh) translateX(20vw); opacity: 0; }
}

.shape-3 {
  width: 300px;
  height: 300px;
  background: #c084fc;
  top: 50%;
  left: 30%;
  animation-delay: 6s;
}

.floating-badge {
  position: absolute;
  top: 40px;
  right: 40px;
  animation: float-badge 6s ease-in-out infinite;
  z-index: 10;
}

.badge-premium {
  background: linear-gradient(45deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1px;
  box-shadow: 0 5px 15px rgba(124, 58, 237, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 2;
}

/* --- Logo effects and animations ------------------------------------ */
.logo-container {
  position: relative;
  display: inline-block;
}

.logo-link {
  display: inline-block;
  position: relative;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.logo-hover {
  transition: transform 0.3s ease-out;
}

.logo-hover:hover {
  transform: translateY(-5px) scale(1.05);
}

.logo-shadow {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 10px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
  filter: blur(10px);
  opacity: 0.6;
  transition: all 0.3s ease-out;
}

.logo-link:hover .logo-shadow {
  width: 65%;
  opacity: 0.4;
}

/* --- Glass card and decorations ------------------------------------- */
.card-glass {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.card-glass-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 75%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(35deg);
  z-index: -1;
  animation: shine 8s linear infinite;
  pointer-events: none;
}

@keyframes shine {
  0% { transform: translateX(-100%) rotate(35deg); }
  100% { transform: translateX(100%) rotate(35deg); }
}

.corner-decoration {
  position: absolute;
  width: 120px;
  height: 120px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  z-index: -1;
}

.top-left {
  top: -60px;
  left: -60px;
}

.top-right {
  top: -60px;
  right: -60px;
}

.highlight {
  position: relative;
  display: inline-block;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: linear-gradient(90deg, #8b5cf6, #7c3aed);
  opacity: 0.5;
  border-radius: 4px;
  z-index: -1;
}

.gradient-text {
  background: linear-gradient(90deg, #f3e8ff, #c084fc);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  padding-right: 5px;
}

/* --- Features & value props ------------------------------------------- */
/* Logo styling */
.logo-frame {
  position: relative;
  display: inline-block;
  padding: 2px;
}

.logo-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.5s ease;
}

.logo-frame:hover .logo-border {
  opacity: 1;
  transform: scale(1.05);
}

.logo-hover {
  transition: all 0.3s ease-out;
  filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.3));
}

.logo-hover:hover {
  transform: translateY(-5px);
  filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.5));
}

/* Content styling */
.hero-content {
  max-width: 600px;
  margin: 0 auto;
}

.brand-container {
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
}

.brand-line {
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%);
  border-radius: 3px;
  animation: pulse-width 4s ease-in-out infinite;
}

@keyframes pulse-width {
  0%, 100% { width: 40px; opacity: 0.6; }
  50% { width: 80px; opacity: 1; }
}

.glowing-text {
  position: relative;
}

.text-shadow {
  text-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
}

.text-emphasis {
  font-weight: bold;
  position: relative;
  display: inline-block;
}

.text-emphasis::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

/* Tagline styling */
.bg-glass {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Feature badges */
.feature-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: rgba(139, 92, 246, 0.15);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 20px;
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.feature-badge:hover {
  background: rgba(139, 92, 246, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.tag-highlight {
  position: relative;
  color: #f3e8ff;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.4);
}

.tag-highlight:not(:last-child)::after {
  content: '';
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #c084fc;
  margin: 0 3px 3px 3px;
  vertical-align: middle;
}

/* --- Animations ----------------------------------------------------- */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50%      { transform: translateY(-40px) rotate(10deg); }
}

@keyframes float-badge {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50%      { transform: translateY(-10px) rotate(3deg); }
}

@keyframes slide-in-top {
  0% { opacity: 0; transform: translateY(-30px); }
  100% { opacity: 1; transform: translateY(0); }
}

.slide-in-top {
  opacity: 0;
  animation: slide-in-top 0.8s 0.2s forwards;
}

.fade-in {
  opacity: 0;
  animation: fadeInUp 0.8s 0.3s forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

.slide-in-right {
  opacity: 0;
  animation: slideInRight 0.8s 0.4s forwards;
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(50px); }
  to   { opacity: 1; transform: translateX(0); }
}

.slide-in-left {
  opacity: 0;
  animation: slideInLeft 0.8s 0.6s forwards;
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-50px); }
  to   { opacity: 1; transform: translateX(0); }
}

.slide-in-bottom {
  opacity: 0;
  animation: slideInBottom 0.8s 0.8s forwards;
}

@keyframes slideInBottom {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>


<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})
</script>

<style scoped>
.bgi-size-cover {
  background-size: cover !important;
}

.bgi-position-center {
  background-position: center !important;
}

.flex-column-fluid {
  flex: 1 0 auto;
}

.flex-lg-row-fluid {
  flex: 1 0 auto;
}

.w-lg-50 {
  width: 100%;
}

@media (min-width: 992px) {
  .flex-root {
    min-height: 100vh;
  }

  .w-lg-50 {
    width: 50%;
  }
  
  .fs-lg-2qx {
    font-size: 3rem !important;
  }
  
  .fs-lg-4 {
    font-size: 1.35rem !important;
  }
}

/* Mobile optimizations */
@media (max-width: 991px) {
  .hero-bg {
    background: linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%);
  }
  
  .shape-1, .shape-2, .shape-3 {
    opacity: 0.2;
  }
  
  .value-proposition {
    grid-template-columns: 1fr;
  }
  
  .features-list {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 12px;
    flex-wrap: nowrap;
    max-width: 100%;
    scrollbar-width: none;
  }
  
  .features-list::-webkit-scrollbar {
    display: none;
  }
  
  .card-glass {
    margin-left: -16px;
    margin-right: -16px;
    border-radius: 20px;
  }
  
  .floating-badge {
    top: 20px;
    right: 20px;
  }
}
</style>
