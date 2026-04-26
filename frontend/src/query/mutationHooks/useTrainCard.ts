import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { TrainCardExt, trainCardTrainCardIdPost } from '@/api';
import { getTrainStatsCardQueryOptions } from '@/query/queryHooks/';

export const useTrainCard = (
  cardId: number,
  onSuccess?: (data: TrainCardExt) => void
) => {
  const queryClient = useQueryClient();
  const { mutate: trainCard, ...rest } = useMutation({
    mutationFn: ({ mark, durationMs }: { mark: number; durationMs?: number }) =>
      dataExtractionWrapper(
        trainCardTrainCardIdPost({
          path: {
            card_id: cardId,
          },
          body: {
            mark,
            durationMs: durationMs ?? null,
          },
        })
      ),
    onSuccess: (data) => {
      queryClient.setQueryData(
        getTrainStatsCardQueryOptions(data.cardId).queryKey,
        data
      );
      // TODO: По хорошему надо ещё инвалидировать кучу разных query, но не уверен, что идея прям очень хорошая
      onSuccess?.(data);
    },
  });
  return { trainCard, ...rest };
};
