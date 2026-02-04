'use client';
import "@mysten/dapp-kit/dist/index.css";
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Initialize QueryClient
const queryClient = new QueryClient();

// Define network configuration manually
// This bypasses the need for the getFullnodeUrl helper entirely
const { networkConfig } = createNetworkConfig({
    testnet: { 
        url: "https://fullnode.testnet.sui.io:443",
        // The type requires the network name to be explicitly defined
        network: 'testnet' as any 
    },
    mainnet: { 
        url: "https://fullnode.mainnet.sui.io:443",
        network: 'mainnet' as any
    },
});

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
                <WalletProvider autoConnect>
                    {children}
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    );
}