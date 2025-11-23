import React, { useEffect, useState } from 'react';
import { IntakeLog, IntakeStatus } from '../types';
import { Check, X, Clock, AlertCircle } from 'lucide-react';
import { initializeDailyLogs, getLogs, saveLog } from '../services/storageService';

const Dashboard: React.FC = () => {
  const [logs, setLogs] = useState<IntakeLog[]>([]);
  const [today] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    initializeDailyLogs();
    loadLogs();
    
    // Refresh logs every minute to update pending statuses if needed (UI only)
    const interval = setInterval(loadLogs, 60000);
    return () => clearInterval(interval);
  }, [today]);

  const loadLogs = () => {
    const allLogs = getLogs();
    const todaysLogs = allLogs.filter(l => l.date === today);
    // Sort by time
    todaysLogs.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
    setLogs(todaysLogs);
  };

  const handleStatusChange = (log: IntakeLog, status: IntakeStatus) => {
    const updatedLog = { ...log, status, actualTime: new Date().toISOString() };
    saveLog(updatedLog);
    loadLogs();
  };

  const getProgress = () => {
    if (logs.length === 0) return 0;
    const taken = logs.filter(l => l.status === IntakeStatus.TAKEN).length;
    return Math.round((taken / logs.length) * 100);
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">สวัสดี, วันนี้</h1>
        <p className="text-gray-500 text-sm">{new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </header>

      {/* Progress Card */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold mb-1">ความคืบหน้าการทานยา</h2>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold">{getProgress()}%</span>
            <span className="mb-1 text-teal-100">เรียบร้อยแล้ว</span>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-32 bg-white opacity-10 transform skew-x-12 translate-x-8"></div>
      </div>

      <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <Clock size={18} />
        ตารางยาของวันนี้
      </h3>

      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-gray-100">
            <p>ไม่มีรายการยาสำหรับวันนี้</p>
            <p className="text-sm mt-2">ไปที่เมนู "ยาของฉัน" เพื่อเพิ่มรายการ</p>
          </div>
        ) : (
          logs.map((log) => (
            <div 
              key={log.id} 
              className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all ${
                log.status === IntakeStatus.TAKEN ? 'opacity-70 bg-gray-50' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md">
                      {log.scheduledTime}
                    </span>
                    {log.status === IntakeStatus.SKIPPED && (
                      <span className="text-xs text-red-500 font-medium flex items-center gap-1">
                        <AlertCircle size={12} /> ข้ามยานี้
                      </span>
                    )}
                  </div>
                  <h4 className={`font-bold text-lg ${log.status === IntakeStatus.TAKEN ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                    {log.medicationName}
                  </h4>
                </div>
              </div>

              {log.status === IntakeStatus.PENDING && (
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => handleStatusChange(log, IntakeStatus.TAKEN)}
                    className="flex-1 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Check size={18} />
                    ทานแล้ว
                  </button>
                  <button
                    onClick={() => handleStatusChange(log, IntakeStatus.SKIPPED)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors border border-red-200"
                  >
                    <X size={18} />
                    ข้าม
                  </button>
                </div>
              )}

              {log.status === IntakeStatus.TAKEN && (
                <div className="flex items-center gap-2 text-teal-600 text-sm font-medium mt-2 bg-teal-50 p-2 rounded-lg inline-block px-3">
                  <Check size={16} />
                  บันทึกการทานแล้ว {log.actualTime ? `เวลา ${new Date(log.actualTime).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})}` : ''}
                </div>
              )}
              
              {log.status === IntakeStatus.SKIPPED && (
                 <button 
                   onClick={() => handleStatusChange(log, IntakeStatus.PENDING)}
                   className="text-sm text-gray-400 underline mt-2"
                 >
                   ยกเลิก (ทานปกติ)
                 </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
