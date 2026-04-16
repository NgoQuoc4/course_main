import { useState } from "react";

interface UseMutationOptions<T> {
    onSuccess?: (data: T) => void;
    onFail?: (error: any) => void;
}

interface UseMutationResult<T> {
    execute: (payload?: any, options?: UseMutationOptions<T>) => Promise<void>;
    data: T | undefined;
    setData: React.Dispatch<React.SetStateAction<T | undefined>>;
    loading: boolean;
    error: any;
}

const useMutation = <T,>(
    promise: (payload?: any) => Promise<any>
): UseMutationResult<T> => {
    const [data, setData] = useState<T>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>();

    const execute = async (payload?: any, options?: UseMutationOptions<T>) => {
        const { onSuccess, onFail } = options || {};
        setLoading(true);
        try {
            const res = await promise(payload);
            const responseData = res.data?.data;
            setData(responseData);
            onSuccess?.(responseData);
        } catch (err) {
            setError(err);
            onFail?.(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        execute,
        data,
        setData,
        loading,
        error,
    };
};

export default useMutation;
