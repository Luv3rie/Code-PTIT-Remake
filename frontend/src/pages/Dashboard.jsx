import React, { useContext, useMemo } from 'react';
import { StudentContext } from '../contexts/StudentContext.jsx'; // Import context bạn C đã làm

const Dashboard = () => {
  // Lấy dữ liệu từ Context của bạn C
  const { profile, loading } = useContext(StudentContext);

  // Giả sử có danh sách tất cả bài tập để random (Bạn C sẽ cung cấp qua props hoặc fetch)
  const allChallenges = []; 

  // Logic chọn 2 bài tập ngẫu nhiên
  const randomChallenges = useMemo(() => {
    return [...allChallenges].sort(() => 0.5 - Math.random()).slice(0, 2);
  }, [allChallenges]);

  if (loading) return <div className="p-10 text-center">Đang tải hồ sơ...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* SECTION 1: THÔNG TIN CÁ NHÂN */}
      <div className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border">
        <img 
          src={profile?.avatar_url || 'https://via.placeholder.com/100'} 
          alt="Avatar" 
          className="w-24 h-24 rounded-full border-4 border-blue-500"
        />
        <div>
          <h2 className="text-3xl font-bold text-slate-800">{profile?.nickname || 'Chưa đặt tên'}</h2>
          <p className="text-slate-500 font-mono">MSSV: {profile?.student_id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* SECTION 2: THỐNG KÊ */}
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

        {/* SECTION 3: BÀI TẬP GỢI Ý (Bạn B trang trí ở đây) */}
        <div className="md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300">
          <h4 className="text-lg font-bold mb-4 text-slate-700">🎯 Thử thách dành cho bạn</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {randomChallenges.length > 0 ? randomChallenges.map(ch => (
              <div key={ch.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <h5 className="font-bold">{ch.name}</h5>
                <p className="text-xs text-slate-400">Độ khó: {ch.difficulty}</p>
                <button className="mt-3 w-full py-2 bg-slate-800 text-white rounded-lg text-sm">Làm ngay</button>
              </div>
            )) : <p className="text-slate-400 italic">Đang cập nhật bài tập mới...</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;