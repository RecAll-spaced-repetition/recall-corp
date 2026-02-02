import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import {
  getCardCollectionsQueryOptions,
  getCardQueryOptions,
  getProfileCardsQueryOptions,
} from '@/query/queryHooks';
import { deleteCardCardsCardIdDelete } from '@/api';

export const useCardDelete = (cardId: number, onSuccess?: () => void) => {
  const client = useQueryClient();
  const { mutate: deleteCard, ...rest } = useMutation({
    mutationFn: () =>
      dataExtractionWrapper(
        deleteCardCardsCardIdDelete({
          path: {
            card_id: cardId,
          },
        })
      ),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['collection'] }); // TODO: подумать, как оптимизировать этот запрос
      client.resetQueries({
        queryKey: getCardCollectionsQueryOptions(cardId).queryKey,
      });
      client.resetQueries({
        queryKey: getCardQueryOptions(cardId).queryKey,
      });
      client.invalidateQueries({
        queryKey: getProfileCardsQueryOptions().queryKey,
      });
      onSuccess?.();
    },
  });
  return { deleteCard, ...rest };
};
