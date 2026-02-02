import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import {
  getCollectionQueryOptions,
  getCollectionsQueryOptions,
} from '@/query/queryHooks';
import { Collection, createCollectionCollectionsPost } from '@/api';
import { CollectionEditType } from '@/components/collection';

export const useCollectionCreate = (
  onSuccess?: (response: Collection) => void
) => {
  const queryClient = useQueryClient();
  const { mutate: createCollection, ...rest } = useMutation({
    mutationFn: (data: CollectionEditType) =>
      dataExtractionWrapper(
        createCollectionCollectionsPost({
          body: {
            ...data,
          },
        })
      ),
    onSuccess: (data) => {
      queryClient.setQueryData(
        getCollectionQueryOptions(data.id).queryKey,
        data
      );
      queryClient.invalidateQueries({
        queryKey: getCollectionsQueryOptions().queryKey,
      });
      onSuccess?.(data);
    },
  });
  return { createCollection, ...rest };
};
