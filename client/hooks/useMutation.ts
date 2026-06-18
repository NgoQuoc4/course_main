import { useMutation as useReactMutation } from "@tanstack/react-query";

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

const useMutation = <T = any>(
  promise: (payload?: any) => Promise<any>,
): UseMutationResult<T> => {
  const mutation = useReactMutation({
    mutationFn: async (payload?: any) => {
      const res = await promise(payload);
      return res?.data?.data;
    },
  });

  const execute = async (payload?: any, options?: UseMutationOptions<T>) => {
    const { onSuccess, onFail } = options || {};
    try {
      const responseData = await mutation.mutateAsync(payload);
      onSuccess?.(responseData);
    } catch (err) {
      onFail?.(err);
    }
  };

  // Dummy stub to prevent typescript compilation errors for pages destructuring setData
  const setData = () => {};

  return {
    execute,
    data: mutation.data as T | undefined,
    setData: setData as any,
    loading: mutation.isPending,
    error: mutation.error,
  };
};

export default useMutation;
