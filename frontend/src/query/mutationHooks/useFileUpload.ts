import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { addFileStoragePost, FileMeta } from '@/api';
import { getProfileFilesQueryOptions } from '@/query/queryHooks';

export const useFileUpload = (onSuccess?: (response: FileMeta) => void) => {
  const queryClient = useQueryClient();

  const { mutate: uploadFile, ...rest } = useMutation({
    mutationFn: (data: File) =>
      dataExtractionWrapper(
        addFileStoragePost({
          body: {
            file: data,
          },
        })
      ),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: getProfileFilesQueryOptions().queryKey,
      });
      onSuccess?.(response);
    },
  });
  return { uploadFile, ...rest };
};
