import React, { useState } from 'react';
import { getMedications, getLogs, getSideEffects } from '../services/storageService';
import { generatePharmacistSummary } from '../services/geminiService';
import { FileText, Share2, WifiOff, Loader2 } from 'lucide-react';

const PharmacistReport: React.FC = () => {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'raw'>('summary');

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const meds = getMedications();
      const logs = getLogs();
      const effects = getSideEffects();
      const result = await generatePharmacistSummary(meds, logs, effects);
      setSummary(result);
    } catch (e) {
      setSummary("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  // Simulating "Offline Share" by creating a clean raw data view
  const getRawDataText = () => {
    const meds = getMedications();
    const effects = getSideEffects();
    
    let text = `=== YADEE REPORT ===\n\n`;
    text += `[MEDICATIONS]\n`;
    meds.forEach(m => text += `- ${m.name} (${m.dosage}) @ ${m.times.join(',')}\n`);
    
    text += `\n[SIDE EFFECTS]\n`;
    if(effects.length === 0) text += "None\n";
    effects.forEach(e => text += `- [${e.severity}] ${e.description} (${new Date(e.timestamp).toLocaleDateString()})\n`);

    return text;
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ส่งข้อมูลให้เภสัชกร</h1>
        <p className="text-gray-500 text-sm">สร้างรายงานสรุปเพื่อปรึกษาเภสัชกร</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="flex border-b border-gray-100">
          <button 
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'summary' ? 'text-teal-600 bg-teal-50' : 'text-gray-500'}`}
            onClick={() => setActiveTab('summary')}
          >
            AI สรุปผล (Online)
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'raw' ? 'text-teal-600 bg-teal-50' : 'text-gray-500'}`}
            onClick={() => setActiveTab('raw')}
          >
            ข้อมูลดิบ (Offline)
          </button>
        </div>

        <div className="p-5 min-h-[300px]">
          {activeTab === 'summary' ? (
            <>
               {!summary && !loading && (
                 <div className="text-center py-10">
                   <FileText className="mx-auto text-teal-200 mb-4" size={48} />
                   <p className="text-gray-500 mb-6">กดปุ่มด้านล่างเพื่อใช้ AI สรุปข้อมูลสุขภาพของคุณให้เภสัชกร</p>
                   <button
                    onClick={handleGenerateReport}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
                  >
                    <Share2 size={18} /> สร้างรายงาน
                  </button>
                 </div>
               )}

               {loading && (
                 <div className="text-center py-20">
                   <Loader2 className="animate-spin text-teal-500 mx-auto mb-2" size={32} />
                   <p className="text-gray-400 animate-pulse">กำลังวิเคราะห์ข้อมูล...</p>
                 </div>
               )}

               {summary && !loading && (
                 <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                   <div className="whitespace-pre-line font-sans">{summary}</div>
                 </div>
               )}
            </>
          ) : (
            <div className="relative">
              <div className="bg-gray-900 text-gray-300 p-4 rounded-lg font-mono text-xs overflow-x-auto h-[300px] no-scrollbar">
                <pre>{getRawDataText()}</pre>
              </div>
              <div className="mt-4 flex items-center justify-center text-gray-500 text-sm gap-2">
                <WifiOff size={16} />
                <span>ยื่นหน้านี้ให้เภสัชกรดูได้ทันที</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {summary && activeTab === 'summary' && (
        <button
          onClick={() => {
             // Simple share text fallback
             if (navigator.share) {
               navigator.share({
                 title: 'รายงานการทานยา',
                 text: summary
               }).catch(console.error);
             } else {
               navigator.clipboard.writeText(summary);
               alert('คัดลอกข้อความแล้ว');
             }
          }}
          className="w-full bg-gray-800 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
        >
          <Share2 size={18} /> ส่งต่อ / คัดลอก
        </button>
      )}
    </div>
  );
};

export default PharmacistReport;
