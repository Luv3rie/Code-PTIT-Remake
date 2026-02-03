import { getFullnodeUrl } from "@mysten/sui.js/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

export const { networkConfig, useNetworkVariable, useNetworkVariables } = createNetworkConfig({
    testnet: { url: getFullnodeUrl("testnet"), network: "testnet" },
});