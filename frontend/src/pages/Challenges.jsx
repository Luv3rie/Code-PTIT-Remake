import React, { useState, useEffect } from 'react';
import { fetchAllChallenges, checkChallengeStatus } from '../utils/queries.js'; // Logic của bạn C
// import { Link } from 'react-router-dom';

const Challenges = () => {
  const [selectedLang, setSelectedLang] = useState('C++');
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Giả sử lấy tableId từ StudentProfile (Bạn C lấy từ Context nhé)
  const completedTableId = "0x..."; 

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const all = await fetchAllChallenges();
      
      // Kiểm tra trạng thái làm bài cho từng challenge
      const enriched = await Promise.all(all.map(async (ch) => {
        const isDone = await checkChallengeStatus(completedTableId, ch.id);
        return { ...ch, isDone };
      }));

      setChallenges(enriched);
      setLoading(false);
    };
    loadData();
  }, [completedTableId]);

  // Lọc theo ngôn ngữ
  const filteredChallenges = challenges.filter(ch => ch.language === selectedLang);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-black mb-8">DANH SÁCH THỬ THÁCH</h1>

      {/* SECTION: CHỌN NGÔN NGỮ (Bạn B thiết kế Tab/Button ở đây) */}
      <div className="flex gap-4 mb-10">
        {['C++', 'JS', 'Move'].map(lang => (
          <button 
            key={lang}
            onClick={() => setSelectedLang(lang)}
            className={`px-6 py-2 rounded-full font-bold transition ${
              selectedLang === lang ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* SECTION: DANH SÁCH BÀI TẬP */}
      {loading ? <p>Đang tải bài tập...</p> : (
        <div className="grid grid-cols-1 gap-4">
          {filteredChallenges.map(ch => (
            <div 
              key={ch.id} 
              className={`p-5 rounded-2xl border-2 flex justify-between items-center ${
                ch.isDone ? 'border-emerald-100 bg-emerald-50' : 'border-slate-100 bg-white'
              }`}
            >
              <div>
                <h3 className="font-bold text-lg">{ch.name}</h3>
                <div className="flex gap-3 text-sm mt-1">
                  <span className="text-blue-600">💎 {ch.point_value} điểm</span>
                  <span className="text-slate-400">Độ khó: {ch.difficulty}</span>
                </div>
              </div>

              {/* Trạng thái làm bài */}
              <div className="flex items-center gap-4">
                {ch.isDone ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    ✅ Đã hoàn thành
                  </span>
                ) : (
                  <button className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold">
                    Thử ngay
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Challenges;