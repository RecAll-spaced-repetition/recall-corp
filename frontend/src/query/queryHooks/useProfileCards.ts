import { useQuery, queryOptions } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { readUserCardsUserCardsGet } from '@/api';

export const getProfileCardsQueryOptions = () =>
  queryOptions({
    queryKey: ['profile', 'cards'],
    queryFn: () => dataExtractionWrapper(readUserCardsUserCardsGet()),
  });

export const useProfileCards = () => {
  const { data: cards, ...rest } = useQuery(getProfileCardsQueryOptions());

  return { cards, ...rest };
};
