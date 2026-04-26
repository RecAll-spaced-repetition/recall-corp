import { useQuery, queryOptions } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { readUserSubscriptionsUserSubscriptionsGet } from '@/api';

export const getProfileSubscriptionsQueryOptions = () =>
  queryOptions({
    queryKey: ['profile', 'subscriptions'],
    queryFn: () =>
      dataExtractionWrapper(readUserSubscriptionsUserSubscriptionsGet()),
  });

export const useProfileSubscriptions = () => {
  const { data: collections, ...rest } = useQuery(
    getProfileSubscriptionsQueryOptions()
  );

  return { collections, ...rest };
};
