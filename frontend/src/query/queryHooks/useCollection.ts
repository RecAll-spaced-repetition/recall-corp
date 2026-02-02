import { useQuery, queryOptions } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { readCollectionCollectionsCollectionIdGet } from '@/api';

export const getCollectionQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['collection', id],
    queryFn: () =>
      dataExtractionWrapper(
        readCollectionCollectionsCollectionIdGet({
          path: {
            collection_id: id,
          },
        })
      ),
  });

export const useCollection = (id: number) => {
  const { data: collection, ...rest } = useQuery(getCollectionQueryOptions(id));

  return { collection, ...rest };
};
