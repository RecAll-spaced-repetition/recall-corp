import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { getCollectionQueryOptions } from '@/query/queryHooks';
import {
  Collection,
  updateCollectionPublicityCollectionsCollectionIdPublicityPut,
} from '@/api';

export const useCollectionPublicityUpdate = (
  collectionId: number,
  onSuccess?: (response: Collection) => void
) => {
  const queryClient = useQueryClient();
  const { mutate: updateCollectionPublicity, ...rest } = useMutation({
    mutationFn: (is_public: boolean) =>
      dataExtractionWrapper(
        updateCollectionPublicityCollectionsCollectionIdPublicityPut({
          path: {
            collection_id: collectionId,
          },
          query: {
            is_public,
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
  return { updateCollectionPublicity, ...rest };
};
