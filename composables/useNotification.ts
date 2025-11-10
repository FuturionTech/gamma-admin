import { ref } from 'vue'

export interface NotificationOptions {
  title?: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
}

export const useNotification = () => {
  const isShowing = ref(false)
  const currentNotification = ref<NotificationOptions | null>(null)

  const showNotification = (options: NotificationOptions) => {
    const notification: NotificationOptions = {
      type: 'info',
      duration: 3000,
      position: 'top-right',
      ...options
    }

    // If Bootstrap toasts are available, use them
    if (typeof window !== 'undefined' && window.bootstrap) {
      const toastHtml = `
        <div class="position-fixed ${getPositionClass(notification.position)} p-3" style="z-index: 11">
          <div class="toast align-items-center text-white bg-${getBootstrapClass(notification.type)} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
              <div class="toast-body">
                ${notification.title ? `<strong>${notification.title}</strong><br>` : ''}
                ${notification.message}
              </div>
              <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
          </div>
        </div>
      `

      const toastContainer = document.createElement('div')
      toastContainer.innerHTML = toastHtml
      document.body.appendChild(toastContainer)

      const toastElement = toastContainer.querySelector('.toast')
      if (toastElement) {
        const toast = new window.bootstrap.Toast(toastElement, {
          autohide: true,
          delay: notification.duration
        })
        toast.show()

        // Remove container after toast is hidden
        toastElement.addEventListener('hidden.bs.toast', () => {
          toastContainer.remove()
        })
      }
    } else {
      // Fallback to console if Bootstrap is not available
      console.log(`[${notification.type?.toUpperCase()}] ${notification.title || ''} - ${notification.message}`)
    }

    currentNotification.value = notification
    isShowing.value = true

    setTimeout(() => {
      isShowing.value = false
      currentNotification.value = null
    }, notification.duration)
  }

  const showSuccess = (message: string, title?: string) => {
    showNotification({
      message,
      title: title || 'Succès',
      type: 'success'
    })
  }

  const showError = (message: string, title?: string) => {
    showNotification({
      message,
      title: title || 'Erreur',
      type: 'error',
      duration: 5000 // Errors stay longer
    })
  }

  const showWarning = (message: string, title?: string) => {
    showNotification({
      message,
      title: title || 'Attention',
      type: 'warning'
    })
  }

  const showInfo = (message: string, title?: string) => {
    showNotification({
      message,
      title: title || 'Information',
      type: 'info'
    })
  }

  const getBootstrapClass = (type?: string) => {
    switch (type) {
      case 'success':
        return 'success'
      case 'error':
        return 'danger'
      case 'warning':
        return 'warning'
      case 'info':
        return 'info'
      default:
        return 'primary'
    }
  }

  const getPositionClass = (position?: string) => {
    switch (position) {
      case 'top-left':
        return 'top-0 start-0'
      case 'top-right':
        return 'top-0 end-0'
      case 'bottom-left':
        return 'bottom-0 start-0'
      case 'bottom-right':
        return 'bottom-0 end-0'
      case 'center':
        return 'top-50 start-50 translate-middle'
      default:
        return 'top-0 end-0'
    }
  }

  return {
    isShowing,
    currentNotification,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}