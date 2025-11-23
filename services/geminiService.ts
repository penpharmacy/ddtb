import { GoogleGenAI } from "@google/genai";
import { Medication, IntakeLog, SideEffect, IntakeStatus, Severity } from '../types';

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generatePharmacistSummary = async (
  meds: Medication[],
  logs: IntakeLog[],
  effects: SideEffect[]
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "ไม่สามารถเชื่อมต่อกับระบบ AI ได้ กรุณาตรวจสอบ API Key";

  // Filter logs for the last 7 days for relevance
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const recentLogs = logs.filter(l => new Date(l.date) >= oneWeekAgo);
  const adherenceRate = recentLogs.length > 0 
    ? (recentLogs.filter(l => l.status === IntakeStatus.TAKEN).length / recentLogs.length) * 100 
    : 0;

  const prompt = `
    You are a helpful medical assistant AI. Generate a concise summary report for a pharmacist in Thai language.
    
    Patient Data:
    1. Current Medications: ${meds.map(m => `${m.name} (${m.dosage}) - ${m.times.join(', ')}`).join('; ')}
    
    2. Adherence (Last 7 days): ${adherenceRate.toFixed(1)}% adherence rate.
       Missed doses: ${recentLogs.filter(l => l.status === IntakeStatus.SKIPPED || (l.status === IntakeStatus.PENDING && new Date(l.date + 'T' + l.scheduledTime) < new Date())).length}
    
    3. Reported Side Effects: 
       ${effects.length === 0 ? "None reported." : effects.map(e => `[${e.timestamp}] Severity: ${e.severity}, Symptom: ${e.description}`).join('; ')}

    Please structure the report as follows:
    - **สรุปภาพรวม (Summary)**: Brief overview of adherence.
    - **รายการยาปัจจุบัน (Current Meds)**: List clearly.
    - **อาการข้างเคียงที่ต้องระวัง (Side Effects Alert)**: Highlight any moderate/severe side effects immediately. If none, state that patient is stable.
    - **คำแนะนำสำหรับเภสัชกร (Recommendation)**: Suggest if medication review is needed based on missed doses or side effects.

    Keep it professional yet easy to read on a screen.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "ไม่สามารถสร้างรายงานได้";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "เกิดข้อผิดพลาดในการสร้างรายงาน โปรดลองใหม่อีกครั้งเมื่อเชื่อมต่ออินเตอร์เน็ต";
  }
};
