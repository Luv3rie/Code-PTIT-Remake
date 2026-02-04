'use client';
import React, { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Save, UserCircle } from 'lucide-react';

export default function EditProfile() {
  const account = useCurrentAccount();
  const [formData, setFormData] = useState({
    nickname: '',
    avatar: '',
    language: 'C++'
  });

  const handleUpdate = () => {
    // Đây là nơi gọi hàm Transaction từ ví (Người B sẽ giúp bạn phần này)
    console.log("Cập nhật blockchain với:", formData);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <UserCircle size={64} className="text-blue-500 mb-2" />
          <h1 className="text-2xl font-bold">Chỉnh sửa hồ sơ</h1>
          <p className="text-slate-500 text-sm italic">Cập nhật thông tin On-chain của bạn</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Nickname</label>
            <input 
              type="text" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition"
              placeholder="Nhập nickname mới..."
              onChange={(e) => setFormData({...formData, nickname: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Avatar URL</label>
            <input 
              type="text" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition"
              placeholder="https://image-url.com"
              onChange={(e) => setFormData({...formData, avatar: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Ngôn ngữ chính</label>
            <select 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition appearance-none"
              onChange={(e) => setFormData({...formData, language: e.target.value})}
            >
              <option>C++</option>
              <option>Java</option>
              <option>Python</option>
              <option>Move</option>
            </select>
          </div>

          <button 
            onClick={handleUpdate}
            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
          >
            <Save size={20} /> Lưu vào Blockchain
          </button>
        </div>
      </div>
    </div>
  );
}