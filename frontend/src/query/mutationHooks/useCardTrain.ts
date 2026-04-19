import { useMutation } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { trainCardTrainCardIdPost } from '@/api';

export const useCardTrain = (cardId: number, onSuccess?: () => void) => {
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
    onSuccess,
  });
  return { trainCard, ...rest };
};
