import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { getProfileSubscriptionsQueryOptions } from '@/query/queryHooks';
import {
  subscribeCollectionsCollectionIdSubscribePost,
  SubscribeCollectionsCollectionIdSubscribePostResponse,
} from '@/api';

export const useCollectionSubscribe = (
  id: number,
  onSuccess?: (
    response: SubscribeCollectionsCollectionIdSubscribePostResponse
  ) => void
) => {
  const queryClient = useQueryClient();
  const { mutate: subscribe, ...rest } = useMutation({
    mutationFn: () =>
      dataExtractionWrapper(
        subscribeCollectionsCollectionIdSubscribePost({
          path: { collection_id: id },
        })
      ),
    onSuccess: (data) => {
      queryClient.setQueryData(
        getProfileSubscriptionsQueryOptions().queryKey,
        data
      );
      onSuccess?.(data);
    },
  });
  return { subscribe, ...rest };
};
