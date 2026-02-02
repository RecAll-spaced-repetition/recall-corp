import { useQuery, queryOptions } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { readCardCardsCardIdGet } from '@/api';

export const getCardQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['card', id],
    queryFn: () =>
      dataExtractionWrapper(
        readCardCardsCardIdGet({
          path: {
            card_id: id,
          },
        })
      ),
  });

export const useCard = (id: number) => {
  const { data: card, ...rest } = useQuery(getCardQueryOptions(id));

  return { card, ...rest };
};
