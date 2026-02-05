// Thử chuyển sang dùng sui.js/client
import { SuiClient } from '@mysten/sui.js/client';

const client = new SuiClient({ 
    url: "https://fullnode.testnet.sui.io:443" 
});

export { client };