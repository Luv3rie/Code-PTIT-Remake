import React, { useState, useEffect } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import { useStudent } from '../contexts/StudentContext';

const Challenges = () => {
  const client = useSuiClient();
  const { profile, isLoading: profileLoading } = useStudent();
  
  const [selectedLang, setSelectedLang] = useState('C++');
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy ID của Table chứa các thử thách đã hoàn thành từ Profile
  // Trong Move: completed_challenges: Table<ID, bool>
  const completedTableId = profile?.completed_challenges?.fields?.id?.id;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // 1. Lấy tất cả bài tập (Shared Objects) từ Package ID
        const objects = await client.getOwnedObjects({
          owner: import.meta.env.VITE_PACKAGE_ID, 
          filter: { 
            StructType: `${import.meta.env.VITE_PACKAGE_ID}::code_ptit::Challenge` 
          },
          options: { showContent: true }
        });

        const allChallenges = objects.data.map(obj => ({
          id: obj.data.objectId,
          ...obj.data.content.fields
        }));

        // 2. Kiểm tra trạng thái "Đã làm" bằng cách check Dynamic Field trong Table
        const enriched = await Promise.all(allChallenges.map(async (ch) => {
          let isDone = false;
          if (completedTableId) {
            try {
              // Truy vấn vào Table để tìm Key là ID của bài tập
              const response = await client.getDynamicFieldObject({
                parentId: completedTableId,
                name: { type: '0x2::object::ID', value: ch.id }
              });
              isDone = !!response.data; // Nếu tìm thấy object thì là đã hoàn thành
            } catch (e) {
              isDone = false; // Lỗi thường là do Key không tồn tại -> Chưa làm
            }
          }
          return { ...ch, isDone };
        }));

        setChallenges(enriched);
      } catch (error) {
        console.error("Lỗi khi tải danh sách thử thách:", error);
      } finally {
        setLoading(false);
      }
    };

    // Chỉ chạy khi đã load xong Profile để có completedTableId
    if (!profileLoading) {
      loadData();
    }
  }, [completedTableId, client, profileLoading]);

  // Lọc theo ngôn ngữ đang chọn
  const filteredChallenges = challenges.filter(ch => ch.language === selectedLang);

  if (profileLoading) return <div className="p-20 text-center font-bold">Đang xác thực hồ sơ sinh viên...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900">DANH SÁCH THỬ THÁCH</h1>
          <p className="text-slate-500 mt-2">Vượt qua các thử thách để nhận huy hiệu Blockchain</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-400 block uppercase">Tiến độ của bạn</span>
          <span className="text-2xl font-black text-blue-600">
            {challenges.filter(c => c.isDone).length}/{challenges.length}
          </span>
        </div>
      </div>

      {/* TABS CHỌN NGÔN NGỮ */}
      <div className="flex gap-3 mb-10 bg-slate-100 p-2 rounded-2xl w-fit">
        {['C++', 'JavaScript', 'Move'].map(lang => (
          <button 
            key={lang}
            onClick={() => setSelectedLang(lang)}
            className={`px-8 py-3 rounded-xl font-black transition-all ${
              selectedLang === lang 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* DANH SÁCH BÀI TẬP */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-2xl"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredChallenges.length > 0 ? filteredChallenges.map(ch => (
            <div 
              key={ch.id} 
              className={`p-6 rounded-3xl border-2 transition-all flex justify-between items-center ${
                ch.isDone 
                  ? 'border-emerald-200 bg-emerald-50/50' 
                  : 'border-white bg-white shadow-sm hover:shadow-md hover:border-blue-100'
              }`}
            >
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl ${
                   ch.isDone ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {ch.difficulty}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-800">{ch.name}</h3>
                  <div className="flex gap-4 text-sm mt-1 font-medium">
                    <span className="text-blue-600 flex items-center gap-1">
                      <span className="text-lg">💎</span> {ch.point_value} điểm
                    </span>
                    <span className="text-slate-400 uppercase tracking-widest text-[10px] flex items-center">
                      ID: {ch.id.slice(0, 10)}...
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {ch.isDone ? (
                  <div className="bg-emerald-100 text-emerald-700 px-6 py-2 rounded-xl font-bold flex items-center gap-2">
                    <span>✓</span> HOÀN THÀNH
                  </div>
                ) : (
                  <button className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-slate-200">
                    THỬ NGAY
                  </button>
                )}
              </div>
            </div>
          )) : (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold">Chưa có bài tập nào cho ngôn ngữ {selectedLang}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Challenges;