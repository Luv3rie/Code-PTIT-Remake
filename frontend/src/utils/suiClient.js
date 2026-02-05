// Thử chuyển sang dùng sui.js/client
import { SuiClient } from '@mysten/sui.js/client';

const RPC_URL = "https://fullnode.testnet.sui.io:443";

const client = new SuiClient({ 
    url: RPC_URL
});

// Minimal JSON-RPC helper for querying objects when the SDK instance
// doesn't expose `queryObjects`. Uses the same fullnode RPC endpoint.
export async function queryObjects(params) {
    const body = {
        jsonrpc: "2.0",
        id: 1,
        method: "sui_queryObjects",
        params: [params.filter || {}, params.options || {}]
    };

    const res = await fetch(RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const j = await res.json();
    if (j.error) throw j.error;
    return j.result;
}

export { client };