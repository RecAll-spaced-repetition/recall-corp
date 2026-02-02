import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { getProfileFilesQueryOptions } from '@/query/queryHooks';
import { deleteFileStorageFileIdDelete } from '@/api';

export const useFileDelete = (fileId: number, onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const { mutate: deleteFile, ...rest } = useMutation({
    mutationFn: () =>
      dataExtractionWrapper(
        deleteFileStorageFileIdDelete({ path: { file_id: fileId } })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getProfileFilesQueryOptions().queryKey,
      });
      onSuccess?.();
    },
  });
  return { deleteFile, ...rest };
};
