import { useQueries } from '@tanstack/react-query';
import { getTypeData } from '../api/types';

export function useTypeData(typeNames: string[]) {
  const results = useQueries({
    queries: typeNames.map(name => ({
      queryKey: ['type', name],
      queryFn: () => getTypeData(name),
      enabled: !!name,
    })),
  });

  return {
    data: results.map(r => r.data).filter(Boolean),
    isLoading: results.some(r => r.isLoading),
    isError: results.some(r => r.isError),
  };
}
