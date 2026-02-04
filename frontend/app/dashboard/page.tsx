'use client';

import React from 'react';
import { Trophy, Code2, Award, Wallet, Info } from 'lucide-react';
import { 
  ConnectButton, 
  useCurrentAccount, 
  useSuiClientQuery 
} from '@mysten/dapp-kit';
import { PACKAGE_ID } from '../constants';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const account = useCurrentAccount();

  // Truy vấn dữ liệu Profile từ Blockchain dựa trên địa chỉ ví và Package ID
  const { data: profileData, isLoading } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: account?.address || '',
      filter: { StructType: `${PACKAGE_ID}::scoring::StudentProfile` },
      options: { showContent: true }
    },
    { enabled: !!account }
  );

  // Kiểm tra xem ví này đã tạo Profile chưa
  const hasProfile = profileData?.data && profileData.data.length > 0;
  const studentProfile = hasProfile 
    ? (profileData.data[0].data?.content as any)?.fields 
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            CODE PTIT 2.0 <span className="text-xs font-mono text-slate-500 uppercase">Web3 Edition</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono mt-1">Package: {PACKAGE_ID.slice(0, 10)}...</p>
        </div>
        
        {/* Nút kết nối ví chuẩn Sui dApp Kit */}
        <div className="scale-110">
          {mounted && <ConnectButton connectText="Kết nối ví Sui" />}
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {!account ? (
          /* Trạng thái chưa kết nối ví */
          <div className="flex flex-col items-center justify-center py-24 bg-slate-900/50 border border-slate-800 rounded-3xl border-dashed">
            <Wallet className="text-slate-700 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-slate-400">Yêu cầu kết nối ví</h2>
            <p className="text-slate-600 text-sm mt-2">Vui lòng kết nối ví Sui để truy cập dữ liệu học tập On-chain</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Cột 1: Thông tin cá nhân (Lấy từ Blockchain hoặc ví) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                <Info size={16} className="text-blue-400" />
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-slate-800 mb-4 border-2 border-blue-500 overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  {/* Avatar tạo tự động theo địa chỉ ví */}
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${account.address}`} 
                    alt="avatar" 
                  />
                </div>
                
                <h2 className="text-xl font-bold">
                  {studentProfile?.nickname || "Sui Learner"}
                </h2>
                <p className="text-blue-400 font-mono text-xs mt-1 truncate w-full px-4">
                  {account.address}
                </p>
                
                <div className="mt-6 w-full space-y-3">
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Mã sinh viên (MSSV)</p>
                    <p className="font-bold text-slate-200">
                      {studentProfile?.student_id || "CHƯA ĐĂNG KÝ"}
                    </p>
                  </div>
                  
                  {!hasProfile && (
                    <button className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-lg text-xs font-bold transition-all animate-pulse">
                      KHỞI TẠO PROFILE NGAY
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Cột 2: Thống kê (language_stats) */}
            <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <Trophy className="text-yellow-500" size={20} />
                  Tiến độ On-chain
                </h3>
                <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded border border-yellow-500/20 uppercase font-bold">
                  Testnet
                </span>
              </div>
              
              <div className="space-y-4">
                {/* Nếu có Profile thì Map dữ liệu thật, nếu chưa thì hiện trạng thái trống */}
                {hasProfile ? (
                  /* Logic map language_stats từ contract sẽ nằm ở đây */
                  <div className="text-center py-10 text-slate-600 italic">
                    Đang tải dữ liệu bài tập...
                  </div>
                ) : (
                  <div className="text-center py-10 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                    <p className="text-sm text-slate-500">Chưa có dữ liệu bài tập được ghi nhận</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cột 3: Huy hiệu & NFT */}
            <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-6">
                <Award className="text-purple-500" size={20} />
                Huy hiệu đạt được (Sui Objects)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Mẫu hiển thị 1 NFT */}
                <div className="border border-purple-500/30 bg-purple-500/5 rounded-xl p-4 text-center opacity-50 grayscale hover:grayscale-0 transition-all cursor-not-allowed">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Award className="text-purple-400" />
                  </div>
                  <p className="text-sm font-bold text-slate-400">Chưa mở khóa</p>
                  <p className="text-[10px] text-purple-300/40 uppercase font-mono">ID: 0x...</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}