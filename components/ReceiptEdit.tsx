
import React, { useState } from 'react';
import { Receipt, CATEGORIES } from '../types.ts';

interface Props {
  data: Partial<Receipt>;
  onSave: (receipt: Receipt) => void;
  onCancel: () => void;
}

const ReceiptEdit: React.FC<Props> = ({ data, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    merchant: data.merchant || '',
    total: data.total || 0,
    date: data.date || new Date().toISOString().split('T')[0],
    category: data.category || 'Other'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: data.id!,
      imageUrl: data.imageUrl!,
      timestamp: Date.now()
    } as Receipt);
  };

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7] safe-area-top">
      <header className="px-4 py-3 bg-white/80 ios-blur sticky top-0 border-b border-gray-100 flex items-center justify-between z-10">
        <button onClick={onCancel} className="text-blue-500 font-medium px-2">Cancel</button>
        <h2 className="font-bold text-gray-900">Verify Scan</h2>
        <button onClick={handleSubmit} className="text-blue-500 font-bold px-2">Done</button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="w-full aspect-[3/4] bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          <img src={data.imageUrl} className="w-full h-full object-cover" alt="Captured" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pb-12">
          <div className="bg-white rounded-2xl divide-y divide-gray-100 border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center px-4 py-3">
              <label className="text-gray-400 text-sm font-medium w-24">Merchant</label>
              <input 
                type="text" 
                value={formData.merchant}
                onChange={e => setFormData(prev => ({ ...prev, merchant: e.target.value }))}
                className="flex-1 bg-transparent border-none outline-none font-semibold text-gray-900 text-right"
              />
            </div>
            <div className="flex items-center px-4 py-3">
              <label className="text-gray-400 text-sm font-medium w-24">Amount</label>
              <div className="flex-1 flex justify-end items-center">
                <span className="font-bold text-gray-400 mr-1">$</span>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.total}
                  onChange={e => setFormData(prev => ({ ...prev, total: parseFloat(e.target.value) || 0 }))}
                  className="bg-transparent border-none outline-none font-bold text-gray-900 text-right w-24"
                />
              </div>
            </div>
            <div className="flex items-center px-4 py-3">
              <label className="text-gray-400 text-sm font-medium w-24">Date</label>
              <input 
                type="date" 
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="flex-1 bg-transparent border-none outline-none font-semibold text-gray-900 text-right appearance-none"
              />
            </div>
            <div className="flex items-center px-4 py-3">
              <label className="text-gray-400 text-sm font-medium w-24">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="flex-1 bg-transparent border-none outline-none font-semibold text-blue-500 text-right appearance-none cursor-pointer"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReceiptEdit;
