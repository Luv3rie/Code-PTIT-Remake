'use client';
import React, { useState } from 'react';
import { useCurrentAccount, useSuiClientQuery, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { Save, UserCircle, Loader2 } from 'lucide-react';
import { PACKAGE_ID } from '../constants';
import { toast } from 'react-hot-toast';

export default function EditProfile() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nickname: '',
    avatar: '',
    language: 'C++'
  });

  // 1. Tìm Profile ID của người dùng (vì là Shared Object)
  const { data: profiles } = useSuiClientQuery('queryObjects', {
    filter: { StructType: `${PACKAGE_ID}::scoring::StudentProfile` },
    options: { showContent: true }
  });

  const userProfile = profiles?.data?.find((obj: any) => 
    obj.data?.content?.fields?.owner === account?.address
  );

  const handleUpdate = async () => {
    if (!account || !userProfile) {
      toast.error("Không tìm thấy profile hoặc chưa kết nối ví");
      return;
    }

    setLoading(true);
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::scoring::update_profile`,
      arguments: [
        tx.object(userProfile.data.objectId), // Truyền Shared Object ID
        tx.pure.string(formData.nickname),
        tx.pure.string(formData.avatar)
      ],
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => {
          toast.success("Cập nhật thành công!");
          setLoading(false);
        },
        onError: (err) => {
          toast.error("Lỗi: " + err.message);
          setLoading(false);
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <UserCircle size={64} className="text-blue-500 mb-2" />
          <h1 className="text-2xl font-bold">Chỉnh sửa hồ sơ</h1>
          <p className="text-slate-500 text-sm italic underline">Dữ liệu Shared Object: {userProfile?.data?.objectId?.slice(0,10)}...</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Nickname mới</label>
            <input 
              type="text" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition"
              placeholder="Tên hiển thị..."
              onChange={(e) => setFormData({...formData, nickname: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Avatar URL</label>
            <input 
              type="text" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition"
              placeholder="https://..."
              onChange={(e) => setFormData({...formData, avatar: e.target.value})}
            />
          </div>

          <button 
            onClick={handleUpdate}
            disabled={loading || !userProfile}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}