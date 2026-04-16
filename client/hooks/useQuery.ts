import { useEffect, useState, DependencyList } from 'react';

interface UseQueryResult<T> {
    data: T | undefined;
    loading: boolean;
    error: any;
    refetch: (query?: any) => Promise<void>;
}

const useQuery = <T,>(
    promise: (query?: any) => Promise<any>,
    dependencies: DependencyList = []
): UseQueryResult<T> => {
    const [data, setData] = useState<T>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>();

    useEffect(() => {
        fetchData();
    }, dependencies);

    const fetchData = async (query?: any) => {
        setLoading(true);
        try {
            const res = await promise(query);
            if (res?.data) {
                setData(res.data?.data);
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
};

export default useQuery;
