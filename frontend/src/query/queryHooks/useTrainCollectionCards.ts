import { useQuery, queryOptions } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { getCollectionTrainCardsTrainCollectionCollectionIdCardsGet } from '@/api';

export const getTrainCollectionCardsQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['train', 'collection', id, 'cards'],
    queryFn: () =>
      dataExtractionWrapper(
        getCollectionTrainCardsTrainCollectionCollectionIdCardsGet({
          path: {
            collection_id: id,
          },
        })
      ),
  });

export const useTrainCollectionCards = (id: number) => {
  const { data: trainCards, ...rest } = useQuery(
    getTrainCollectionCardsQueryOptions(id)
  );

  return { trainCards, ...rest };
};
