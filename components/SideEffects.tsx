import React, { useState, useEffect } from 'react';
import { SideEffect, Severity } from '../types';
import { getSideEffects, saveSideEffect } from '../services/storageService';
import { AlertTriangle, Plus, Activity } from 'lucide-react';

const SideEffects: React.FC = () => {
  const [effects, setEffects] = useState<SideEffect[]>([]);
  const [isLogging, setIsLogging] = useState(false);
  
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<Severity>(Severity.MILD);

  useEffect(() => {
    loadEffects();
  }, []);

  const loadEffects = () => {
    const loaded = getSideEffects();
    // Sort descending by date
    loaded.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setEffects(loaded);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEffect: SideEffect = {
      id: Date.now().toString(),
      description,
      severity,
      timestamp: new Date().toISOString(),
    };
    saveSideEffect(newEffect);
    setDescription('');
    setSeverity(Severity.MILD);
    setIsLogging(false);
    loadEffects();
  };

  const getSeverityColor = (s: Severity) => {
    switch (s) {
      case Severity.MILD: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case Severity.MODERATE: return 'bg-orange-100 text-orange-700 border-orange-200';
      case Severity.SEVERE: return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const getSeverityLabel = (s: Severity) => {
    switch (s) {
      case Severity.MILD: return 'เล็กน้อย';
      case Severity.MODERATE: return 'ปานกลาง';
      case Severity.SEVERE: return 'รุนแรง';
    }
  };

  if (isLogging) {
    return (
      <div className="pb-24 pt-6 px-4 max-w-md mx-auto min-h-screen bg-white">
        <h2 className="text-xl font-bold mb-6 text-gray-800">บันทึกอาการข้างเคียง</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">อาการที่พบ</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none resize-none"
              placeholder="เช่น เวียนหัว คลื่นไส้ มีผื่นแดง..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ระดับความรุนแรง</label>
            <div className="grid grid-cols-3 gap-3">
              {Object.values(Severity).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeverity(s)}
                  className={`py-3 rounded-xl text-sm font-medium border ${
                    severity === s 
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {getSeverityLabel(s)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsLogging(false)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-medium shadow-md hover:bg-teal-700"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ผลข้างเคียง</h1>
        <button
          onClick={() => setIsLogging(true)}
          className="bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl mb-6 text-sm text-blue-800 flex gap-3 items-start">
        <Activity className="shrink-0 mt-0.5" size={18} />
        <p>ข้อมูลนี้จะช่วยให้เภสัชกรประเมินความเหมาะสมของยาได้ โปรดบันทึกทุกครั้งที่มีอาการผิดปกติ</p>
      </div>

      <div className="space-y-4">
        {effects.length === 0 ? (
           <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
             <div className="mx-auto bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-3">
               <AlertTriangle className="text-gray-400" size={32} />
             </div>
             <p className="text-gray-500">ยังไม่มีการบันทึกผลข้างเคียง</p>
           </div>
        ) : (
          effects.map((effect) => (
            <div key={effect.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getSeverityColor(effect.severity)}`}>
                  ระดับ: {getSeverityLabel(effect.severity)}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(effect.timestamp).toLocaleDateString('th-TH')} {new Date(effect.timestamp).toLocaleTimeString('th-TH', {hour: '2-digit', minute: '2-digit'})}
                </span>
              </div>
              <p className="text-gray-800">{effect.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SideEffects;
