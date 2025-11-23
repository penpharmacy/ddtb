export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string; // e.g., "Daily", "As needed"
  times: string[]; // Array of "HH:mm" strings
  instructions?: string;
  icon?: string;
}

export enum IntakeStatus {
  PENDING = 'PENDING',
  TAKEN = 'TAKEN',
  SKIPPED = 'SKIPPED',
}

export interface IntakeLog {
  id: string;
  medicationId: string;
  medicationName: string;
  scheduledTime: string; // ISO String or HH:mm depending on context, strictly using ISO date for log
  actualTime?: string;
  status: IntakeStatus;
  date: string; // YYYY-MM-DD for easy grouping
}

export enum Severity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
}

export interface SideEffect {
  id: string;
  description: string;
  timestamp: string;
  severity: Severity;
  relatedMedicationId?: string; // Optional, if known
}

export type ViewState = 'dashboard' | 'medications' | 'side_effects' | 'pharmacist';
