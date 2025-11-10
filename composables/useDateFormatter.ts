import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

// Étendre dayjs avec les plugins nécessaires
dayjs.extend(utc)
dayjs.extend(timezone)

export const useDateFormatter = () => {
    /**
     * Formate une date en UTC avec le suffixe Z (ISO 8601)
     * Format: 2025-08-31T16:22:00Z
     */
    const formatToUTC = (date: string | Date | dayjs.Dayjs) => {
        const d = dayjs(date)
        return d.utc().format('YYYY-MM-DDTHH:mm:ss[Z]')
    }

    /**
     * Formate une date en local sans timezone
     * Format: 2025-08-31T16:22:00
     */
    const formatToLocal = (date: string | Date | dayjs.Dayjs) => {
        const d = dayjs(date)
        return d.format('YYYY-MM-DDTHH:mm:ss')
    }

    /**
     * Formate une date en UTC sans suffixe Z
     * Format: 2025-08-31T16:22:00
     */
    const formatToUTCNoSuffix = (date: string | Date | dayjs.Dayjs) => {
        const d = dayjs(date)
        return d.utc().format('YYYY-MM-DDTHH:mm:ss')
    }

    /**
     * Formate une date en format ISO complet
     * Format: 2025-08-31T16:22:00.000Z
     */
    const formatToISO = (date: string | Date | dayjs.Dayjs) => {
        const d = dayjs(date)
        return d.toISOString()
    }

    /**
     * Formate une date en format date simple
     * Format: 2025-08-31
     */
    const formatToDate = (date: string | Date | dayjs.Dayjs) => {
        const d = dayjs(date)
        return d.format('YYYY-MM-DD')
    }

    /**
     * Formate une date en format date et heure local
     * Format: 2025-08-31 16:22:00
     */
    const formatToDateTimeLocal = (date: string | Date | dayjs.Dayjs) => {
        const d = dayjs(date)
        return d.format('YYYY-MM-DD HH:mm:ss')
    }

    /**
     * Formate une date en format lisible
     * Format: 31 août 2025 à 16:22
     */
    const formatToReadable = (date: string | Date | dayjs.Dayjs, locale: string = 'fr') => {
        const d = dayjs(date)
        return d.locale(locale).format('DD MMMM YYYY [à] HH:mm')
    }

    /**
     * Formate une date en format court
     * Format: 31/08/2025
     */
    const formatToShort = (date: string | Date | dayjs.Dayjs) => {
        const d = dayjs(date)
        return d.format('DD/MM/YYYY')
    }

    /**
     * Formate une date en format long
     * Format: 31 août 2025
     */
    const formatToLong = (date: string | Date | dayjs.Dayjs, locale: string = 'fr') => {
        const d = dayjs(date)
        return d.locale(locale).format('DD MMMM YYYY')
    }

    /**
     * Formate une date relative
     * Format: dans 2 jours, il y a 1 heure
     */
    const formatToRelative = (date: string | Date | dayjs.Dayjs, locale: string = 'fr') => {
        const d = dayjs(date)
        return d.locale(locale).fromNow()
    }

    /**
     * Vérifie si une date est valide
     */
    const isValidDate = (date: string | Date | dayjs.Dayjs) => {
        return dayjs(date).isValid()
    }

    /**
     * Obtient la date actuelle
     */
    const getCurrentDate = () => {
        return dayjs()
    }

    /**
     * Obtient la date actuelle en UTC
     */
    const getCurrentDateUTC = () => {
        return dayjs().utc()
    }

    /**
     * Ajoute des jours à une date
     */
    const addDays = (date: string | Date | dayjs.Dayjs, days: number) => {
        const d = dayjs(date)
        return d.add(days, 'day')
    }

    /**
     * Soustrait des jours d'une date
     */
    const subtractDays = (date: string | Date | dayjs.Dayjs, days: number) => {
        const d = dayjs(date)
        return d.subtract(days, 'day')
    }

    /**
     * Calcule la différence entre deux dates en jours
     */
    const diffInDays = (date1: string | Date | dayjs.Dayjs, date2: string | Date | dayjs.Dayjs) => {
        const d1 = dayjs(date1)
        const d2 = dayjs(date2)
        return d1.diff(d2, 'day')
    }

    /**
     * Vérifie si une date est dans le passé
     */
    const isPast = (date: string | Date | dayjs.Dayjs) => {
        const d = dayjs(date)
        return d.isBefore(dayjs())
    }

    /**
     * Vérifie si une date est dans le futur
     */
    const isFuture = (date: string | Date | dayjs.Dayjs) => {
        const d = dayjs(date)
        return d.isAfter(dayjs())
    }

    /**
     * Vérifie si une date est aujourd'hui
     */
    const isToday = (date: string | Date | dayjs.Dayjs) => {
        const d = dayjs(date)
        return d.isSame(dayjs(), 'day')
    }

    return {
        // Formateurs principaux
        formatToUTC,
        formatToLocal,
        formatToUTCNoSuffix,
        formatToISO,
        formatToDate,
        formatToDateTimeLocal,
        
        // Formateurs d'affichage
        formatToReadable,
        formatToShort,
        formatToLong,
        formatToRelative,
        
        // Utilitaires
        isValidDate,
        getCurrentDate,
        getCurrentDateUTC,
        addDays,
        subtractDays,
        diffInDays,
        isPast,
        isFuture,
        isToday,
        
        // Export de dayjs pour des utilisations avancées
        dayjs
    }
}
