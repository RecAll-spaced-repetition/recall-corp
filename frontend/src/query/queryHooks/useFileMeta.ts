import { useQuery, queryOptions } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { getFileMetaStorageFileIdMetaGet } from '@/api';

export const getFileMetaQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['file', id, 'meta'],
    queryFn: () =>
      dataExtractionWrapper(
        getFileMetaStorageFileIdMetaGet({
          path: {
            file_id: id,
          },
        })
      ),
  });

export const useFileMeta = (id: number) => {
  const { data: fileMeta, ...rest } = useQuery(getFileMetaQueryOptions(id));

  return { fileMeta, ...rest };
};
