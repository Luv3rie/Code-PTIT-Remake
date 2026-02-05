import React, { useState } from 'react';

const Leaderboard = () => {
  const [leaderboardData] = useState([
    { rank: 1, nickname: 'Nguyễn Văn A', studentId: 'PT123456', solved: 15, totalScore: 450, language: 'C++' },
    { rank: 2, nickname: 'Trần Thị B', studentId: 'PT123457', solved: 13, totalScore: 410, language: 'JavaScript' },
    { rank: 3, nickname: 'Lê Minh C', studentId: 'PT123458', solved: 12, totalScore: 380, language: 'Move' },
    { rank: 4, nickname: 'Phạm Quốc D', studentId: 'PT123459', solved: 11, totalScore: 350, language: 'C++' },
    { rank: 5, nickname: 'Hoàng Thu E', studentId: 'PT123460', solved: 10, totalScore: 320, language: 'JavaScript' },
    { rank: 6, nickname: 'Võ Hữu F', studentId: 'PT123461', solved: 9, totalScore: 290, language: 'C++' },
    { rank: 7, nickname: 'Đặng Anh G', studentId: 'PT123462', solved: 8, totalScore: 260, language: 'Move' },
    { rank: 8, nickname: 'Bùi Khắc H', studentId: 'PT123463', solved: 7, totalScore: 230, language: 'JavaScript' },
    { rank: 9, nickname: 'Tạ Minh I', studentId: 'PT123464', solved: 6, totalScore: 200, language: 'C++' },
    { rank: 10, nickname: 'Kế Văn K', studentId: 'PT123465', solved: 5, totalScore: 170, language: 'Move' },
  ]);

  const getMedalColor = (rank) => {
    if (rank === 1) return 'bg-yellow-400';
    if (rank === 2) return 'bg-gray-400';
    if (rank === 3) return 'bg-orange-400';
    return 'bg-slate-200';
  };

  const getMedalIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🏅';
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 mb-2">TOP SINH VIÊN</h1>
        <p className="text-slate-500">Bảng xếp hạng những lập trình viên xuất sắc nhất</p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100">
        <div className="grid grid-cols-12 gap-4 bg-slate-900 text-white p-6 font-bold text-sm">
          <div className="col-span-1">XẾP HẠNG</div>
          <div className="col-span-3">TÊN SINH VIÊN</div>
          <div className="col-span-2">MSSV</div>
          <div className="col-span-2">BÀI GIẢI</div>
          <div className="col-span-2">ĐIỂM</div>
          <div className="col-span-2">NGÔN NGỮ</div>
        </div>

        <div className="divide-y divide-slate-200">
          {leaderboardData.map((leader, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-12 gap-4 p-6 items-center hover:bg-slate-50 transition-colors ${
                leader.rank <= 3 ? 'bg-slate-50' : ''
              }`}
            >
              <div className="col-span-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${getMedalColor(
                    leader.rank
                  )}`}
                >
                  {getMedalIcon(leader.rank)}
                </div>
              </div>
              
              <div className="col-span-3">
                <p className="font-bold text-slate-900">{leader.nickname}</p>
              </div>
              
              <div className="col-span-2">
                <p className="text-slate-500 font-mono text-sm">{leader.studentId}</p>
              </div>
              
              <div className="col-span-2">
                <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold">
                  {leader.solved} bài
                </div>
              </div>
              
              <div className="col-span-2">
                <p className="font-black text-2xl text-emerald-600">{leader.totalScore}</p>
              </div>
              
              <div className="col-span-2">
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-bold ${
                    leader.language === 'C++'
                      ? 'bg-purple-100 text-purple-700'
                      : leader.language === 'JavaScript'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {leader.language}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white p-6 rounded-2xl shadow-lg">
          <p className="opacity-80 text-sm">HUY HIỆU VÀNG</p>
          <h3 className="text-3xl font-black">Top 1</h3>
          <p className="text-sm mt-2 opacity-90">Bạn là người giỏi nhất!</p>
        </div>
        
        <div className="bg-gradient-to-br from-slate-400 to-slate-500 text-white p-6 rounded-2xl shadow-lg">
          <p className="opacity-80 text-sm">HUY HIỆU BẠC</p>
          <h3 className="text-3xl font-black">Top 2</h3>
          <p className="text-sm mt-2 opacity-90">Người thứ hai giỏi nhất</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 text-white p-6 rounded-2xl shadow-lg">
          <p className="opacity-80 text-sm">HUY HIỆU ĐỒNG</p>
          <h3 className="text-3xl font-black">Top 3</h3>
          <p className="text-sm mt-2 opacity-90">Người thứ ba giỏi nhất</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
