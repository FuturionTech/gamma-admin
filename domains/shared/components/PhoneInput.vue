<template>
  <div class="phone-input d-flex align-items-center">
    <div class="country-selector position-relative">
      <!-- Country selector button -->
      <button
          type="button"
          class="btn dropdown-toggle d-flex align-items-center justify-content-between w-100 bg-white"
          @click="toggleDropdown"
          :class="{ 'show': isOpen }"
          ref="dropdownButton"
      >
        <div class="d-flex align-items-center">
          <img
              :src="selectedCountry.flag"
              :alt="selectedCountry.name"
              class="flag-icon"
          />
          <span class="country-code ms-2">+{{ selectedCountry.code }}</span>
        </div>
        <i class="ki-outline ki-arrow-down fs-7" :class="{ 'rotate-180': isOpen }"></i>
      </button>

      <!-- Dropdown menu -->
      <div
          v-if="isOpen"
          class="dropdown-menu p-0"
          :class="{ 'show': isOpen }"
          @click.stop
      >
        <!-- Search input -->
        <div class="p-3 border-bottom">
          <div class="position-relative">
            <i class="ki-outline ki-search fs-6 position-absolute top-50 translate-middle-y ms-3 text-gray-500"></i>
            <input
                type="text"
                class="form-control form-control-sm border-0 ps-9"
                placeholder="Rechercher un pays"
                v-model="searchQuery"
                @input="filterCountries"
                ref="searchInput"
            />
          </div>
        </div>

        <!-- Countries list -->
        <div class="country-list">
          <div
              v-for="country in filteredCountries"
              :key="country.code + country.name"
              @click="selectCountry(country)"
              class="country-item d-flex align-items-center p-3 cursor-pointer"
              :class="{'active': selectedCountry.code === country.code && selectedCountry.name === country.name}"
          >
            <img
                :src="country.flag"
                :alt="country.name"
                class="flag-icon me-3"
            />
            <div>
              <div class="fw-medium">{{ country.name }}</div>
              <div class="text-gray-600 fs-7">+{{ country.code }}</div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="filteredCountries.length === 0" class="p-5 text-center text-gray-500">
            <i class="ki-outline ki-information-5 fs-2 mb-2"></i>
            <div>Aucun pays ne correspond à votre recherche</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Phone number input -->
    <input
        type="tel"
        :placeholder="getPlaceholderWithoutCode()"
        v-model="phoneNumber"
        class="form-control ms-3"
        @focus="handlePhoneInputFocus"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

interface Country {
  name: string;
  code: string;
  flag: string;
}

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>(); 

const emit = defineEmits(['update:modelValue']);

// Expanded country list for better user experience
const countries: Country[] = [
  {
    name: 'Burkina Faso',
    code: '226',
    flag: '/assets/media/flags/burkina-faso.svg',
  },
  {
    name: 'Canada',
    code: '1',
    flag: '/assets/media/flags/canada.svg',
  },
  {
    name: 'Côte d\'Ivoire',
    code: '225',
    flag: '/assets/media/flags/ivory-coast.svg',
  },
  {
    name: 'France',
    code: '33',
    flag: '/assets/media/flags/france.svg',
  },
  {
    name: 'Mali',
    code: '223',
    flag: '/assets/media/flags/mali.svg',
  },
  {
    name: 'Senegal',
    code: '221',
    flag: '/assets/media/flags/senegal.svg',
  },
  {
    name: 'United Kingdom',
    code: '44',
    flag: '/assets/media/flags/united-kingdom.svg',
  },
  {
    name: 'United States',
    code: '1',
    flag: '/assets/media/flags/united-states.svg',
  },
];

const countryCodes = countries.map(c => c.code);
const regexPattern = `^\\+(${countryCodes.join('|')})(.*)$`;
const regex = new RegExp(regexPattern);

const selectedCountry = ref<Country>(countries[0]);
const phoneNumber = ref('');
const isOpen = ref(false);
const searchQuery = ref('');
const filteredCountries = ref<Country[]>(countries);
const dropdownButton = ref<HTMLElement | null>(null);
const searchInput = ref<HTMLElement | null>(null);

