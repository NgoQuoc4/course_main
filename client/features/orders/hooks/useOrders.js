// features/orders/hooks/useOrders.js
// Custom hook cho Orders feature

import useQuery from "@/hooks/useQuery";
import { orderService } from "@/services/orderService";

/**
 * Hook lấy lịch sử thanh toán
 */
const usePaymentHistory = () => {
    const { data, loading, error, refetch } = useQuery(() =>
        orderService.getPaymentHistories()
    );

    return {
        payments: data?.data?.data?.orders || [],
        loading,
        error,
        refetch,
    };
};

/**
 * Hook lấy khóa học đã mua
 */
const useCourseHistory = () => {
    const { data, loading, error, refetch } = useQuery(() =>
        orderService.getCourseHistories()
    );

    return {
        courses: data?.data?.data?.orders || [],
        loading,
        error,
        refetch,
    };
};

export { usePaymentHistory, useCourseHistory };
