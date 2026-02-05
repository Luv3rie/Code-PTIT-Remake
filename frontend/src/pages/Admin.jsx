import React, { useState, useEffect } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
// import { fetchAllProfiles, fetchAllChallenges } from '../utils/queries'; // Logic bạn C đã có

const Admin = () => {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  // 1. Chốt chặn Admin: Chỉ ví có ID khớp với .env mới vào được
  const isAdmin = account?.address === import.meta.env.VITE_ADMIN_ID;

  // States quản lý dữ liệu
  const [challenges, setChallenges] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [newChallenge, setNewChallenge] = useState({ name: '', difficulty: 1, points: 10 });

  // 2. Hàm tạo bài tập mới
  const handleCreateChallenge = () => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::code_ptit::create_challenge`,
      arguments: [
        tx.object(import.meta.env.VITE_ADMIN_CAP_ID), // Lấy Admin ID từ file .env
        tx.pure.string(newChallenge.name),
        tx.pure.u8(newChallenge.difficulty),
        tx.pure.u64(newChallenge.points),
      ],
    });

    signAndExecute({ transaction: tx }, {
      onSuccess: () => alert("Đã tạo bài tập thành công!"),
    });
  };

  // 3. Hàm xóa bài tập (Dành cho Leader bảo xóa bài lỗi)
  const handleDeleteChallenge = (challengeId) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::code_ptit::delete_challenge`, // Giả định hàm xóa bạn đã thêm
      arguments: [
        tx.object(import.meta.env.VITE_ADMIN_CAP_ID),
        tx.object(challengeId),
      ],
    });
    signAndExecute({ transaction: tx });
  };

  if (!isAdmin) return (
    <div className="p-20 text-center font-bold text-red-500 uppercase tracking-widest">
      🚫 Cảnh báo: Bạn không có quyền quản trị!
    </div>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <h1 className="text-4xl font-black text-slate-900 border-b-4 border-slate-900 pb-4">
        CONTROL PANEL (ADMIN)
      </h1>

      {/* FORM TẠO BÀI TẬP - Bạn B sẽ trang trí lại các Input này */}
      <section className="bg-white p-8 rounded-3xl shadow-lg border-2 border-slate-100">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">📝 Tạo Thử Thách Mới</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            className="border-2 p-3 rounded-xl focus:border-blue-500 outline-none"
            placeholder="Tên bài tập..."
            onChange={(e) => setNewChallenge({...newChallenge, name: e.target.value})}
          />
          <input 
            type="number" className="border-2 p-3 rounded-xl"
            placeholder="Độ khó (1-5)"
            onChange={(e) => setNewChallenge({...newChallenge, difficulty: parseInt(e.target.value)})}
          />
          <input 
            type="number" className="border-2 p-3 rounded-xl"
            placeholder="Điểm thưởng"
            onChange={(e) => setNewChallenge({...newChallenge, points: parseInt(e.target.value)})}
          />
        </div>
        <button 
          onClick={handleCreateChallenge}
          className="mt-6 w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all"
        >
          PUBLISH CHALLENGE TO BLOCKCHAIN
        </button>
      </section>

      {/* DANH SÁCH QUẢN LÝ - Bạn B thiết kế Table ở đây */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <h3 className="font-bold text-lg mb-4">📚 Bài tập hiện có</h3>
          <div className="space-y-2">
             {/* Map challenges ở đây */}
             <p className="text-slate-400 italic">Dữ liệu từ fetchAllChallenges()...</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <h3 className="font-bold text-lg mb-4">🎓 Hồ sơ sinh viên</h3>
          <div className="space-y-2">
             {/* Map profiles ở đây */}
             <p className="text-slate-400 italic">Dữ liệu từ fetchAllProfiles()...</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admin;