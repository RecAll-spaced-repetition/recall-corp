import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import {
  getCardCollectionsQueryOptions,
  getCardQueryOptions,
  getProfileCardsQueryOptions,
} from '@/query/queryHooks';
import { Card, createCardCardsPost } from '@/api';

export const useCardCreate = (onSuccess?: (response: Card) => void) => {
  const client = useQueryClient();
  const { mutate: createCard, ...rest } = useMutation({
    mutationFn: (data: {
      card: { frontSide: string; backSide: string };
      collections: number[];
    }) =>
      dataExtractionWrapper(
        createCardCardsPost({
          body: {
            ...data,
          },
        })
      ),
    onSuccess: (responseData) => {
      client.invalidateQueries({ queryKey: ['collection'] });
      client.invalidateQueries({
        queryKey: getCardCollectionsQueryOptions(responseData.id).queryKey,
      });
      client.invalidateQueries({
        queryKey: getProfileCardsQueryOptions().queryKey,
      });
      client.setQueryData(
        getCardQueryOptions(responseData.id).queryKey,
        responseData
      );
      onSuccess?.(responseData);
    },
  });
  return { createCard, ...rest };
};
