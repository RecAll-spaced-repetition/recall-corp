import { useQuery, queryOptions } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { readUserFilesUserFilesGet } from '@/api';
import { serverUrl } from '@/main';

export const getFileFullPath = (file_id: number) =>
  `${serverUrl}/storage/${file_id}`;

export const getProfileFilesQueryOptions = () =>
  queryOptions({
    queryKey: ['profile', 'files'],
    queryFn: () => dataExtractionWrapper(readUserFilesUserFilesGet()),
  });

export const useProfileFiles = () => {
  const { data: files, ...rest } = useQuery(getProfileFilesQueryOptions());

  return { files, ...rest };
};
