/**
 * Shared helper for rendering entity icon tiles inside list tables.
 *
 * Returns an inline style string that blends the stored `icon_color`
 * into a soft background + border + icon color. Falls back to the
 * default purple palette when no color is stored.
 */
export const useListIconTile = () => {
  const hexWithAlpha = (hex: string, alpha: number): string => {
    const trimmed = hex.replace('#', '')
    if (trimmed.length !== 6) return hex
    const r = parseInt(trimmed.slice(0, 2), 16)
    const g = parseInt(trimmed.slice(2, 4), 16)
    const b = parseInt(trimmed.slice(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const iconTileStyle = (iconColor?: string | null) => {
    if (!iconColor) {
      return {
        background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.14) 0%, rgba(124, 58, 237, 0.2) 100%)',
        border: '1px solid rgba(167, 139, 250, 0.3)',
        color: '#6d28d9',
      }
    }

    return {
      background: `linear-gradient(135deg, ${hexWithAlpha(iconColor, 0.14)} 0%, ${hexWithAlpha(iconColor, 0.22)} 100%)`,
      border: `1px solid ${hexWithAlpha(iconColor, 0.35)}`,
      color: iconColor,
    }
  }

  return { iconTileStyle }
}
