import React, { useState } from 'react';
// Import các công cụ cần thiết từ dapp-kit
import { ConnectModal, useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';

const ConnectWalletCustom = () => {
  const [showModal, setShowModal] = useState(false);
  const account = useCurrentAccount(); // Lấy thông tin ví đang kết nối
  const { mutate: disconnect } = useDisconnectWallet(); // Hàm để ngắt kết nối

  // Hàm giúp rút gọn địa chỉ ví để hiển thị trên UI (VD: 0x1234...abcd)
  const formatAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  return (
    <div className="flex items-center">
      {account ? (
        /* TRẠNG THÁI: Đã kết nối ví */
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-2 pl-4 rounded-2xl border border-white/20 shadow-sm">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">Sui Network</span>
            <span className="text-sm font-black text-slate-800">{formatAddress(account.address)}</span>
          </div>
          
          <button 
            onClick={() => disconnect()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all transform active:scale-95"
          >
            ĐĂNG XUẤT
          </button>
        </div>
      ) : (
        /* TRẠNG THÁI: Chưa kết nối ví */
        <button 
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-blue-200 transition-all transform active:scale-95 flex items-center gap-2"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-300"></span>
          </span>
          KẾT NỐI VÍ SUI
        </button>
      )}

      {/* Modal mặc định của Sui - Bạn B không cần code giao diện cái này */}
      <ConnectModal
        open={showModal}
        onOpenChange={(isOpen) => setShowModal(isOpen)}
      />
    </div>
  );
};

export default ConnectWalletCustom;