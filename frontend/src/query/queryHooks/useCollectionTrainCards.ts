import { useQuery, queryOptions } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { trainCardsCollectionsCollectionIdCardsTrainGet } from '@/api';

export const getCollectionTrainCardsQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['collection', id, 'cards', 'train'],
    queryFn: () =>
      dataExtractionWrapper(
        trainCardsCollectionsCollectionIdCardsTrainGet({
          path: {
            collection_id: id,
          },
        })
      ),
  });

export const useCollectionTrainCards = (id: number) => {
  const { data: cards, ...rest } = useQuery(
    getCollectionTrainCardsQueryOptions(id)
  );

  return { cards, ...rest };
};