// Toggle dropdown
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  
  // Focus search input when opening
  if (isOpen.value) {
    setTimeout(() => {
      searchInput.value?.focus();
    }, 100);
  } else {
    // Clear search when closing
    searchQuery.value = '';
    filteredCountries.value = [...countries];
  }
};

// Filter countries based on search query
const filterCountries = () => {
  if (!searchQuery.value) {
    filteredCountries.value = [...countries];
    return;
  }
  
  const query = searchQuery.value.toLowerCase();
  filteredCountries.value = countries.filter(country => {
    return (
      country.name.toLowerCase().includes(query) || 
      country.code.includes(query)
    );
  });
};

// Select a country from the dropdown
const selectCountry = (country: Country) => {
  selectedCountry.value = country;
  isOpen.value = false;
  searchQuery.value = '';
  filteredCountries.value = [...countries];
};

// Handle clicks outside the dropdown to close it
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (dropdownButton.value && !dropdownButton.value.contains(target) && isOpen.value) {
    isOpen.value = false;
    searchQuery.value = '';
    filteredCountries.value = [...countries];
  }
};

// Focus handling for phone input
const handlePhoneInputFocus = () => {
  // Close country dropdown if open when focusing on phone field
  if (isOpen.value) {
    isOpen.value = false;
    searchQuery.value = '';
    filteredCountries.value = [...countries];
  }
};

// Remove country code from placeholder
const getPlaceholderWithoutCode = () => {
  if (!props.placeholder) return '';
  
  // Replace patterns like +226 or +44 with empty string
  return props.placeholder.replace(/^\+\d+\s/, '');
};

// Set up event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Watch for changes in modelValue
watch(
  () => props.modelValue,
  () => {
    if (props.modelValue) {
      const match = props.modelValue.match(regex);
      if (match) {
        const code = match[1];
        const number = match[2]?.trim() || '';
        const country = countries.find((c) => c.code === code) || countries[0];
        selectedCountry.value = country;
        phoneNumber.value = number;
      } else {
        selectedCountry.value = countries[0];
        phoneNumber.value = '';
      }
    } else {
      selectedCountry.value = countries[0];
      phoneNumber.value = '';
    }
  },
  { immediate: true }
);

// Emit changes when phoneNumber or selectedCountry changes
watch(
  [phoneNumber, selectedCountry],
  () => {
    emit('update:modelValue', `+${selectedCountry.value.code}${phoneNumber.value}`);
  }
);
</script>


<style scoped>
.phone-input {
  position: relative;
  width: 100%;
  min-height: calc(3.25rem + 2px);
}

.country-selector {
  width: 140px;
  position: relative;
}

.dropdown-toggle {
  height: 100%;
  min-height: calc(3.25rem + 2px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border: 1px solid #e4e6ef;
  border-radius: 0.5rem;
  transition: border-color 0.15s ease;
}

.dropdown-toggle:hover {
  border-color: #d9dbe9;
}

.dropdown-toggle.show {
  border-color: rgba(182, 44, 255, 0.4);
}

.flag-icon {
  width: 20px;
  height: 15px;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.2);
}

.dropdown-menu {
  width: 280px;
  max-height: 350px;
  overflow-y: auto;
  margin-top: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e4e6ef;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.dropdown-menu.show {
  display: block;
}

.country-list {
  max-height: 250px;
  overflow-y: auto;
}

.country-item {
  transition: background-color 0.15s ease;
}

.country-item:hover {
  background-color: #f5f8fa;
}

.country-item.active {
  background-color: rgba(182, 44, 255, 0.04);
}

.form-control {
  height: 100%;
  min-height: calc(3.25rem + 2px);
  border-radius: 0.5rem;
}

.form-control:focus {
  border-color: rgba(182, 44, 255, 0.4);
  box-shadow: 0 0 0 0.25rem rgba(182, 44, 255, 0.15);
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}

.cursor-pointer {
  cursor: pointer;
}

.translate-middle-y {
  transform: translateY(-50%);
}

.top-50 {
  top: 50%;
}
</style>
