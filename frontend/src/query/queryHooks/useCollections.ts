import { useQuery, queryOptions } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import {
  readCollectionsCollectionsGet,
  ReadCollectionsCollectionsGetData,
} from '@/api';

export const getCollectionsQueryOptions = (
  query?: ReadCollectionsCollectionsGetData['query']
) =>
  queryOptions({
    queryKey: ['collections', query],
    queryFn: () =>
      dataExtractionWrapper(
        readCollectionsCollectionsGet({
          query: query,
        })
      ),
  });

export const useCollections = (
  query?: ReadCollectionsCollectionsGetData['query']
) => {
  const { data: collections, ...rest } = useQuery(
    getCollectionsQueryOptions(query)
  );

  return { collections, ...rest };
};
