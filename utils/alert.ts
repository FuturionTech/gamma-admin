//@ts-ignore
import Swal from 'sweetalert2'

interface AlertOptions {
    type?: string
    title?: string
    message?: string
    html?: boolean
    showCancelButton?: boolean
    showCloseButton?: boolean
    showConfirmButton?: boolean
    confirmButtonText?: string
    cancelButtonText?: string
    isCustomButton?: boolean
}

export function showAlert({
    type = 'info',
    title,
    message,
    html = false,
    showCloseButton = true,
    showConfirmButton = true,
    confirmButtonText = 'OK',
    showCancelButton = false,
    cancelButtonText = 'Cancel',
    isCustomButton = true
}: AlertOptions = {}): Promise<any> {
    if (!message) return Promise.resolve(null)

    // Utilisation de l'attente directe sur Swal.fire
    const customClass = isCustomButton
        ? {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger',
        }
        : undefined

        //@ts-ignore
    return Swal.fire({
        icon: type,
        title: title || null,
        [html ? 'html' : 'text']: message,
        showCancelButton,
        showCloseButton,
        showConfirmButton,
        confirmButtonText,
        cancelButtonText,
        customClass
    })
}
