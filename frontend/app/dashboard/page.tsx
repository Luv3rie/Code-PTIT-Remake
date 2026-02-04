'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Code2, Award, Wallet, Info, Settings, ArrowRight, ExternalLink, CheckCircle2, Star, LayoutDashboard, ShieldCheck, BookOpen } from 'lucide-react';
import { 
  ConnectButton, 
  useCurrentAccount, 
  useSuiClientQuery 
} from '@mysten/dapp-kit';
import { PACKAGE_ID } from '../constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  useEffect(() => setMounted(true), []);

  const account = useCurrentAccount();

  // THAY ĐỔI Ở ĐÂY: Vì Profile là Shared Object, ta phải tìm object theo Type 
  // và lọc những cái có trường `owner` khớp với địa chỉ ví hiện tại.
  const { data: allProfiles } = useSuiClientQuery(
    'queryObjects',
    {
      filter: { StructType: `${PACKAGE_ID}::scoring::StudentProfile` },
      options: { showContent: true }
    },
    { enabled: !!account }
  );

  // Tìm profile của chính sinh viên này trong danh sách Shared Objects
  const studentProfileData = allProfiles?.data?.find((obj: any) => {
    const fields = (obj.data?.content as any)?.fields;
    return fields?.owner === account?.address;
  });

  const hasProfile = !!studentProfileData;
  const studentProfile = hasProfile 
    ? (studentProfileData.data?.content as any)?.fields 
    : null;

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-50">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-[#0a0c10]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              CODE PTIT 2.0
            </h1>
            
            <div className="hidden md:flex items-center gap-1">
              <Link href="/" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname === '/' ? 'bg-blue-500/10 text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link href="/challenges" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 transition-all">
                <BookOpen size={16} /> Bài tập
              </Link>
              <Link href="/admin" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 transition-all">
                <ShieldCheck size={16} /> Admin
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="scale-90">
              {mounted && <ConnectButton connectText="Kết nối ví" />}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {!account ? (
          <div className="flex flex-col items-center justify-center py-32 bg-slate-900/20 border border-slate-800 rounded-3xl border-dashed">
            <Wallet className="text-slate-700 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-slate-400">Yêu cầu kết nối ví Sui</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* CỘT TRÁI: PROFILE */}
            <div className="md:col-span-4 space-y-6">
              <div className="bg-[#11141d] border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group h-fit">
                <div className="flex flex-col items-center text-center">
                  <div className="w-28 h-28 rounded-full bg-slate-800 mb-4 border-2 border-blue-500/50 p-1 relative">
                    <img 
                      className="rounded-full"
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${account.address}`} 
                      alt="avatar" 
                    />
                    {hasProfile && <div className="absolute bottom-1 right-2 bg-blue-500 p-1 rounded-full border-2 border-[#11141d]"><CheckCircle2 size={14} /></div>}
                  </div>
                  
                  <h2 className="text-2xl font-bold">{studentProfile?.nickname || "Sui Learner"}</h2>
                  <p className="text-blue-400/60 font-mono text-[10px] mt-1 bg-blue-500/5 px-3 py-1 rounded-full border border-blue-500/10">
                    {account.address.slice(0, 6)}...{account.address.slice(-4)}
                  </p>
                  
                  <div className="mt-8 w-full space-y-4">
                    <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800/50 text-left">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Mã sinh viên (MSSV)</p>
                      <p className="text-lg font-mono font-bold text-slate-200">
                        {studentProfile?.student_id || "CHƯA ĐĂNG KÝ"}
                      </p>
                    </div>

                    <Link href="/profile/edit" className="block w-full">
                      <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-2xl text-xs font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]">
                        <Settings size={16} /> CHỈNH SỬA HỒ SƠ
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI */}
            <div className="md:col-span-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-600/20 via-transparent to-transparent border border-blue-500/20 p-6 rounded-3xl">
                  <div className="flex items-center gap-3 mb-2 text-blue-400">
                    <Star size={20} />
                    <p className="text-slate-400 text-sm font-medium">Tổng điểm</p>
                  </div>
                  <h3 className="text-3xl font-bold text-white">{studentProfile?.total_score || 0} <span className="text-xs font-normal text-slate-500">PTS</span></h3>
                </div>

                <div className="bg-gradient-to-br from-purple-600/20 via-transparent to-transparent border border-purple-500/20 p-6 rounded-3xl">
                  <div className="flex items-center gap-3 mb-2 text-purple-400">
                    <Code2 size={20} />
                    <p className="text-slate-400 text-sm font-medium">Đã giải</p>
                  </div>
                  <h3 className="text-3xl font-bold text-white">{studentProfile?.total_solved || 0} <span className="text-xs font-normal text-slate-500">BÀI</span></h3>
                </div>
              </div>

              <div className="bg-[#11141d] border border-slate-800 rounded-3xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold"><Trophy className="text-yellow-500" size={20} /> Tiến độ chi tiết</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider">Blockchain Live</span>
                  </div>
                </div>
                
                <div className="p-10 text-center border border-dashed border-slate-800 rounded-2xl">
                    <p className="text-sm text-slate-500 italic">
                     {hasProfile ? "Đang đồng bộ dữ liệu bài tập..." : "Vui lòng nhờ giảng viên đăng ký MSSV để bắt đầu"}
                    </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}