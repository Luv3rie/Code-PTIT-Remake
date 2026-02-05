import { client } from './suiClient';

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;

/**
 * Lấy tất cả danh sách bài tập (Shared Objects)
 */
export const fetchAllChallenges = async () => {
    try {
        const objects = await client.getOwnedObjects({
            // Vì Challenge là Shared Object, ta query theo Type trong Package
            owner: PACKAGE_ID, 
            filter: { StructType: `${PACKAGE_ID}::code_ptit::Challenge` },
            options: { showContent: true }
        });

        return objects.data.map(obj => ({
            id: obj.data.objectId,
            name: obj.data.content.fields.name,
            language: obj.data.content.fields.language,
            difficulty: obj.data.content.fields.difficulty,
            point_value: parseInt(obj.data.content.fields.point_value)
        }));
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bài tập:", error);
        return [];
    }
};

/**
 * Lấy tất cả hồ sơ sinh viên (Dùng cho trang Admin)
 */
export const fetchAllProfiles = async () => {
    try {
        const objects = await client.getOwnedObjects({
            owner: PACKAGE_ID,
            filter: { StructType: `${PACKAGE_ID}::code_ptit::StudentProfile` },
            options: { showContent: true }
        });
        return objects.data.map(obj => ({
            id: obj.data.objectId,
            ...obj.data.content.fields
        }));
    } catch (error) {
        console.error("Lỗi khi lấy danh sách profile:", error);
        return [];
    }
};

/**
 * Lấy danh sách Huy hiệu sinh viên đang sở hữu
 */
export const fetchUserBadges = async (studentAddress) => {
    if (!studentAddress) return [];
    try {
        const objects = await client.getOwnedObjects({
            owner: studentAddress,
            filter: { StructType: `${PACKAGE_ID}::code_ptit::LanguageBadge` },
            options: { showContent: true }
        });

        return objects.data.map(obj => ({
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