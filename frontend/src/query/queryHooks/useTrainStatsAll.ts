import { useQuery, queryOptions } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { getUserStatsTrainStatsAllGet } from '@/api';

export const getTrainStatsAllQueryOptions = () =>
  queryOptions({
    queryKey: ['stats', 'all'],
    queryFn: () => dataExtractionWrapper(getUserStatsTrainStatsAllGet()),
  });

export const useTrainStatsAll = () => {
  const { data: trainStats, ...rest } = useQuery(
    getTrainStatsAllQueryOptions()
  );

  return { trainStats, ...rest };
};
