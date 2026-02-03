'use client';

import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';

export default function Home() {
  const account = useCurrentAccount();

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Header / Logo */}
      <div className="text-center mb-12">
        <div className="bg-red-600 text-white px-6 py-2 rounded-lg inline-block font-bold text-2xl mb-4 shadow-lg">
          PTIT
        </div>
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
          CODE <span className="text-red-600">REMAKE</span> 2.0
        </h1>
        <p className="text-slate-500 mt-2 font-medium">Hệ thống chấm bài On-chain dành cho sinh viên</p>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl max-w-md w-full text-center transition-all hover:shadow-2xl">
        {!account ? (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800">Yêu cầu đăng nhập</h2>
              <p className="text-slate-500 text-sm mt-1">Kết nối ví Sui để xác thực danh tính sinh viên</p>
            </div>
            
            {/* Nút Connect Wallet từ thư viện */}
            <div className="flex justify-center transform scale-110">
              <ConnectButton connectText="Đăng nhập ngay" />
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800">Chào mừng sinh viên!</h2>
              <p className="text-xs text-slate-400 mt-2 font-mono break-all px-4 py-2 bg-slate-50 rounded-lg">
                {account.address}
              </p>
            </div>

            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-md shadow-red-200">
              Vào Bảng Bài Tập
            </button>
          </>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-12 text-slate-400 text-xs flex gap-4 uppercase tracking-widest font-semibold">
        <span>Sui Testnet</span>
        <span>•</span>
        <span>Next.js 15</span>
        <span>•</span>
        <span>Tailwind CSS</span>
      </div>
    </main>
  );
}