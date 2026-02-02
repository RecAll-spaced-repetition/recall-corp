import { deleteUserUserDeleteProfileDelete } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import {
  getProfileCardsQueryOptions,
  getProfileCollectionsQueryOptions,
  getProfileQueryOptions,
} from '@/query/queryHooks';

export const useProfileDelete = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const { mutate: deleteProfile, ...rest } = useMutation({
    mutationFn: () =>
      dataExtractionWrapper(deleteUserUserDeleteProfileDelete()),
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: getProfileQueryOptions().queryKey,
      });
      queryClient.resetQueries({
        queryKey: getProfileCardsQueryOptions().queryKey,
      });
      queryClient.resetQueries({
        queryKey: getProfileCollectionsQueryOptions().queryKey,
      });
      onSuccess?.();
    },
  });
  return { deleteProfile, ...rest };
};
