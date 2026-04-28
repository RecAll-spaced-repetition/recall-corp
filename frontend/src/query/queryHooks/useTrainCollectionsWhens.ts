import { CollectionShort } from '@/api';
import { useQueries } from '@tanstack/react-query';
import { getTrainCollectionWhenQueryOptions } from '@/query/queryHooks';

export type CollectionShortWithDate = CollectionShort & {
  date: Date;
  isNow?: boolean;
};

export const useTrainCollectionsWhens = (collections: CollectionShort[]) => {
  const { whenCollections, isPending, error } = useQueries({
    queries: collections.map((collection) =>
      getTrainCollectionWhenQueryOptions(collection.id)
    ),
    combine: (responses) => {
      if (responses.some((when) => when.isPending))
        return { whenCollections: [], isPending: true, error: undefined };

      const errorResponse = responses.find((when) => when.error);
      if (errorResponse)
        return {
          whenCollections: [],
          isPending: false,
          error: errorResponse.error,
        };

      const whenCollections: CollectionShortWithDate[] = responses
        .map(
          (response) =>
            response.data &&
            response.data.when.type !== 'never' && {
              ...response.data,
              date:
                response.data.when.type === 'due'
                  ? new Date(response.data.when.due)
                  : new Date(),
              isNow: response.data.when.type === 'now',
            }
        )
        .filter((date) => !!date);

      return { whenCollections, isPending: false, error: undefined };
    },
  });

  return { whenCollections, isPending, error };
};
