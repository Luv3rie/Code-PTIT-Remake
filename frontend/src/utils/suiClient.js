// Thử cách này cho phiên bản SDK mới nhất
import { SuiClient } from '@mysten/sui/client';

// Thay vì dùng getFullnodeUrl, bạn có thể truyền thẳng URL của Testnet
const client = new SuiClient({ 
    url: "https://fullnode.testnet.sui.io:443" 
});

export { client };