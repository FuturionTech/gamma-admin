export const useCurrencies = () => {
    const currencies = [
        { code: 'EUR', name: 'Euro', symbol: '€', isDefault: true },
        { code: 'XOF', name: 'Franc CFA (BCEAO)', symbol: 'CFA', isDefault: false },
        { code: 'XAF', name: 'Franc CFA (BEAC)', symbol: 'FCFA', isDefault: false },
        { code: 'USD', name: 'Dollar américain', symbol: '$' },
        { code: 'GBP', name: 'Livre sterling', symbol: '£' },
        { code: 'CAD', name: 'Dollar canadien', symbol: 'C$' },
        { code: 'CHF', name: 'Franc suisse', symbol: 'CHF' },
        { code: 'JPY', name: 'Yen japonais', symbol: '¥' },
        { code: 'AUD', name: 'Dollar australien', symbol: 'A$' },
        { code: 'CNY', name: 'Yuan chinois', symbol: '¥' },
        { code: 'INR', name: 'Roupie indienne', symbol: '₹' },
        { code: 'BRL', name: 'Real brésilien', symbol: 'R$' },
        { code: 'NGN', name: 'Naira nigérian', symbol: '₦' },
        { code: 'ZAR', name: 'Rand sud-africain', symbol: 'R' },
        { code: 'EGP', name: 'Livre égyptienne', symbol: 'E£' },
        { code: 'MAD', name: 'Dirham marocain', symbol: 'MAD' },
        { code: 'TND', name: 'Dinar tunisien', symbol: 'TND' },
        { code: 'DZD', name: 'Dinar algérien', symbol: 'DZD' }
    ]

    const getCurrencyName = (code: string) => {
        const currency = currencies.find(c => c.code === code)
        return currency ? currency.name : code
    }

    const getCurrencySymbol = (code: string) => {
        const currency = currencies.find(c => c.code === code)
        return currency ? currency.symbol : code
    }

    const getCurrencyByCode = (code: string) => {
        return currencies.find(c => c.code === code)
    }

    const defaultCurrency = currencies.find(c => c.isDefault) || currencies[0]

    const getAvailableCurrencies = (excludeCodes: string[] = []) => {
        return currencies.filter(currency => !excludeCodes.includes(currency.code))
    }

    const formatPrice = (price: number, currencyCode: string, locale: string = 'fr-FR') => {
        const currency = getCurrencyByCode(currencyCode)
        if (!currency) return `${price} ${currencyCode}`

        try {
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currencyCode,
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }).format(price)
        } catch (error) {
            // Fallback si la devise n'est pas supportée par Intl
            return `${price} ${currency.symbol}`
        }
    }

    const getCurrencyOptions = () => {
        return currencies.map(currency => ({
            value: currency.code,
            label: `${currency.name} (${currency.symbol})`,
            symbol: currency.symbol
        }))
    }

    return {
        currencies,
        getCurrencyName,
        getCurrencySymbol,
        getCurrencyByCode,
        getAvailableCurrencies,
        defaultCurrency,
        formatPrice,
        getCurrencyOptions
    }
}
