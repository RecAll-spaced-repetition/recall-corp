import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import {
  getCardCollectionsQueryOptions,
  getCardQueryOptions,
} from '@/query/queryHooks';
import { Card, updateCardCardsCardIdPut } from '@/api';

export const useCardUpdate = (
  cardId: number,
  onSuccess?: (response: Card) => void
) => {
  const client = useQueryClient();
  const { mutate: updateCard, ...rest } = useMutation({
    mutationFn: (data: {
      new_card: { frontSide: string; backSide: string };
      collections: number[];
    }) =>
      dataExtractionWrapper(
        updateCardCardsCardIdPut({
          path: {
            card_id: cardId,
          },
          body: {
            ...data,
          },
        })
      ),
    onSuccess: (responseData) => {
      client.invalidateQueries({ queryKey: ['collection'] }); // TODO: подумать, как оптимизировать этот запрос
      client.invalidateQueries({
        queryKey: getCardCollectionsQueryOptions(responseData.id).queryKey,
      });
      client.setQueryData(
        getCardQueryOptions(responseData.id).queryKey,
        responseData
      );
      onSuccess?.(responseData);
    },
  });
  return { updateCard, ...rest };
};
