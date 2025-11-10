export const useLanguages = () => {
    const languages = [
        { code: 'FR', name: 'Français' },
        { code: 'EN', name: 'Anglais' }
    ]

    const getLanguageName = (code: string) => {
        const lang = languages.find(l => l.code === code)
        return lang ? lang.name : code
    }

    const defaultLanguage = { code: 'FR', name: 'Français' } // 👈 langue par défaut

    const getAvailableLanguages = (excludeCodes: string[] = []) => {
        return languages.filter(lang => !excludeCodes.includes(lang.code))
    }

    return {
        languages,
        getLanguageName,
        getAvailableLanguages,
        defaultLanguage
    }
}