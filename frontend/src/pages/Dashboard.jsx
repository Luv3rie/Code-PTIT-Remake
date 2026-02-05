import React, { useContext, useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentContext } from '../contexts/StudentContext.jsx';
import { fetchAllChallenges } from '../utils/queries';

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, loading } = useContext(StudentContext);
  const [allChallenges, setAllChallenges] = useState([]);

  useEffect(() => {
    fetchAllChallenges().then(setAllChallenges).catch(() => setAllChallenges([]));
  }, []);

  const randomChallenges = useMemo(() => {
    return [...allChallenges].sort(() => 0.5 - Math.random()).slice(0, 2);
  }, [allChallenges]);

  if (loading) return <div className="p-10 text-center">Đang tải hồ sơ...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border">
        <img 
          src={profile?.avatar_url || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23e2e8f0" width="100" height="100"/><text x="50" y="55" font-size="12" text-anchor="middle" fill="%236b7280">No Image</text></svg>'} 
          alt="Avatar" 
          className="w-24 h-24 rounded-full border-4 border-blue-500"
        />
        <div>
          <h2 className="text-3xl font-bold text-slate-800">{profile?.nickname || 'Chưa đặt tên'}</h2>
          <p className="text-slate-500 font-mono">MSSV: {profile?.student_id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg">
            <p className="text-sm opacity-80">Tổng điểm tích lũy</p>
            <h3 className="text-4xl font-black">{profile?.total_score || 0}</h3>
          </div>
          <div className="bg-emerald-500 text-white p-6 rounded-2xl shadow-lg">
            <p className="text-sm opacity-80">Bài tập đã giải</p>
            <h3 className="text-4xl font-black">{profile?.total_solved || 0}</h3>
          </div>
        </div>
        <div className="md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300">
          <h4 className="text-lg font-bold mb-4 text-slate-700">🎯 Thử thách dành cho bạn</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {randomChallenges.length > 0 ? randomChallenges.map(ch => (
              <div key={ch.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <h5 className="font-bold">{ch.name}</h5>
                <p className="text-xs text-slate-400">Độ khó: {ch.difficulty}</p>
                <button onClick={() => navigate(`/challenges/${ch.id}`)} className="mt-3 w-full py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-blue-600 transition-all">Làm ngay</button>
              </div>
            )) : <p className="text-slate-400 italic">Đang cập nhật bài tập mới...</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;