import React, { useState, useEffect } from 'react';
import { useStudent } from '../contexts/StudentContext';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

const Profile = () => {
  const { profile, refetchProfile, isLoading } = useStudent();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  // State cục bộ để bạn B gắn vào các ô Input
  const [formData, setFormData] = useState({
    nickname: '',
    avatar_url: '',
    major_language: ''
  });

  // Cập nhật state khi profile từ Context đã load xong
  useEffect(() => {
    if (profile) {
      setFormData({
        nickname: profile.nickname,
        avatar_url: profile.avatar_url,
        major_language: profile.major_language
      });
    }
  }, [profile]);

  // Hàm gọi Smart Contract update_profile
  const handleUpdate = () => {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::code_ptit::update_profile`,
      arguments: [
        tx.object(profile.id.id), // ID của StudentProfile object
        tx.pure.string(formData.nickname),
        tx.pure.string(formData.avatar_url),
        tx.pure.string(formData.major_language),
      ],
    });

    signAndExecute({ transaction: tx }, {
      onSuccess: () => {
        alert("Cập nhật hồ sơ thành công!");
        refetchProfile(); // Load lại dữ liệu mới nhất
      },
      onError: (err) => alert("Lỗi cập nhật: " + err.message)
    });
  };

  if (isLoading) return <div className="p-20 text-center">Đang tải dữ liệu ví...</div>;
  if (!profile) return <div className="p-20 text-center text-orange-500">Bạn chưa có hồ sơ. Hãy liên hệ Admin để tạo!</div>;

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <h1 className="text-3xl font-black text-slate-800 mb-8 border-b pb-4">CHỈNH SỬA HỒ SƠ</h1>
        
        <div className="space-y-6">
          {/* Bạn B sẽ thêm label và style cho các div này */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nickname</label>
            <input 
              className="w-full border-2 p-3 rounded-xl outline-none focus:border-blue-500"
              value={formData.nickname}
              onChange={(e) => setFormData({...formData, nickname: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">URL Ảnh đại diện</label>
            <input 
              className="w-full border-2 p-3 rounded-xl outline-none focus:border-blue-500"
              value={formData.avatar_url}
              onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Ngôn ngữ chính</label>
            <select 
              className="w-full border-2 p-3 rounded-xl outline-none"
              value={formData.major_language}
              onChange={(e) => setFormData({...formData, major_language: e.target.value})}
            >
              <option value="C++">C++</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Move">Move</option>
            </select>
          </div>

          <button 
            onClick={handleUpdate}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg"
          >
            LƯU THAY ĐỔI TRÊN BLOCKCHAIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;