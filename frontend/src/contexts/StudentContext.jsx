import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
    const account = useCurrentAccount();
    const [profile, setProfile] = useState(null);

    // 1. Query kiểm tra quyền Admin: Tìm Object Admin trong ví
    const { data: adminData } = useSuiClientQuery('getOwnedObjects', {
        owner: account?.address,
        filter: { 
            StructType: `${import.meta.env.VITE_PACKAGE_ID}::code_ptit::Admin` 
        }
    }, { enabled: !!account?.address });

    const isAdmin = useMemo(() => !!(adminData?.data && adminData.data.length > 0), [adminData]);

    // 2. Query tìm Profile theo ID cố định trong .env (Vì là Shared Object)
    const { data, isLoading, refetch } = useSuiClientQuery('getObject', {
        id: import.meta.env.VITE_STUDENT_PROFILE_ID,
        options: { showContent: true }
    }, { 
        enabled: !!account?.address,
        refetchOnWindowFocus: false 
    });

    useEffect(() => {
        // Kiểm tra xem dữ liệu trả về có đúng là StudentProfile không
        if (data?.data?.content?.fields) {
            const fields = data.data.content.fields;
            
            // LOG DEBUG: Mở Console (F12) để xem hai địa chỉ này có khớp nhau không
            console.log("Owner từ Blockchain:", fields.owner);
            console.log("Ví đang kết nối:", account?.address);

            // So sánh không phân biệt chữ hoa chữ thường để tránh lỗi định dạng Hex
            const isOwner = fields.owner?.toLowerCase() === account?.address?.toLowerCase();

            if (isOwner) {
                // Đưa toàn bộ fields vào profile và đính kèm ID để thực hiện transaction sau này
                setProfile({ 
                    ...fields, 
                    id: { id: data.data.objectId } // Format này giúp đồng bộ với tx.object(profile.id.id)
                });
            } else {
                console.warn("Cảnh báo: Ví kết nối không phải là chủ sở hữu của Profile ID này.");
                setProfile(null);
            }
        } else {
            setProfile(null);
        }
    }, [data, account]);

    return (
        <StudentContext.Provider value={{ 
            profile, 
            isLoading, 
            account, 
            isAdmin, 
            refetchProfile: refetch 
        }}>
            {children}
        </StudentContext.Provider>
    );
};

export const useStudent = () => useContext(StudentContext);