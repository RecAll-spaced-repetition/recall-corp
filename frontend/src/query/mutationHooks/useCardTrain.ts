import { useMutation } from '@tanstack/react-query';
import { dataExtractionWrapper } from '@/query';
import { createTrainRecordTrainRecordsCardIdPost } from '@/api';

export const useCardTrain = (cardId: number, onSuccess?: () => void) => {
  const { mutate: trainCard, ...rest } = useMutation({
    mutationFn: (mark: number) =>
      dataExtractionWrapper(
        createTrainRecordTrainRecordsCardIdPost({
          path: {
            card_id: cardId,
          },
          body: {
            mark: mark,
          },
        })
      ),
    onSuccess,
  });
  return { trainCard, ...rest };
};
