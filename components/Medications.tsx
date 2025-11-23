import React, { useState, useEffect } from 'react';
import { Medication } from '../types';
import { getMedications, saveMedication, deleteMedication, initializeDailyLogs } from '../services/storageService';
import { Plus, Trash2, Clock, Pill } from 'lucide-react';

const Medications: React.FC = () => {
  const [meds, setMeds] = useState<Medication[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [times, setTimes] = useState<string[]>(['08:00']);

  useEffect(() => {
    loadMeds();
  }, []);

  const loadMeds = () => {
    setMeds(getMedications());
  };

  const handleAddTime = () => {
    setTimes([...times, '12:00']);
  };

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...times];
    newTimes[index] = value;
    setTimes(newTimes);
  };

  const handleRemoveTime = (index: number) => {
    if (times.length === 1) return;
    const newTimes = times.filter((_, i) => i !== index);
    setTimes(newTimes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMed: Medication = {
      id: Date.now().toString(),
      name,
      dosage,
      frequency: 'Daily',
      times,
    };
    saveMedication(newMed);
    
    // Reset form
    setName('');
    setDosage('');
    setTimes(['08:00']);
    setIsAdding(false);
    
    loadMeds();
    // Re-initialize daily logs so the new med appears on dashboard immediately if applicable
    initializeDailyLogs(); 
  };

  const handleDelete = (id: string) => {
    if (window.confirm('คุณต้องการลบรายการยานี้ใช่หรือไม่?')) {
      deleteMedication(id);
      loadMeds();
    }
  };

  if (isAdding) {
    return (
      <div className="pb-24 pt-6 px-4 max-w-md mx-auto min-h-screen bg-white">
        <h2 className="text-xl font-bold mb-6 text-gray-800">เพิ่มรายการยาใหม่</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อยา</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              placeholder="เช่น Paracetamol"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ขนาด/ปริมาณ</label>
            <input
              type="text"
              required
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="เช่น 1 เม็ด, 500 mg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">เวลาที่ต้องทาน</label>
            {times.map((time, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => handleTimeChange(index, e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                />
                {times.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTime(index)}
                    className="p-3 text-red-500 bg-red-50 rounded-xl"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddTime}
              className="mt-2 text-sm text-teal-600 font-medium flex items-center gap-1"
            >
              <Plus size={16} /> เพิ่มเวลาทานยา
            </button>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
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
        <h1 className="text-2xl font-bold text-gray-800">ยาของฉัน</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-teal-600 text-white p-2 rounded-full shadow-md hover:bg-teal-700"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {meds.length === 0 ? (
           <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
             <div className="mx-auto bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-3">
               <Pill className="text-gray-400" size={32} />
             </div>
             <p className="text-gray-500">ยังไม่มีรายการยา</p>
             <button onClick={() => setIsAdding(true)} className="text-teal-600 font-medium mt-2">เพิ่มยาตัวแรก</button>
           </div>
        ) : (
          meds.map((med) => (
            <div key={med.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{med.name}</h3>
                <p className="text-gray-500 text-sm">{med.dosage}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  <Clock size={14} />
                  <span>{med.times.join(', ')}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(med.id)}
                className="text-gray-300 hover:text-red-500 p-2"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Medications;
