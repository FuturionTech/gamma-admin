// Honorific types for frontend use

export enum HonorificEnum {
  MR = 'MR',
  MRS = 'MRS', 
  MS = 'MS',
  MISS = 'MISS',
  DR = 'DR',
  PROF = 'PROF'
}

export interface HonorificTranslation {
  value: HonorificEnum;
  label: string;
}

export interface HonorificOption {
  value: string;
  label: string;
}

// Default honorific options for forms (if API is unavailable)
export const DEFAULT_HONORIFIC_OPTIONS: HonorificOption[] = [
  { value: 'MR', label: 'Mr.' },
  { value: 'MRS', label: 'Mrs.' },
  { value: 'MS', label: 'Ms.' },
  { value: 'MISS', label: 'Miss' },
  { value: 'DR', label: 'Dr.' },
  { value: 'PROF', label: 'Prof.' }
];