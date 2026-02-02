import { useQuery, queryOptions } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { readCardCollectionsCardsCardIdCollectionsGet } from '@/api';

export const getCardCollectionsQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['card', id, 'collections'],
    queryFn: () =>
      dataExtractionWrapper(
        readCardCollectionsCardsCardIdCollectionsGet({
          path: {
            card_id: id,
          },
        })
      ),
  });

export const useCardCollections = (id: number) => {
  const { data: cardCollections, ...rest } = useQuery(
    getCardCollectionsQueryOptions(id)
  );

  return { cardCollections, ...rest };
};
