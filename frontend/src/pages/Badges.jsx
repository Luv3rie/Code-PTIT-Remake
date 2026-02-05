import React, { useState, useEffect, useContext } from 'react';
import { StudentContext } from '../contexts/StudentContext.jsx';
import { fetchUserBadges } from '../utils/queries.js';
// import { mintBadgeTx } from '../utils/transactions'; // Bạn C chuẩn bị hàm này nhé

const Badges = () => {
  const { account, profile } = useContext(StudentContext);
  const [userBadges, setUserBadges] = useState([]); 
  const [loading, setLoading] = useState(true);

  const systemBadges = [
    { name: "Memory God", lang: "C++", req: 50, description: "Giải hơn 50 bài C++" },
    { name: "Pointer Survivor", lang: "C++", req: 15, description: "Giải hơn 15 bài C++" },
    { name: "Move Architect", lang: "Move", req: 50, description: "Giải hơn 50 bài Move" },
    { name: "Object Apprentice", lang: "Move", req: 15, description: "Giải hơn 15 bài Move" },
  ];

  useEffect(() => {
    const loadBadges = async () => {
      if (account?.address) {
        setLoading(true);
        const owned = await fetchUserBadges(account.address); 
        setUserBadges(owned); 
        setLoading(false);
      }
    };
    loadBadges();
  }, [account]);

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-black text-slate-800 mb-10">BỘ SƯU TẬP HUY HIỆU</h1>

      {loading ? <div className="animate-pulse text-center">Đang kiểm tra kho huy hiệu...</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {systemBadges.map((badge, index) => {
            // 1. Kiểm tra đã có Object Badge trong ví chưa
            const isOwned = userBadges.some(ub => ub.rank === badge.name && ub.language === badge.lang);
            
            // 2. Kiểm tra chỉ số từ Profile để xem đủ điều kiện mint chưa (Logic từ smart contract)
            const solvedInLang = profile?.language_stats?.[badge.lang] || 0;
            const canMint = solvedInLang >= badge.req && !isOwned;

            return (
              <div key={index} className={`relative p-6 rounded-3xl border-4 transition-all ${
                  isOwned ? 'border-yellow-400 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'
              }`}>
                <div className="text-4xl text-center mb-4">{isOwned ? '🏆' : '🔒'}</div>
                <h3 className="font-bold text-center">{badge.name}</h3>
                <p className="text-center text-xs text-slate-400 mt-2 mb-4">{badge.description}</p>
                
                {/* Nút bấm dành cho User đủ điều kiện nhưng chưa nhấn nhận */}
                {canMint && (
                  <button 
                    className="w-full py-2 bg-yellow-400 text-white font-bold rounded-xl text-xs hover:bg-yellow-500"
                    onClick={() => alert("Gửi yêu cầu nhận badge tới Admin!")}
                  >
                    NHẬN NGAY
                  </button>
                )}

                {isOwned && (
                  <div className="text-center text-emerald-500 text-[10px] font-bold">✓ ĐÃ SỞ HỮU</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Badges;