import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { SuiClientProvider, WalletProvider, createNetworkConfig } from '@mysten/dapp-kit';
// Bỏ import getFullnodeUrl vì bị lỗi không tìm thấy
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mysten/dapp-kit/dist/index.css';

// 1. Cấu hình mạng lưới bằng cách điền trực tiếp URL của Testnet
const { networkConfig } = createNetworkConfig({
    testnet: { url: "https://fullnode.testnet.sui.io:443" }, 
});

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>
);