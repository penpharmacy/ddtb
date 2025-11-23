import { Medication, IntakeLog, SideEffect, IntakeStatus } from '../types';

const KEYS = {
  MEDICATIONS: 'yadee_medications',
  LOGS: 'yadee_logs',
  SIDE_EFFECTS: 'yadee_side_effects',
};

export const getMedications = (): Medication[] => {
  const data = localStorage.getItem(KEYS.MEDICATIONS);
  return data ? JSON.parse(data) : [];
};

export const saveMedication = (med: Medication): void => {
  const meds = getMedications();
  const index = meds.findIndex((m) => m.id === med.id);
  if (index >= 0) {
    meds[index] = med;
  } else {
    meds.push(med);
  }
  localStorage.setItem(KEYS.MEDICATIONS, JSON.stringify(meds));
};

export const deleteMedication = (id: string): void => {
  const meds = getMedications().filter((m) => m.id !== id);
  localStorage.setItem(KEYS.MEDICATIONS, JSON.stringify(meds));
};

export const getLogs = (): IntakeLog[] => {
  const data = localStorage.getItem(KEYS.LOGS);
  return data ? JSON.parse(data) : [];
};

export const saveLog = (log: IntakeLog): void => {
  const logs = getLogs();
  const index = logs.findIndex((l) => l.id === log.id);
  if (index >= 0) {
    logs[index] = log;
  } else {
    logs.push(log);
  }
  localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
};

export const getSideEffects = (): SideEffect[] => {
  const data = localStorage.getItem(KEYS.SIDE_EFFECTS);
  return data ? JSON.parse(data) : [];
};

export const saveSideEffect = (effect: SideEffect): void => {
  const effects = getSideEffects();
  effects.push(effect);
  localStorage.setItem(KEYS.SIDE_EFFECTS, JSON.stringify(effects));
};

// Helper to generate daily logs if they don't exist for the current day
export const initializeDailyLogs = (): void => {
  const today = new Date().toISOString().split('T')[0];
  const meds = getMedications();
  const allLogs = getLogs();
  
  const todaysLogs = allLogs.filter(l => l.date === today);

  meds.forEach(med => {
    med.times.forEach(time => {
      // Check if a log already exists for this med at this time today
      const exists = todaysLogs.find(l => l.medicationId === med.id && l.scheduledTime === time);
      
      if (!exists) {
        const newLog: IntakeLog = {
          id: `${today}-${med.id}-${time}`,
          medicationId: med.id,
          medicationName: med.name,
          scheduledTime: time,
          status: IntakeStatus.PENDING,
          date: today
        };
        allLogs.push(newLog);
      }
    });
  });

  localStorage.setItem(KEYS.LOGS, JSON.stringify(allLogs));
};
