import { client } from './suiClient';
import { fetchSharedObjectsByStruct, getOwnedObjectsForAddress } from './suiService';

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;

/**
 * Lấy tất cả danh sách bài tập (Shared Objects)
 */
export const fetchAllChallenges = async () => {
    try {
        // Query shared objects by StructType via suiService
        const objects = await fetchSharedObjectsByStruct(`${PACKAGE_ID}::code_ptit::Challenge`);
        const list = (objects.data || objects || []).map(obj => ({
            id: obj.data.objectId,
            name: obj.data.content.fields.name,
            language: obj.data.content.fields.language,
            difficulty: obj.data.content.fields.difficulty,
            point_value: parseInt(obj.data.content.fields.point_value)
        }));

        if (list && list.length > 0) {
            return list;
        }
        throw new Error('Empty response from RPC');
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bài tập từ RPC:", error);
        // Fallback for fullnodes that don't support query-by-struct or return errors
        try {
            const res = await fetch('/challenges.json');
            if (res.ok) {
                const json = await res.json();
                console.log("Using mock challenges data");
                return json;
            }
        } catch (e) {
            console.error('Fallback load failed:', e);
        }
        return [];
    }
};

/**
 * Lấy tất cả hồ sơ sinh viên (Dùng cho trang Admin)
 */
export const fetchAllProfiles = async () => {
    try {
        const objects = await fetchSharedObjectsByStruct(`${PACKAGE_ID}::code_ptit::StudentProfile`);
        const list = (objects.data || objects || []).map(obj => ({
            id: obj.data.objectId,
            ...obj.data.content.fields
        }));
        if (list && list.length > 0) {
            return list;
        }
        throw new Error('Empty response from RPC');
    } catch (error) {
        console.error("Lỗi khi lấy danh sách profile:", error);
        // Fallback to mock profiles
        try {
            const res = await fetch('/profiles.json');
            if (res.ok) {
                const json = await res.json();
                console.log("Using mock profiles data");
                return json;
            }
        } catch (e) {
            console.error('Fallback profiles load failed:', e);
        }
        return [];
    }
};

/**
 * Lấy danh sách Huy hiệu sinh viên đang sở hữu
 */
export const fetchUserBadges = async (studentAddress) => {
    if (!studentAddress) return [];
    const addr = String(studentAddress).trim();
    // Basic validation: must start with 0x and contain hex chars
    if (!/^0x[0-9a-fA-F]+$/.test(addr)) {
        console.error("fetchUserBadges: invalid Sui address:", studentAddress);
        return [];
    }
    try {
        const objects = await getOwnedObjectsForAddress(addr);
        const arr = objects.data || objects || [];
        const badgeObjs = arr.filter(o => {
            const struct = o?.data?.content?.type || '';
            return struct === `${PACKAGE_ID}::code_ptit::LanguageBadge`;
        });
        return badgeObjs.map(obj => ({
            id: obj.data.objectId,
            language: obj.data.content.fields.language,
            rank: obj.data.content.fields.rank
        }));
    } catch (error) {
        console.error("Lỗi khi lấy huy hiệu:", error);
        return [];
    }
};

/**
 * Kiểm tra trạng thái bài tập (Check ID trong Table completed_challenges)
 */
export const checkChallengeStatus = async (tableId, challengeId) => {
    if (!tableId || !challengeId) return false;
    try {
        const response = await client.getDynamicFieldObject({
            parentId: tableId,
            name: {
                type: '0x2::object::ID',
                value: challengeId
            }
        });
        // Nếu trả về data nghĩa là bài tập đã tồn tại trong Table -> Đã hoàn thành
        return !!response.data; 
    } catch (error) {
        // Thường lỗi do không tìm thấy Key (Chưa làm bài)
        return false; 
    }
};

/**
 * Lấy số lượng bài đã giải theo ngôn ngữ (Từ Table language_stats)
 */
export const getLanguageStat = async (tableId, language) => {
    if (!tableId || !language) return 0;
    try {
        const response = await client.getDynamicFieldObject({
            parentId: tableId,
            name: {
                type: '0x1::string::String',
                value: language
            }
        });
        // Lấy field 'value' bên trong Dynamic Field Object
        const statValue = response.data?.content?.fields?.value;
        return statValue ? parseInt(statValue) : 0;
    } catch (error) {
        return 0; 
    }
};