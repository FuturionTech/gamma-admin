/**
 * Generic network response type
 */
export interface NetworkResponse<T> {
    success: boolean;
    data: T | null;
    error: string | null;
}
