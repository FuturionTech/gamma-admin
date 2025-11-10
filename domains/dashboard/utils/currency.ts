// Currency utility for gamma Dashboard
// Default currency is West African CFA Franc (FCFA - XOF)

export type SupportedCurrency = 'XOF' | 'USD' | 'EUR';

export const DEFAULT_CURRENCY: SupportedCurrency = 'XOF'; // FCFA

export const CURRENCY_CONFIG = {
  XOF: { 
    locale: 'fr-CF', 
    currency: 'XOF',
    symbol: 'FCFA',
    name: 'Franc CFA',
    exchangeRate: 1 // Base currency
  },
  USD: { 
    locale: 'en-US', 
    currency: 'USD',
    symbol: '$',
    name: 'US Dollar',
    exchangeRate: 0.0016 // 1 FCFA = ~0.0016 USD (approximate)
  },
  EUR: { 
    locale: 'fr-FR', 
    currency: 'EUR',
    symbol: '€',
    name: 'Euro',
    exchangeRate: 0.0015 // 1 FCFA = ~0.0015 EUR (approximate)
  }
};

/**
 * Format currency amount with proper locale and currency symbol
 */
export const formatCurrency = (
  amount: number, 
  currency: SupportedCurrency = DEFAULT_CURRENCY,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    compact?: boolean;
  } = {}
): string => {
  const config = CURRENCY_CONFIG[currency];
  const { minimumFractionDigits = 0, maximumFractionDigits = 0, compact = false } = options;
  
  // For FCFA, use compact notation for large amounts
  if (currency === 'XOF' && compact && amount >= 1000000) {
    const millions = amount / 1000000;
    return `${millions.toFixed(1)}M FCFA`;
  } else if (currency === 'XOF' && compact && amount >= 1000) {
    const thousands = amount / 1000;
    return `${thousands.toFixed(0)}K FCFA`;
  }
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits,
    maximumFractionDigits
  }).format(amount);
};

/**
 * Convert amount between currencies
 */
export const convertCurrency = (
  amount: number,
  fromCurrency: SupportedCurrency,
  toCurrency: SupportedCurrency
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to base currency (XOF) first
  const baseAmount = amount / CURRENCY_CONFIG[fromCurrency].exchangeRate;
  
  // Convert from base to target currency
  return baseAmount * CURRENCY_CONFIG[toCurrency].exchangeRate;
};

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (currency: SupportedCurrency): string => {
  return CURRENCY_CONFIG[currency].symbol;
};

/**
 * Get currency name
 */
export const getCurrencyName = (currency: SupportedCurrency): string => {
  return CURRENCY_CONFIG[currency].name;
};

/**
 * Format large numbers with FCFA-friendly formatting
 */
export const formatFCFA = (amount: number, compact: boolean = true): string => {
  if (compact) {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)} Mrd FCFA`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} M FCFA`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)} K FCFA`;
    }
  }
  
  return new Intl.NumberFormat('fr-CF', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Typical subscription prices in FCFA for West African market
 */
export const TYPICAL_PRICES_FCFA = {
  basic: 15000,      // ~$25 USD
  professional: 30000, // ~$50 USD  
  enterprise: 60000   // ~$100 USD
};

/**
 * Get contextual currency for different dashboard sections
 */
export const getContextualCurrency = (context: 'revenue' | 'subscription' | 'transaction'): SupportedCurrency => {
  // All contexts use FCFA as primary currency for West African market
  return 'XOF';
};