import React from 'react';
import { Trophy, Code2, User, Clock, Award } from 'lucide-react';

// Dữ liệu mẫu (Mock Data) - Sau này người B sẽ thay bằng dữ liệu từ Blockchain
const mockStudent = {
  student_id: "B22DCCN123",
  nickname: "SuiMaster_PTIT",
  avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sui",
  major_language: "C++",
  last_submission: "2 phút trước",
  stats: [
    { lang: "C++", solved: 52, rank: "Memory God" },
    { lang: "Move", solved: 18, rank: "Object Apprentice" },
    { lang: "JavaScript", solved: 5, rank: "Newbie" },
  ]
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          CODE PTIT 2.0 <span className="text-xs font-mono text-slate-500 uppercase">Web3 Edition</span>
        </h1>
        <button className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-full font-medium transition-all shadow-lg shadow-blue-900/20">
          Kết nối ví Sui
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Cột 1: Thông tin cá nhân (StudentProfile) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-slate-800 mb-4 border-2 border-blue-500 overflow-hidden">
              <img src={mockStudent.avatar_url} alt="avatar" />
            </div>
            <h2 className="text-xl font-bold">{mockStudent.nickname}</h2>
            <p className="text-slate-400 text-sm mb-4">{mockStudent.student_id}</p>
            <div className="flex gap-2 w-full">
              <div className="flex-1 bg-slate-800 p-3 rounded-xl text-center">
                <p className="text-xs text-slate-500 uppercase">Ngôn ngữ chính</p>
                <p className="font-bold text-blue-400">{mockStudent.major_language}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cột 2: Thống kê (language_stats) */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-6">
            <Trophy className="text-yellow-500" size={20} />
            Tiến độ học tập
          </h3>
          <div className="space-y-4">
            {mockStudent.stats.map((item) => (
              <div key={item.lang} className="bg-slate-800/50 p-4 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-700 p-2 rounded-lg text-blue-300">
                    <Code2 size={18} />
                  </div>
                  <div>
                    <p className="font-medium">{item.lang}</p>
                    <p className="text-xs text-slate-400 italic text-yellow-500/80">{item.rank}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-mono font-bold">{item.solved}</p>
                  <p className="text-[10px] text-slate-500 uppercase">Bài đã giải</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cột 3: Huy hiệu & Hoạt động (LanguageBadge) */}
        <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
           <h3 className="flex items-center gap-2 text-lg font-semibold mb-6">
            <Award className="text-purple-500" size={20} />
            Huy hiệu đạt được (NFT)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Đây là các Object LanguageBadge từ Move */}
            <div className="border border-purple-500/30 bg-purple-500/5 rounded-xl p-4 text-center">
               <div className="w-12 h-12 bg-purple-500/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Award className="text-purple-400" />
               </div>
               <p className="text-sm font-bold">Memory God</p>
               <p className="text-[10px] text-purple-300/60 uppercase">C++ Expert</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}