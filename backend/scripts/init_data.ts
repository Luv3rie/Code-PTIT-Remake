import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';

// --- CONFIGURATION (Thay đổi thông tin của bạn vào đây) ---
const CONFIG = {
    // 1. ID của Package sau khi deploy
    PACKAGE_ID: '0xb0025c444bfdbaa78e98c2edd2b4d6a8d82677093e5bdb94b6ba5054da729c2b', 
    
    // 2. ID của AdminCap (Lấy trong Explorer hoặc Terminal sau khi deploy)
    ADMIN_CAP_ID: '0xef6c8b2861ed7ef199e3e1cb71bdda9c237389ce91d8715bb059c907db9b471e',
    
    // 3. Private Key hoặc Mnemonic của ví Admin (Người deploy)
    // Nếu dùng Private Key (bắt đầu bằng suipriv...):
    SECRET_KEY: process.env.ADMIN_SECRET_KEY || '',
    
    // Mạng: 'testnet', 'devnet', hoặc 'mainnet'
    NETWORK: 'testnet' 
};

// Tên module trong file Move của bạn
const MODULE_NAME = 'code_ptit';

// --- DATA GIẢ LẬP ---

const DUMMY_CHALLENGES = [
    { name: "Two Sum", difficulty: 1, points: 100 },
    { name: "Reverse Linked List", difficulty: 2, points: 200 },
    { name: "Valid Palindrome", difficulty: 1, points: 100 },
    { name: "Merge Sort Implementation", difficulty: 3, points: 300 },
    { name: "Binary Tree Traversal", difficulty: 2, points: 200 },
    { name: "Dynamic Programming: Knapsack", difficulty: 4, points: 500 },
    { name: "Sui Move: Create Coin", difficulty: 3, points: 300 },
    { name: "Sui Move: NFT Marketplace", difficulty: 5, points: 1000 },
];

const DUMMY_STUDENTS = [
    { id: "B20DCCN001", name: "Alice Nguyen" },
    { id: "B20DCCN002", name: "Bob Tran" },
    { id: "B20DCCN003", name: "Charlie Le" },
    { id: "B20DCCN004", name: "David Pham" },
    { id: "B20DCCN999", name: "Hacker Man" },
];

// --- HÀM CHÍNH ---

async function main() {
    console.log("🚀 Đang khởi tạo kết nối đến Sui...");

    // 1. Setup Client và Ví
    const client = new SuiClient({ url: getFullnodeUrl(CONFIG.NETWORK as any) });
    
    // Xử lý keypair (hỗ trợ cả private key hoặc mnemonic nếu cần)
    let keypair;
    if (CONFIG.SECRET_KEY.startsWith('suiprivkey')) {
         keypair = Ed25519Keypair.fromSecretKey(CONFIG.SECRET_KEY);
    } else {
        // Fallback nếu bạn dùng cách khác để load key
        throw new Error("Vui lòng điền Private Key chuẩn (suiprivkey...)");
    }

    console.log(`🔑 Admin Address: ${keypair.toSuiAddress()}`);

    // 2. Khởi tạo Transaction Block (PTB)
    const tx = new Transaction();

    // --- BƯỚC A: TẠO BÀI TẬP (Batching) ---
    console.log(`📦 Đang đóng gói ${DUMMY_CHALLENGES.length} bài tập...`);
    
    for (const challenge of DUMMY_CHALLENGES) {
        tx.moveCall({
            target: `${CONFIG.PACKAGE_ID}::${MODULE_NAME}::create_challenge`,
            arguments: [
                tx.object(CONFIG.ADMIN_CAP_ID),      // Admin Cap
                tx.pure.string(challenge.name),      // Name
                tx.pure.u8(challenge.difficulty),    // Difficulty
                tx.pure.u64(challenge.points)        // Points
            ],
        });
    }

    // --- BƯỚC B: TẠO SINH VIÊN (Batching) ---
    console.log(`🎓 Đang đóng gói ${DUMMY_STUDENTS.length} hồ sơ sinh viên...`);

    for (const student of DUMMY_STUDENTS) {
        // Lưu ý: Để tiện test, mình gán Owner là chính ví Admin luôn.
        // Như vậy bạn login ví Admin là thấy hết các profile này để sửa.
        // Nếu muốn gán cho ví khác, thay keypair.toSuiAddress() bằng địa chỉ ví đó.
        
        tx.moveCall({
            target: `${CONFIG.PACKAGE_ID}::${MODULE_NAME}::create_profile`,
            arguments: [
                tx.object(CONFIG.ADMIN_CAP_ID),      // Admin Cap
                tx.pure.string(student.id),          // Student ID
                tx.pure.address(keypair.toSuiAddress()) // Owner Address
            ],
        });
    }

    // 3. Ký và Gửi Transaction
    console.log("⏳ Đang gửi transaction lên mạng (Đợi chút)...");
    
    try {
        const result = await client.signAndExecuteTransaction({
            signer: keypair,
            transaction: tx,
            options: {
                showEffects: true,
                showObjectChanges: true,
            },
        });

        console.log("✅ KHỞI TẠO DỮ LIỆU THÀNH CÔNG!");
        console.log(`🔗 Tx Hash: https://suiscan.xyz/${CONFIG.NETWORK}/tx/${result.digest}`);
        
        // In ra danh sách ID các object vừa tạo để tiện copy
        if (result.objectChanges) {
            console.log("\n--- KẾT QUẢ TẠO OBJECT ---");
            const created = result.objectChanges.filter((o: any) => o.type === 'created');
            console.log(`Tổng cộng tạo được: ${created.length} objects mới.`);
        }

    } catch (e) {
        console.error("❌ Lỗi khi gửi transaction:", e);
    }
}

main();