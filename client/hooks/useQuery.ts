import { useQuery as useReactQuery } from "@tanstack/react-query";
import { DependencyList } from "react";

const useQuery = <T = any,>(
  arg1: any,
  arg2: DependencyList = []
): any => {
  // 1. Signature mới: useQuery({ queryKey, queryFn, ...options })
  if (typeof arg1 === "object" && arg1 !== null && "queryKey" in arg1) {
    const { queryKey, queryFn, ...rest } = arg1;
    return useReactQuery({
      queryKey,
      queryFn: async () => {
        const res = await queryFn();
        return res?.data?.data;
      },
      ...rest,
    });
  }

  // 2. Signature cũ (Backward Compatibility): useQuery(promiseFn, dependencies)
  const promise = arg1 as (query?: any) => Promise<any>;
  const dependencies = arg2;
  const queryKey = ["customQuery", promise.toString(), ...dependencies];

  const queryResult = useReactQuery({
    queryKey,
    queryFn: async () => {
      const res = await promise();
      return res?.data?.data;
    },
  });

  return {
    data: queryResult.data as T | undefined,
    loading: queryResult.isLoading,
    error: queryResult.error,
    refetch: async () => {
      const res = await queryResult.refetch();
      return res.data;
    },
  };
};

export default useQuery;
