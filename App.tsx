
import React, { useState, useEffect } from 'react';
import { Receipt, View } from './types.ts';
import HistoryView from './components/HistoryView.tsx';
import CameraView from './components/CameraView.tsx';
import ReceiptEdit from './components/ReceiptEdit.tsx';
import { extractReceiptData } from './services/geminiService.ts';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('history');
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentScan, setCurrentScan] = useState<Partial<Receipt> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('receipts');
    if (saved) setReceipts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('receipts', JSON.stringify(receipts));
  }, [receipts]);

  const handleCapture = async (base64: string) => {
    setIsProcessing(true);
    setActiveView('history'); 
    try {
      const data = await extractReceiptData(base64);
      setCurrentScan({ ...data, imageUrl: base64, id: Date.now().toString() });
      setActiveView('edit');
    } catch (err) {
      console.error(err);
      alert("Failed to read receipt. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (base64) {
        handleCapture(base64);
      }
    };
    reader.onerror = () => {
      alert("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

  const saveReceipt = (receipt: Receipt) => {
    setReceipts(prev => [receipt, ...prev]);
    setActiveView('history');
    setCurrentScan(null);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F2F2F7]">
      <main className="flex-1 relative overflow-hidden">
        {activeView === 'history' && (
          <HistoryView 
            receipts={receipts} 
            onDelete={(id) => setReceipts(r => r.filter(x => x.id !== id))}
            onUpload={handleFileUpload}
          />
        )}
        {activeView === 'camera' && (
          <CameraView onCapture={handleCapture} onCancel={() => setActiveView('history')} />
        )}
        {activeView === 'edit' && currentScan && (
          <ReceiptEdit 
            data={currentScan} 
            onSave={saveReceipt} 
            onCancel={() => setActiveView('history')} 
          />
        )}

        {isProcessing && (
          <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-semibold text-gray-800">Analyzing Receipt...</p>
              <p className="text-gray-400 text-xs mt-2">Gemini AI is reading the text</p>
            </div>
          </div>
        )}
      </main>

      <nav className="h-20 bg-white/80 ios-blur border-t border-gray-200 flex items-center justify-around px-12 safe-area-bottom z-50">
        <button 
          onClick={() => setActiveView('history')}
          className={`flex flex-col items-center ${activeView === 'history' ? 'text-blue-500' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
          <span className="text-[10px] mt-1 font-medium">History</span>
        </button>
        <button 
          onClick={() => setActiveView('camera')}
          className="w-14 h-14 -mt-10 bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
          <span className="text-[10px] mt-1 font-medium">Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
