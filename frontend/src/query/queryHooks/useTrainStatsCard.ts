import { useQuery, queryOptions } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { getCardStatsTrainStatsCardCardIdGet } from '@/api';

export const getTrainStatsCardQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['stats', 'card', id],
    queryFn: () =>
      dataExtractionWrapper(
        getCardStatsTrainStatsCardCardIdGet({
          path: {
            card_id: id,
          },
        })
      ),
  });

export const useTrainStatsCard = (id: number) => {
  const { data: cardStats, ...rest } = useQuery(
    getTrainStatsCardQueryOptions(id)
  );

  return { cardStats, ...rest };
};
