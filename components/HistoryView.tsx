
import React, { useState, useRef } from 'react';
import { Receipt } from '../types.ts';

interface Props {
  receipts: Receipt[];
  onDelete: (id: string) => void;
  onUpload: (file: File) => void;
}

const HistoryView: React.FC<Props> = ({ receipts, onDelete, onUpload }) => {
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
      className={`flex flex-col h-full safe-area-top transition-colors duration-200 ${isDragging ? 'bg-blue-50/50' : 'bg-[#F2F2F7]'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <header className="px-6 pt-12 pb-6">
        <div className="flex justify-between items-start">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Activity</h1>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-white rounded-full shadow-sm border border-gray-100 text-blue-500 active:scale-95 transition-transform"
            title="Upload Receipt"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
        </div>
        
        <div className="mt-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Spent</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">${total.toFixed(2)}</p>
          </div>
          <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl font-bold">
            {receipts.length} Scans
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-24 relative">
        {isDragging && (
          <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[2px] border-4 border-dashed border-blue-400 rounded-3xl m-4 flex items-center justify-center z-20 pointer-events-none">
            <div className="text-blue-600 flex flex-col items-center">
              <svg className="w-12 h-12 mb-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="font-bold">Drop receipt to scan</span>
            </div>
          </div>
        )}

        {receipts.length === 0 ? (
          <div 
            className="h-64 flex flex-col items-center justify-center text-gray-400 opacity-60 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            <p className="font-medium">No receipts yet</p>
            <p className="text-xs mt-1">Tap to upload or drop a file here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {receipts.map(receipt => (
              <div key={receipt.id} className="bg-white rounded-2xl p-4 flex items-center shadow-sm border border-gray-100 group">
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
