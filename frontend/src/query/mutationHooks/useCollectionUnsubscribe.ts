import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { getProfileSubscriptionsQueryOptions } from '@/query/queryHooks';
import {
  unsubscribeCollectionsCollectionIdUnsubscribeDelete,
  UnsubscribeCollectionsCollectionIdUnsubscribeDeleteResponse,
} from '@/api';

export const useCollectionUnsubscribe = (
  id: number,
  onSuccess?: (
    response: UnsubscribeCollectionsCollectionIdUnsubscribeDeleteResponse
  ) => void
) => {
  const queryClient = useQueryClient();
  const { mutate: unsubscribe, ...rest } = useMutation({
    mutationFn: () =>
      dataExtractionWrapper(
        unsubscribeCollectionsCollectionIdUnsubscribeDelete({
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
  return { unsubscribe, ...rest };
};
