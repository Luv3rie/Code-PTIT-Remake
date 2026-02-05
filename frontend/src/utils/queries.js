import { client } from './suiClient';

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;

/**
 * Lấy tất cả danh sách bài tập (Shared Objects)
 */
export const fetchAllChallenges = async () => {
    try {
        const objects = await client.queryObjects({
            filter: { StructType: `${PACKAGE_ID}::code_ptit::Challenge` },
            options: { showContent: true }
        });

        return objects.data.map(obj => ({
            id: obj.data.objectId,
            name: obj.data.content.fields.name,
            difficulty: obj.data.content.fields.difficulty,
            point_value: obj.data.content.fields.point_value
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
        const objects = await client.queryObjects({
            filter: { StructType: `${PACKAGE_ID}::code_ptit::StudentProfile` },
            options: { showContent: true }
        });
        return objects.data.map(obj => obj.data.content.fields);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách profile:", error);
        return [];
    }
};

/**
 * Lấy danh sách Huy hiệu sinh viên đang sở hữu (Owned Objects)
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

// ... Các hàm checkChallengeStatus, getLanguageStat giữ nguyên ...