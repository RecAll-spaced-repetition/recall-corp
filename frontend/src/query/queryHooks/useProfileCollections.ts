import { useQuery, queryOptions } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { readUserCollectionsUserCollectionsGet } from '@/api';

export const getProfileCollectionsQueryOptions = () =>
  queryOptions({
    queryKey: ['profile', 'collections'],
    queryFn: () =>
      dataExtractionWrapper(readUserCollectionsUserCollectionsGet()),
  });

export const useProfileCollections = () => {
  const { data: collections, ...rest } = useQuery(
    getProfileCollectionsQueryOptions()
  );

  return { collections, ...rest };
};
