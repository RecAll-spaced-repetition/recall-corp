import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { getCollectionQueryOptions } from '@/query/queryHooks';
import { deleteCollectionCollectionsCollectionIdDelete } from '@/api';

export const useCollectionDelete = (
  collectionId: number,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient();
  const { mutate: deleteCollection, ...rest } = useMutation({
    mutationFn: () =>
      dataExtractionWrapper(
        deleteCollectionCollectionsCollectionIdDelete({
          path: {
            collection_id: collectionId,
          },
        })
      ),
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: getCollectionQueryOptions(collectionId).queryKey,
      });
      onSuccess?.();
    },
  });
  return { deleteCollection, ...rest };
};
