import { useQuery, queryOptions } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { readCollectionCardsCollectionsCollectionIdCardsGet } from '@/api';

export const getCollectionCardsQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['collection', id, 'cards'],
    queryFn: () =>
      dataExtractionWrapper(
        readCollectionCardsCollectionsCollectionIdCardsGet({
          path: {
            collection_id: id,
          },
        })
      ),
  });

export const useCollectionCards = (id: number) => {
  const { data: cards, ...rest } = useQuery(getCollectionCardsQueryOptions(id));

  return { cards, ...rest };
};
