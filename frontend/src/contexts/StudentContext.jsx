import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';

// THÊM 'export' ở đây để các file khác có thể import { StudentContext }
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

    // 2. Query tìm Profile
    const { data, isLoading, refetch } = useSuiClientQuery('getObject', {
        id: import.meta.env.VITE_STUDENT_PROFILE_ID,
        options: { showContent: true }
    }, { 
        enabled: !!account?.address,
        refetchOnWindowFocus: false 
    });

    useEffect(() => {
        if (data?.data?.content?.fields) {
            const fields = data.data.content.fields;
            if (fields.owner === account?.address) {
                // Thêm objectId vào profile để các hàm giao dịch dễ lấy id
                setProfile({ ...fields, id: data.data.objectId });
            }
        } else {
            setProfile(null);
        }
    }, [data, account]);

    return (
        <StudentContext.Provider value={{ profile, isLoading, account, isAdmin, refetchProfile: refetch }}>
            {children}
        </StudentContext.Provider>
    );
};

export const useStudent = () => useContext(StudentContext);