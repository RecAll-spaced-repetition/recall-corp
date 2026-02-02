import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { getCollectionQueryOptions } from '@/query/queryHooks';
import { Collection, updateCollectionCollectionsCollectionIdPut } from '@/api';
import { CollectionEditType } from '@/components/collection';

export const useCollectionUpdate = (
  collectionId: number,
  onSuccess?: (response: Collection) => void
) => {
  const queryClient = useQueryClient();
  const { mutate: updateCollection, ...rest } = useMutation({
    mutationFn: (data: CollectionEditType) =>
      dataExtractionWrapper(
        updateCollectionCollectionsCollectionIdPut({
          path: {
            collection_id: collectionId,
          },
          body: {
            ...data,
          },
        })
      ),
    onSuccess: (responseData) => {
      queryClient.setQueryData(
        getCollectionQueryOptions(collectionId).queryKey,
        responseData
      );
      onSuccess?.(responseData);
    },
  });
  return { updateCollection, ...rest };
};
