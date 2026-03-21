import DOMPurify from 'dompurify'

export const useSanitize = () => {
  const sanitizeHtml = (html: string): string => {
    if (!html) return ''
    if (import.meta.server) return html
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span', 'div', 'hr'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'style', 'width', 'height']
    })
  }
  return { sanitizeHtml }
}
