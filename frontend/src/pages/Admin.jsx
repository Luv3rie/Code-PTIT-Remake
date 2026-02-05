import React, { useState, useEffect } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { fetchAllProfiles, fetchAllChallenges } from '../utils/queries';

const Admin = () => {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const isAdmin = true;

  // States quản lý dữ liệu
  const [challenges, setChallenges] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [newChallenge, setNewChallenge] = useState({ name: '', difficulty: 1, points: 10 });

  useEffect(() => {
    const loadData = async () => {
      const ch = await fetchAllChallenges();
      const pr = await fetchAllProfiles();
      setChallenges(ch || []);
      setProfiles(pr || []);
    };
    loadData();
  }, []);

  const handleCreateChallenge = () => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::code_ptit::create_challenge`,
      arguments: [
        tx.object(import.meta.env.VITE_ADMIN_CAP_ID),
        tx.pure.string(newChallenge.name),
        tx.pure.u8(newChallenge.difficulty),
        tx.pure.u64(newChallenge.points),
      ],
    });

    signAndExecute({ transaction: tx }, {
      onSuccess: () => alert("Đã tạo bài tập thành công!"),
    });
  };

  const handleDeleteChallenge = (challengeId) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::code_ptit::delete_challenge`,
      arguments: [
        tx.object(import.meta.env.VITE_ADMIN_CAP_ID),
        tx.object(challengeId),
      ],
    });
    signAndExecute({ transaction: tx });
  };

  const handleDeleteProfile = (profileId) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::code_ptit::delete_profile`,
      arguments: [
        tx.object(import.meta.env.VITE_ADMIN_CAP_ID),
        tx.object(profileId),
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

      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <h3 className="font-bold text-lg mb-4">📚 Bài tập hiện có ({challenges.length})</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
             {challenges.length > 0 ? challenges.map((ch, i) => (
               <div key={i} className="p-3 bg-slate-50 rounded border-l-4 border-blue-500 flex justify-between items-center group hover:bg-blue-50 transition-colors">
                 <div className="flex-1">
                   <p className="font-semibold">{ch.name}</p>
                   <p className="text-xs text-slate-500">{ch.language} | Độ khó: {ch.difficulty} | {ch.point_value} điểm</p>
                 </div>
                 <button onClick={() => {
                   setChallenges(challenges.filter((_, index) => index !== i));
                 }} className="ml-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                   XÓA
                 </button>
               </div>
             )) : <p className="text-slate-400 italic">Không có dữ liệu</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <h3 className="font-bold text-lg mb-4">🎓 Hồ sơ sinh viên ({profiles.length})</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
             {profiles.length > 0 ? profiles.map((prof, i) => (
               <div key={i} className="p-3 bg-slate-50 rounded border-l-4 border-emerald-500 flex justify-between items-center group hover:bg-emerald-50 transition-colors">
                 <div className="flex-1">
                   <p className="font-semibold">{prof.nickname || prof.student_id}</p>
                   <p className="text-xs text-slate-500">MSSV: {prof.student_id} | Điểm: {prof.total_score || 0}</p>
                 </div>
                 <button onClick={() => {
                   setProfiles(profiles.filter((_, index) => index !== i));
                 }} className="ml-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                   XÓA
                 </button>
               </div>
             )) : <p className="text-slate-400 italic">Không có dữ liệu</p>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admin;