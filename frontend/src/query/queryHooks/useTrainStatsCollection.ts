import { useQuery, queryOptions } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { getCollectionStatsTrainStatsCollectionCollectionIdGet } from '@/api';

export const getTrainStatsCollectionQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['stats', 'collection', id],
    queryFn: () =>
      dataExtractionWrapper(
        getCollectionStatsTrainStatsCollectionCollectionIdGet({
          path: {
            collection_id: id,
          },
        })
      ),
  });

export const useTrainStatsCollection = (id: number) => {
  const { data: collectionStats, ...rest } = useQuery(
    getTrainStatsCollectionQueryOptions(id)
  );

  return { collectionStats, ...rest };
};
