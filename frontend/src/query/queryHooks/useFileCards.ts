import { useQuery, queryOptions } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { getFileCardsStorageFileIdCardsGet } from '@/api';

export const getFileCardsQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['file', id, 'cards'],
    queryFn: () =>
      dataExtractionWrapper(
        getFileCardsStorageFileIdCardsGet({
          path: {
            file_id: id,
          },
        })
      ),
  });

export const useFileCards = (id: number) => {
  const { data: fileCards, ...rest } = useQuery(getFileCardsQueryOptions(id));

  return { fileCards, ...rest };
};
