import { useQuery, queryOptions } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { getCollectionTrainWhenTrainCollectionCollectionIdWhenGet } from '@/api';

export const getTrainCollectionWhenQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['train', 'collection', id, 'when'],
    queryFn: () =>
      dataExtractionWrapper(
        getCollectionTrainWhenTrainCollectionCollectionIdWhenGet({
          path: {
            collection_id: id,
          },
        })
      ),
  });

export const useTrainCollectionWhen = (id: number) => {
  const { data: trainWhen, ...rest } = useQuery(
    getTrainCollectionWhenQueryOptions(id)
  );

  return { trainWhen: trainWhen, ...rest };
};
