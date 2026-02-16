
import React, { useState, useRef } from 'react';
import { Receipt } from '../types.ts';

interface Props {
  receipts: Receipt[];
  onDelete: (id: string) => void;
  onUpload: (file: File) => void;
  onOpenScanner: () => void;
}

const HistoryView: React.FC<Props> = ({ receipts, onDelete, onUpload, onOpenScanner }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const total = receipts.reduce((acc, curr) => acc + curr.total, 0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div 
      className={`flex flex-col h-full safe-area-top transition-colors duration-300 ${isDragging ? 'bg-blue-50/50' : 'bg-[#F2F2F7]'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <header className="px-6 pt-12 pb-6">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Activity</h1>
        
        {/* Quick Scan Card / Drop Zone */}
        <div 
          className={`mt-6 p-1 rounded-[2rem] transition-all duration-300 ${isDragging ? 'bg-blue-400 scale-[1.02] shadow-xl' : 'bg-white shadow-sm'}`}
        >
          <div className="bg-white rounded-[1.8rem] p-6 border-2 border-dashed border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Scan Receipt</h3>
            <p className="text-gray-400 text-sm mb-6 px-4">Drop an image here or use your camera to capture a new receipt.</p>
            
            <div className="flex gap-3 w-full">
              <button 
                onClick={onOpenScanner}
                className="flex-1 bg-blue-500 text-white font-bold py-3 px-4 rounded-2xl active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"/></svg>
                Camera
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 px-4 rounded-2xl active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
                Upload
              </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between items-end">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Spending</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">${total.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Scans</p>
            <p className="text-xl font-bold text-blue-500">{receipts.length}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-24 relative">
        {receipts.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-gray-400 opacity-40">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            <p className="font-medium">Recent items will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Recent Activity</h4>
            {receipts.map(receipt => (
              <div key={receipt.id} className="bg-white rounded-[1.5rem] p-4 flex items-center shadow-sm border border-gray-100 group">
                <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={receipt.imageUrl} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="ml-4 flex-1 overflow-hidden">
                  <p className="font-bold text-gray-900 truncate">{receipt.merchant}</p>
                  <p className="text-gray-400 text-xs font-medium">{receipt.date} • {receipt.category}</p>
                </div>
                <div className="text-right ml-2">
                  <p className="font-bold text-gray-900">${receipt.total.toFixed(2)}</p>
                  <button 
                    onClick={() => onDelete(receipt.id)}
                    className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
